import axios from 'axios';

// Instancia pública de Axios (sin verificación de token)
const publicAxios = axios.create();

// Instancia protegida de Axios (con verificación de token)
const protectedAxios = axios.create();

// Agrega un interceptor de solicitud a `protectedAxios` para verificar el token
protectedAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // ✅ tu key real
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { publicAxios, protectedAxios };