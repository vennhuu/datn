import axios from "axios"
import NProgress from 'nprogress';

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
});

const instance = axios.create({
  baseURL: "",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ---- Request Interceptor ----
instance.interceptors.request.use(
  (config) => {
    NProgress.start();
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

// ---- Response Interceptor ----
instance.interceptors.response.use(
  (response) => {
    NProgress.done();
    if (response.data && response.data.data) return response.data;
    return response;
  },
  async (error) => {
    NProgress.done();

    const originalRequest = error.config;
    const status = error.response?.status;

    // ---- Xử lý 401 — tự động refresh token ----
    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh') &&
      !originalRequest.url.includes('/login')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return instance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await instance.get('/api/v1/auth/refresh');
        const newAccessToken = res?.data?.accessToken ?? res?.accessToken;

        if (!newAccessToken) throw new Error("Không lấy được access token mới");

        localStorage.setItem('access_token', newAccessToken);

        const user = res?.data?.user ?? res?.user;
        if (user) localStorage.setItem('user', JSON.stringify(user));

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
        return instance(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ---- Xử lý 403 — không có quyền ----
    if (status === 403) {
      return Promise.reject(error);
    }

    // ---- Các lỗi khác (400, 404, 500...) — trả data để component tự xử lý ----
    if (error.response?.data) return error.response.data;

    return Promise.reject(error);
  }
);

export default instance;