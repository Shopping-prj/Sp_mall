// src/service/axios.js
import axios from "axios";

// ✅ axios 인스턴스 생성 (항상 이 인스턴스만 사용)
const api = axios.create({
  baseURL: "http://localhost:8080",
});

// ✅ 요청 인터셉터: 매 요청마다 accessToken 자동 첨부
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터: 401/403 → refresh 시도
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // accessToken 만료 → refresh 시도
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // ✅ refresh 요청 (refreshToken을 body에 담아 전송)
        const res = await api.post("/api/users/refresh", { refreshToken });
        const newAccessToken = res.data.accessToken; // ⚠️ 백엔드 응답 키 확인 필요

        if (!newAccessToken) {
          throw new Error("새 accessToken을 받아오지 못했습니다.");
        }

        // 새 토큰 저장
        localStorage.setItem("accessToken", newAccessToken);

        // 원래 요청 헤더 갱신
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 실패했던 요청 재시도
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ refresh 실패:", refreshError);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
