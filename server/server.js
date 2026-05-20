/**
 * TRAVA Booking Backend
 * Express-сервер для проксирования запросов к Bnovo PMS и ЮKassa
 * Запуск: node server.js
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === Конфигурация ===
const CONFIG = {
  bnovo: {
    baseURL: process.env.BNOVO_BASE_URL || 'https://api.bnovo.ru',
    token: process.env.BNOVO_API_TOKEN,
    propertyId: process.env.BNOVO_PROPERTY_ID,
    roomIds: {
      '4p': process.env.BNOVO_ROOM_4P_ID || '123',
      '8p': process.env.BNOVO_ROOM_8P_ID || '456',
    }
  },
  yookassa: {
    baseURL: process.env.YOOKASSA_BASE_URL || 'https://api.yookassa.ru/v3',
    shopId: process.env.YOOKASSA_SHOP_ID,
    secretKey: process.env.YOOKASSA_SECRET_KEY,
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5500',
  port: process.env.PORT || 3000,
};

// === Bnovo HTTP Client ===
const bnovoClient = axios.create({
  baseURL: `${CONFIG.bnovo.baseURL}/v1/booking`,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${CONFIG.bnovo.token}`,
  },
  timeout: 15000,
});

// === YooKassa HTTP Client ===
const yookassaClient = axios.create({
  baseURL: CONFIG.yookassa.baseURL,
  auth: {
    username: CONFIG.yookassa.shopId,
    password: CONFIG.yookassa.secretKey,
  },
  headers: {
    'Content-Type': 'application/json',
    'Idempotence-Key': uuidv4(),
  },
  timeout: 15000,
});

// === Middleware: error handler ===
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// === API Routes ===

/**
 * GET /api/health
 * Проверка состояния сервера
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * POST /api/bnovo/availability
 * Проверка доступности номеров в Bnovo
 */
app.post('/api/bnovo/availability', asyncHandler(async (req, res) => {
  const { checkIn, checkOut, roomType } = req.body;
  
  if (!checkIn || !checkOut) {
    return res.status(400).json({ error: 'Необходимо указать даты заезда и выезда' });
  }

  const roomId = CONFIG.bnovo.roomIds[roomType] || CONFIG.bnovo.roomIds['4p'];

  try {
    // Вызов Bnovo API для проверки доступности
    const response = await bnovoClient.get('/availability', {
      params: {
        property_id: CONFIG.bnovo.propertyId,
        room_id: roomId,
        check_in: checkIn,
        check_out: checkOut,
      }
    });

    const available = response.data.data?.available !== false;
    
    res.json({
      available,
      roomId,
      roomType,
      checkIn,
      checkOut,
      alternativeDates: response.data.data?.alternative_dates || null,
      raw: response.data,
    });
  } catch (err) {
    console.error('Bnovo availability error:', err.response?.data || err.message);
    // Если API ещё не активен — возвращаем заглушку (для разработки)
    res.json({ 
      available: true, 
      roomId,
      roomType,
      checkIn,
      checkOut,
      _mock: true, // флаг, что это mock-ответ
    });
  }
}));

/**
 * POST /api/bnovo/booking
 * Создание брони в Bnovo
 */
app.post('/api/bnovo/booking', asyncHandler(async (req, res) => {
  const { checkIn, checkOut, roomType, adults, kids, name, phone, email, extras } = req.body;

  if (!checkIn || !checkOut || !name || !phone) {
    return res.status(400).json({ error: 'Необходимо заполнить все обязательные поля' });
  }

  const roomId = CONFIG.bnovo.roomIds[roomType] || CONFIG.bnovo.roomIds['4p'];
  
  // Формируем данные для Bnovo
  const bookingData = {
    property_id: CONFIG.bnovo.propertyId,
    room_id: roomId,
    check_in: checkIn,
    check_out: checkOut,
    guests: {
      adults: parseInt(adults) || 1,
      children: parseInt(kids) || 0,
    },
    guest: {
      name,
      phone,
      email: email || '',
    },
    extras: extras || [],
    source: 'website', // источник брони
  };

  try {
    const response = await bnovoClient.post('/bookings', bookingData);
    const bookingId = response.data.data?.id;
    const bookingNumber = response.data.data?.booking_number || response.data.data?.id;

    res.json({
      success: true,
      bookingId,
      bookingNumber,
      raw: response.data,
    });
  } catch (err) {
    console.error('Bnovo booking error:', err.response?.data || err.message);
    
    // Mock-ответ для разработки
    const mockBookingId = Math.floor(Math.random() * 900000) + 100000;
    res.json({
      success: true,
      bookingId: mockBookingId,
      bookingNumber: mockBookingId.toString(),
      _mock: true,
      note: 'Это mock-ответ. Подключите реальный API-ключ Bnovo в .env',
    });
  }
}));

/**
 * POST /api/yookassa/payment
 * Создание платежа в ЮKassa
 */
app.post('/api/yookassa/payment', asyncHandler(async (req, res) => {
  const { amount, bookingNumber, description, returnUrl } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Неверная сумма платежа' });
  }

  const paymentData = {
    amount: {
      value: amount.toFixed(2),
      currency: 'RUB',
    },
    capture: true,
    confirmation: {
      type: 'redirect',
      return_url: returnUrl || `${CONFIG.frontendUrl}/payment/success`,
    },
    description: description || `Бронирование TRAVA #${bookingNumber}`,
    metadata: {
      bookingNumber: bookingNumber?.toString(),
      source: 'trava-website',
    },
    receipt: {
      customer: {
        full_name: req.body?.customer?.name || 'Гость',
        email: req.body?.customer?.email || '',
        phone: req.body?.customer?.phone || '',
      },
      items: [
        {
          description: 'Проживание в загородном клубе TRAVA',
          quantity: '1.00',
          amount: {
            value: amount.toFixed(2),
            currency: 'RUB',
          },
          vat_code: '1', // Без НДС
          payment_mode: 'full_payment',
          payment_subject: 'service',
        }
      ],
    },
  };

  try {
    // Перегенерируем Idempotence-Key для уникальности платежа
    const response = await axios({
      method: 'POST',
      url: `${CONFIG.yookassa.baseURL}/payments`,
      auth: {
        username: CONFIG.yookassa.shopId,
        password: CONFIG.yookassa.secretKey,
      },
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': `trava_${bookingNumber}_${Date.now()}`,
      },
      data: paymentData,
      timeout: 15000,
    });

    const payment = response.data;
    
    res.json({
      success: true,
      paymentId: payment.id,
      paymentStatus: payment.status,
      paymentUrl: payment.confirmation?.confirmation_url,
      amount: payment.amount,
      raw: payment,
    });
  } catch (err) {
    console.error('YooKassa payment error:', err.response?.data || err.message);
    
    // Mock-ответ для разработки
    res.json({
      success: true,
      paymentId: `test_${Date.now()}`,
      paymentStatus: 'pending',
      paymentUrl: `${CONFIG.frontendUrl}/test-payment?amount=${amount}`,
      _mock: true,
      note: `Это mock-ответ. Подключите реальный API-ключ ЮKassa в .env. Ошибка: ${err.message}`,
    });
  }
}));

/**
 * POST /api/yookassa/webhook
 * Обработка webhook от ЮKassa
 */
app.post('/api/yookassa/webhook', asyncHandler(async (req, res) => {
  const { event, object: payment } = req.body;

  console.log('=== YooKassa Webhook ===');
  console.log('Event:', event);
  console.log('Payment ID:', payment?.id);
  console.log('Payment Status:', payment?.status);
  console.log('Payment Amount:', payment?.amount);
  console.log('Metadata:', payment?.metadata);

  if (event === 'payment.succeeded') {
    const bookingNumber = payment?.metadata?.bookingNumber;
    console.log(`Оплата подтверждена для брони #${bookingNumber}`);
    
    // Здесь можно обновить статус брони в Bnovo или БД
    // await updateBookingStatus(bookingNumber, 'paid');
    
    // TODO: Отправить уведомление клиенту
  } else if (event === 'payment.canceled') {
    const bookingNumber = payment?.metadata?.bookingNumber;
    console.log(`Оплата отменена для брони #${bookingNumber}`);
    
    // TODO: Обновить статус или отправить напоминание
  }

  // Всегда отвечаем 200 OK, даже если event неизвестен
  res.status(200).send();
}));

/**
 * GET /api/booking/status/:id
 * Проверка статуса брони
 */
app.get('/api/booking/status/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    const response = await bnovoClient.get(`/bookings/${id}`);
    res.json(response.data);
  } catch (err) {
    console.error('Bnovo status check error:', err.response?.data || err.message);
    res.json({
      status: 'unknown',
      _mock: true,
      note: 'Подключите реальный API-ключ для получения настоящего статуса',
    });
  }
}));

// === Static Frontend (опционально) ===
app.use(express.static(path.join(__dirname, '..')));

// === Error Handler ===
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Внутренняя ошибка сервера',
    message: err.message,
  });
});

// === Start Server ===
app.listen(CONFIG.port, () => {
  console.log(`\n=====================================`);
  console.log(` TRAVA Booking Backend запущен`);
  console.log(` URL: http://localhost:${CONFIG.port}`);
  console.log(` =====================================`);
  console.log(` Эндпоинты:`);
  console.log(`   POST /api/bnovo/availability      — проверка доступности`);
  console.log(`   POST /api/bnovo/booking             — создание брони`);
  console.log(`   POST /api/yookassa/payment          — создание платежа`);
  console.log(`   POST /api/yookassa/webhook          — webhook ЮKassa`);
  console.log(`   GET  /api/booking/status/:id        — статус брони`);
  console.log(` =====================================\n`);
  
  if (!CONFIG.bnovo.token || CONFIG.bnovo.token === 'your_bnovo_api_token_here') {
    console.warn(`⚠  BNOVO_API_TOKEN не настроен! Работает в mock-режиме.`);
  }
  if (!CONFIG.yookassa.shopId || CONFIG.yookassa.shopId === 'your_shop_id_here') {
    console.warn(`⚠  YOOKASSA_SHOP_ID не настроен! Работает в mock-режиме.`);
  }
});
