import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3005";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["Cache-Control"] = "no-cache";
  return config;
});

export const getApiError = (error, fallback = "Ocurrio un error inesperado") => {
  return error.response?.data?.error || error.response?.data?.message || fallback;
};

export const petsApi = {
  listFeed: (params) => api.get("/api/pets", { params }),
  listMine: () => api.get("/api/pets/my-pets"),
  getById: (id) => api.get(`/api/pets/${id}`),
  create: (formData) => api.post("/api/pets", formData),
  update: (id, formData) => api.put(`/api/pets/${id}`, formData),
  remove: (id) => api.delete(`/api/pets/${id}`),
  addPhotos: (id, formData) => api.post(`/api/pets/${id}/photos`, formData),
  removePhoto: (id, photoUrl) => api.delete(`/api/pets/${id}/photos`, { data: { photoUrl } }),
};

export const authApi = {
  me: () => api.get("/api/auth/me"),
};

export const adminApi = {
  stats: () => api.get("/api/admin/stats"),
  pets: (params) => api.get("/api/admin/pets", { params }),
  matches: () => api.get("/api/admin/matches"),
  users: (params) => api.get("/api/admin/users", { params }),
  userById: (id) => api.get(`/api/admin/users/${id}`),
  updateUser: (id, payload) => api.put(`/api/admin/users/${id}`, payload),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
};

export const matchesApi = {
  swipe: (payload) => api.post("/api/matches/swipe", payload),
  listByPet: (petId) => api.get(`/api/matches/${petId}`),
};

export const messagesApi = {
  listByRoom: (roomId) => api.get(`/api/messages/${roomId}`),
};

export default api;
