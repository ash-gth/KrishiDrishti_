import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
  },
});

// ── Request interceptor ─────────────────────────────────────────────
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ── Response interceptor ────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// ── API Methods ─────────────────────────────────────────────────────

/**
 * POST /api/detect
 * Uploads an image and returns disease detection result.
 * @param {File} imageFile
 * @param {function} onProgress - upload progress callback (0-100)
 */
export const detectDisease = async (imageFile, onProgress) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  return api.post('/api/detect', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) {
        onProgress(Math.round((evt.loaded / evt.total) * 100));
      }
    },
  });
};

/**
 * GET /api/history
 * Fetches paginated detection history with optional filters.
 */
export const getHistory = async ({ page = 1, pageSize = 20, plant = '', disease = '' } = {}) => {
  const params = { page, page_size: pageSize };
  if (plant) params.plant = plant;
  if (disease) params.disease = disease;
  return api.get('/api/history', { params });
};

/**
 * GET /api/history/:id
 * Fetches a single detection record.
 */
export const getHistoryRecord = async (id) => {
  return api.get(`/api/history/${id}`);
};

/**
 * DELETE /api/history/:id
 */
export const deleteHistoryRecord = async (id) => {
  return api.delete(`/api/history/${id}`);
};

/**
 * GET /health
 */
export const healthCheck = async () => {
  return api.get('/health');
};

export default api;
