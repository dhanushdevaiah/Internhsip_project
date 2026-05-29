import axios from "axios";

/**
 * Axios Instance
 * Centralises API config so you only change the base URL in one place.
 * Interceptors handle global request/response logic (auth headers, error toasts, etc.)
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 10000,           // abort requests taking longer than 10s
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Runs before every request – good place to attach auth tokens
api.interceptors.request.use(
  (config) => {
    // Example: attach JWT token if it exists
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Runs after every response – good place for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status outside 2xx
      console.error("API Error:", error.response.data?.message || error.message);

      if (error.response.status === 401) {
        // Handle unauthorised – redirect to login, clear storage, etc.
        console.warn("Unauthorised – please log in");
      }
    } else if (error.request) {
      // Request was made but no response (network issue)
      console.error("Network Error – no response received");
    }

    return Promise.reject(error);
  }
);

export default api;
