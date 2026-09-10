import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const AUTH_ATTEMPT_ENDPOINTS = ["/auth/login", "/auth/register"];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isAuthAttempt = AUTH_ATTEMPT_ENDPOINTS.some((endpoint) =>
      url.includes(endpoint)
    );

    // A 401 on a login/register attempt is a normal validation failure
    // (bad credentials). The caller handles it and shows the message.
    // Only session-dependent 401s should clear the session globally.
    if (error.response?.status === 401 && !isAuthAttempt) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default api;