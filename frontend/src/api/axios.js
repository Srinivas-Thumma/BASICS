import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, //Automatically prefixes all your requests with your server's backend URL. the one stored in .env
  withCredentials: true,
  headers: { //Tells the backend server that the payload format you are sending in the body of POST, PUT, or PATCH requests is JSON.
    "Content-Type": "application/json",
  },
});

let csrfToken = null;

const getCsrfToken = async () => {
  const response = await api.get("/auth/csrf");
  csrfToken = response.data.csrfToken;
  return csrfToken;
};

api.interceptors.request.use(async (config) => {
  const method = config.method?.toUpperCase();

  const safeMethods = ["GET", "HEAD", "OPTIONS"];

  if (!safeMethods.includes(method)) {
    if (!csrfToken) {
      await getCsrfToken();
    }

    config.headers["X-CSRF-Token"] = csrfToken;
  }

  return config;
});


let isRefreshing = false;
let refreshPromise = null;

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    // Only try refresh when the backend says the access token is invalid/expired.
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url === "/auth/refresh"
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = api.post("/auth/refresh");
      }

      await refreshPromise;

      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  }
);

export default api;