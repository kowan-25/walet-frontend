import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const accessToken = Cookies.get('accessToken')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  async (error) => {
    
    const originalRequest = error.config;

    if (originalRequest.url?.includes('/login') || originalRequest.url?.includes('/register')
    || originalRequest.url?.includes('/verify')) {
      return
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) {
        window.location.href = '/login';
        return;
      }

      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/token/refresh`, {
          refresh: refreshToken,
        });

        Cookies.set("accessToken", res.data.access)
        Cookies.set("refreshToken", res.data.refresh)

        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        
        return api(originalRequest);
      } catch (err) {
        console.error('Token expired');
        
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);


export default api;