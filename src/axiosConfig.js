import axios from 'axios';

// 1. Definir la URL base. 
// Usamos la variable de entorno de Vite. Si no existe (ej. en local), usa localhost.
const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

// 2. Crear las instancias CON la baseURL configurada
const publicAxios = axios.create({
  baseURL: baseURL 
});

const protectedAxios = axios.create({
  baseURL: baseURL
});

// 3. Interceptor para el token (esto lo tenías bien, lo mantenemos)
protectedAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { publicAxios, protectedAxios };