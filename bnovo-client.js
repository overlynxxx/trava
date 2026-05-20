/**
 * Bnovo Frontend API Client
 * Ходить через наш backend-proxy (CORS)
 */
const BnovoClient = {
  baseURL: TRAVA_CONFIG.API_BASE_URL + '/api/bnovo',

  async checkAvailability({ checkIn, checkOut, roomType }) {
    const response = await fetch(`${this.baseURL}/availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkIn, checkOut, roomType }),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  async createBooking(bookingData) {
    const response = await fetch(`${this.baseURL}/booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  async getBookingStatus(bookingId) {
    const response = await fetch(`${TRAVA_CONFIG.API_BASE_URL}/api/booking/status/${bookingId}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }
};

// Экспорт
window.BnovoClient = BnovoClient;
