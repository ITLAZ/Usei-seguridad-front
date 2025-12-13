import axios from 'axios';

let cachedUrl = null;

export async function getBackendUrl() {
  if (cachedUrl) return cachedUrl;

  const candidates = [];
  if (import.meta.env.VITE_BACKEND_URL) candidates.push(import.meta.env.VITE_BACKEND_URL);
  // common local dev ports - try 8082 first since that's where backend is running
  candidates.push('http://localhost:8082');
  candidates.push('http://localhost:8080');
  candidates.push('http://localhost:8081');
  candidates.push('http://localhost:8090');

  const probe = axios.create({ timeout: 1500 });

  for (const base of candidates) {
    try {
      // Try a lightweight ping endpoint
      const url = `${base.replace(/\/$/, '')}/configuracion-seguridad/ping`;
      const resp = await probe.get(url);
      // Any response (including 200/401/403/404) means the host is reachable
      cachedUrl = base.replace(/\/$/, '');
      return cachedUrl;
    } catch (err) {
      // If error is network-level (no connection), continue. If response exists but status is error, treat as reachable.
      if (err && err.response) {
        cachedUrl = base.replace(/\/$/, '');
        return cachedUrl;
      }
      // else network error -> try next
    }
  }

  // If none matched, default to env var or localhost:8080
  cachedUrl = import.meta.env.VITE_BACKEND_URL || 'https://usei-seguridad-back-production.up.railway.app';
  return cachedUrl;
}

export function resetBackendUrlCache() {
  cachedUrl = null;
}
