import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL,
  timeout: 5000,
});

export const fetchTelemetrySnapshot = async () => {
  const response = await api.get('/telemetry/snapshot');
  return response.data;
};

export const fetchRecentEvents = async (limit = 50, eventType = '') => {
  const params = { limit };
  if (eventType) params.event_type = eventType;
  const response = await api.get('/telemetry/events', { params });
  return response.data;
};

export default api;
