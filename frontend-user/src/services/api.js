import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.dispatchEvent(new CustomEvent('unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const uploadAvatar = async (fileOrBlob) => {
  const formData = new FormData();
  formData.append('file', fileOrBlob, 'avatar.webp');
  const res = await api.post('/auth/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const deleteAvatar = async () => {
  const res = await api.delete('/auth/me/avatar');
  return res.data;
};

export const getContacts = async () => {
  const res = await api.get('/contacts');
  return res.data;
};

export const addContact = async (payload) => {
  const res = await api.post('/contacts', payload);
  return res.data;
};

export const removeContact = async (contactId) => {
  const res = await api.delete(`/contacts/${contactId}`);
  return res.data;
};

export const searchUsers = async (query) => {
  const res = await api.get('/users/search', { params: { q: query } });
  return res.data;
};

export default api;
