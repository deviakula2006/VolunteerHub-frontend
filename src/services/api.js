import axios from "axios";

const api = axios.create({
  // Point to the local backend server you just started instead of production
  baseURL: "https://volunteer-hub-backend-5z2n.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
