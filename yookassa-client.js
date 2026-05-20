/**
 * YooKassa Frontend API Client
 * Создание платежей через backend-proxy
 */
const YooKassaClient = {
  baseURL: TRAVA_CONFIG.API_BASE_URL + '/api/yookassa',

  async createPayment({ amount, bookingNumber, description, returnUrl, customer }) {
    const response = await fetch(`${this.baseURL}/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        bookingNumber,
        description,
        returnUrl,
        customer,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },
};

// Экспорт
window.YooKassaClient = YooKassaClient;
