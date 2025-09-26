// src/context/AuthContext.jsx
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authKey, setAuthKey] = useState(0); // 🔑 재마운트 트리거

  // ✅ 토큰 유무로 로그인 여부 판정
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const isLoggedIn = !!!!token;

  const role = useMemo(()=>{
    if(!token) return null
    try {
      const decoded = jwtDecode(token)
      return decoded?.role ?? null
    } catch (error) {
      console.error("토큰 디코딩 실패", error)
      return null
    }
  })
  // ✅ 로그인 처리 (토큰만 저장)
  const login = ({ token: newToken, accessToken: newAccessToken, member } = {}) => {
    const finalToken = newToken ?? newAccessToken
    if(!finalToken){
      console.error("토큰이 없습니다");
      return
    }
    // 토큰만 저장 (role은 로컬에 따로 저장하지 않음)
    localStorage.setItem("accessToken", finalToken);
    // axios 기본 헤더 설정 (백엔드 호출 시 인증 필요하면 사용)
    axios.defaults.headers.common["Authorization"] = `Bearer ${finalToken}`;
    // 강제 리렌더/재마운트 트리거
    setAuthKey((prev) => prev + 1);
    navigate("/")
  };

  // ✅ 로그아웃 처리
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("cartItems");
    setAuthKey((prev) => prev + 1); // 강제 리렌더링
    navigate("/login");
  };

    // ✅ 인증 라우트 (로그인 필요)
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // ✅ 공개 라우트 (로그인 시 접근 불가 → 홈으로 보냄)
  const PublicRoute = ({ children }) => {
    if (isLoggedIn) {
      return <Navigate to="/shop" replace />;
    }
    return children;
  };

  return (
    <AuthContext.Provider
      key={authKey}
      value={{ isLoggedIn, role, login, logout, ProtectedRoute, PublicRoute }}
    >
      {children}
    </AuthContext.Provider>
  );
};
