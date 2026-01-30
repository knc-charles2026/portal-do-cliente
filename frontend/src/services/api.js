// src/services/api.js
import axios from "axios";

// Base URL relativa para produção/Nginx
const api = axios.create({
  baseURL: "/portal-do-cliente/api",
  headers: {
    "Content-Type": "application/json",
  },
});
export default api;



// Interceptor de erro opcional
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na API:", error.response || error.message);
    return Promise.reject(error);
  }
);

// Funções auxiliares
export const get = (url, config = {}) => api.get(url, config).then(res => res.data);
export const post = (url, body, config = {}) => api.post(url, body, config).then(res => res.data);
export const put = (url, body, config = {}) => api.put(url, body, config).then(res => res.data);
export const del = (url, config = {}) => api.delete(url, config).then(res => res.data);

// Endpoints específicos
//export const fetchOportunidades = () => get("/oportunidades/");
export const fetchOportunidades = () => get("/oportunidades/oportunidades/");
export const fetchChat = () => get("/home/chat");


