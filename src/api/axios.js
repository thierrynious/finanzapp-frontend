import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const url = config.url || "";

  const isPublicRequest =
    url === "/auth/login" || url === "/users";

  if (token && !isPublicRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Nur für normale JSON-Requests setzen, nicht für FormData / Uploads
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url || "";

    const isAuthRequest =
      url === "/auth/login" || url === "/users";

    // Nur bei echtem Auth-Fehler automatisch ausloggen
    if (
      status === 401 &&
      !isAuthRequest &&
      !window.location.pathname.includes("/login") &&
      !window.location.pathname.includes("/register")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

export default api;