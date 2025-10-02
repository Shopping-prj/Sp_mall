import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { getAuthContextRef } from "context/AuthContext";
console.log(":흰색_확인_표시: axios.js 로드됨");
// -------------------------------------------------------------
// :모래가_내려오고_있는_모래시계: 토큰 만료 임박 체크 함수
// - 토큰 없으면 true 반환 → 즉 refresh 시도
// - exp - now < 60 → 만료까지 60초 이하 → refresh 시도
// -------------------------------------------------------------
const isTokenExpiringSoon = (token) => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token); // 토큰 디코딩해서 만료 시각 추출
    const now = Math.floor(Date.now() / 1000); // 현재 시간(초 단위)
    return exp - now < 60; // 남은 시간이 60초 미만이면 true
  } catch {
    return true; // 토큰 파싱 실패 → refresh 필요
  }
};
// -------------------------------------------------------------
// :흰색_확인_표시: axios 인스턴스 생성
// - api: 일반 API 요청용
// - refreshApi: refresh 토큰 요청용 (인터셉터 없음)
// -------------------------------------------------------------
const api = axios.create({
  baseURL: "http://localhost:8080",
});
const refreshApi = axios.create({
  baseURL: "http://localhost:8080",
});
// -------------------------------------------------------------
// :흰색_확인_표시: 요청(Request) 인터셉터
// - 요청 보내기 직전에 실행됨
// - 토큰 만료 임박하면 미리 refresh 호출 → 새 토큰 반영
// -------------------------------------------------------------
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("accessToken");
    // (1) AccessToken 만료 임박 여부 확인
    if (isTokenExpiringSoon(token)) {
      console.log(":모래가_내려오고_있는_모래시계: accessToken 만료 임박 → refresh 시도");
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          // (2) refresh API 요청
          const res = await refreshApi.post("/api/users/refresh", { refreshToken });
          const newAccessToken = res.data.accessToken;
          if (newAccessToken) {
            console.log(":시계_반대_방향_화살표: 새 accessToken 발급:", newAccessToken);
            // (3) localStorage 갱신
            localStorage.setItem("accessToken", newAccessToken);
            // (4) AuthContext 갱신
            const ctx = getAuthContextRef();
            if (ctx?.setToken) ctx.setToken(newAccessToken);
            // (5) 요청에 최신 토큰 반영
            token = newAccessToken;
          }
        } catch (err) {
          console.error(":x: 선제적 refresh 실패", err);
          const ctx = getAuthContextRef();
          if (ctx?.logout) ctx.logout(); // refresh 실패 → 강제 로그아웃
        }
      }
    }
    // (6) Authorization 헤더에 토큰 추가
    if (token) config.headers.Authorization = `Bearer ${token}`;
    console.log(":압정: [Request 인터셉터 실행]", {
      url: config.url,
      method: config.method,
      token,
    });
    return config;
  },
  (error) => Promise.reject(error)
);
// -------------------------------------------------------------
// :흰색_확인_표시: 응답(Response) 인터셉터
// - 서버 응답이 401일 경우 → refresh 시도
// - refresh 성공 시 → 새 토큰 반영 후 요청 재실행
// -------------------------------------------------------------
api.interceptors.response.use(
  (res) => {
    console.log(":압정: [Response 성공]", res.status, res.config.url);
    return res;
  },
  async (error) => {
    console.log(":압정: [Response 에러 감지]", error.response?.status, error.config?.url);
    const originalRequest = error.config;
    // (1) accessToken 만료로 401 발생했을 때만 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한루프 방지
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("refreshToken 없음");
        console.log(":압정: [Refresh 시도] refreshToken:", refreshToken);
        // (2) refresh API 호출
        const res = await refreshApi.post("/api/users/refresh", { refreshToken });
        console.log(":압정: [Refresh 응답]", res.data);
        const newAccessToken = res.data.accessToken;
        if (!newAccessToken) throw new Error("새 accessToken 없음");
        // (3) localStorage 갱신
        localStorage.setItem("accessToken", newAccessToken);
        // (4) AuthContext 갱신
        const ctx = getAuthContextRef();
        if (ctx?.setToken) {
          ctx.setToken(newAccessToken);
          console.log(":압정: [AuthContext 갱신] 새 토큰 반영");
        }
        // (5) 실패했던 요청에 새 토큰 붙여서 재실행
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error(":x: refresh 실패:", refreshError);
        const ctx = getAuthContextRef();
        if (ctx?.logout) ctx.logout(); // refresh도 실패 → 강제 로그아웃
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
export default api;