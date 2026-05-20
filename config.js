/**
 * TRAVA Frontend Config
 * API endpoints для бронирования и оплаты
 */
const TRAVA_CONFIG = {
  // Backend API URL (заменить на реальный после деплоя)
  API_BASE_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://trava-backend.onrender.com', // заменить на реальный URL backend

  // Bnovo Room IDs (копия из backend .env, для справки frontend)
  ROOM_IDS: {
    '4p': '123',
    '8p': '456',
  },

  // Frontend URL для редиректа после оплаты
  FRONTEND_URL: window.location.origin,
};

// Экспорт для use в модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TRAVA_CONFIG;
}
