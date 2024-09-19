// src/services/api.js
import axios from "axios";

const API_URL = "http://tu-api-url.com";

const register = async (formData) => {
  return axios.post(`${API_URL}/register`, formData);
};

const login = async (formData) => {
  return axios.post(`${API_URL}/login`, formData);
};

const downloadUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

const encryptFile = async (file, key) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("key", key);
  return axios.post(`${API_URL}/encrypt`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const decryptFile = async (file, key) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("key", key);
  return axios.post(`${API_URL}/decrypt`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const logout = () => {
  // Implementa la lógica de cierre de sesión si es necesario
};

export default {
  register,
  login,
  downloadUsers,
  encryptFile,
  decryptFile,
  logout,
};
