import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3001/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("shopez_token");
  if (token) config.headers.Authorization = "Bearer " + token;
  return config;
});

export function serverMessage(err, fallback) {
  if (err && err.response && err.response.data && err.response.data.message) {
    return err.response.data.message;
  }
  return fallback;
}

export default api;
