import axios from "axios"
import NProgress from 'nprogress';

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
});

const instance = axios.create({
  baseURL: "",
  withCredentials: true, // ⚠️ Bắt buộc để gửi/nhận cookie refresh_token
});

// ---- Cờ chống gọi refresh nhiều lần đồng thời ----
let isRefreshing = false;
let failedQueue = []; // Hàng đợi các request bị 401 trong lúc đang refresh

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ---- Request Interceptor ----
instance.interceptors.request.use(
  function (config) {
    NProgress.start();
    const token = window.localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  function (error) {
    NProgress.done();
    return Promise.reject(error);
  }
);

// ---- Response Interceptor ----
instance.interceptors.response.use(
  function (response) {
    NProgress.done();
    if (response.data && response.data.data) return response.data;
    return response;
  },
  async function (error) {
    NProgress.done();

    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa retry lần nào
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      // Tránh loop vô tận nếu chính /auth/refresh cũng 401
      !originalRequest.url.includes('/auth/refresh') &&
      !originalRequest.url.includes('/login')
    ) {
      if (isRefreshing) {
        // Đang refresh rồi → xếp hàng chờ
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
        // Gọi refresh — cookie refresh_token tự động gửi kèm nhờ withCredentials
        const res = await instance.get('/api/v1/auth/refresh');

        const newAccessToken = res?.data?.accessToken ?? res?.accessToken;

        if (!newAccessToken) throw new Error("Không lấy được access token mới");

        // Lưu token mới
        localStorage.setItem('access_token', newAccessToken);

        // Cập nhật thông tin user nếu có
        if (res?.data?.user ?? res?.user) {
          localStorage.setItem('user', JSON.stringify(res?.data?.user ?? res?.user));
        }

        // Thông báo cho hàng đợi
        processQueue(null, newAccessToken);

        // Retry request gốc
        originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
        return instance(originalRequest);

      } catch (refreshError) {
        // Refresh thất bại → đăng xuất
        processQueue(refreshError, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.data) return error.response.data;
    return Promise.reject(error);
  }
);

export default instance;