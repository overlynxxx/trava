# TRAVA Booking Backend

Express-сервер для обработки бронирований через Bnovo PMS и приёма платежей через ЮKassa.

## Быстрый старт

```bash
cd server
cp .env.example .env
npm install
npm start
```

Сервер будет доступен на `http://localhost:3000`.

## API Endpoints

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/health` | Проверка работоспособности |
| POST | `/api/bnovo/availability` | Проверить доступность номеров |
| POST | `/api/bnovo/booking` | Создать бронь в Bnovo |
| POST | `/api/yookassa/payment` | Создать платёж в ЮKassa |
| POST | `/api/yookassa/webhook` | Webhook от ЮKassa о статусе оплаты |
| GET | `/api/booking/status/:id` | Проверить статус брони |

## Переменные окружения (.env)

```bash
# Bnovo PMS
BNOVO_API_TOKEN=your_token_here
BNOVO_ROOM_4P_ID=123
BNOVO_ROOM_8P_ID=456
BNOVO_PROPERTY_ID=789

# ЮKassa
YOOKASSA_SHOP_ID=your_shop_id
YOOKASSA_SECRET_KEY=your_secret_key

# Сервер
PORT=3000
FRONTEND_URL=https://overlynxxx.github.io/trava
```

## Деплой

Рекомендуемые платформы:
- **Render** (бесплатный tier): Create Web Service → Environment `Node` → Start `npm start`
- **Railway**: Подключить репозиторий, переменные окружения в Settings
- **VPS**: `git clone`, `npm install`, `pm2 start server.js`

## Webhook ЮKassa

Настройте webhook в личном кабинете ЮKassa:
```
URL: https://your-backend.com/api/yookassa/webhook
```

## Mock-режим

Если API-ключи не настроены, backend автоматически работает в mock-режиме — возвращает успешные ответы, но НЕ создаёт настоящие брони и платежи. Это удобно для разработки.

## Безопасность

- Никогда не коммитьте `.env`!
- `.env` уже добавлен в `.gitignore`
- Для production используйте `https://`
- Установите `CORS_ORIGIN` только на свой frontend
