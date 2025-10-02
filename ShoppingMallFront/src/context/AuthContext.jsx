// src/context/AuthContext.jsx
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authKey, setAuthKey] = useState(0); // 🔑 재마운트 트리거

  // ✅ 토큰 유무로 로그인 여부 판정
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const isLoggedIn = !!!!token;

  // ✅ 토큰에서 role, email 추출
  const { role, email } = useMemo(() => {
    if (!token) return { role: null, email: null };
    try {
      const decoded = jwtDecode(token);
      return {
        role: decoded?.role ?? null,
        email: decoded?.sub ?? null, // JWT claim "sub" → 이메일
      };
    } catch (error) {
      console.error("토큰 디코딩 실패", error);
      return { role: null, email: null };
    }
  }, [token]);

  // ✅ 로그인 처리
  const login = ({ accessToken, refreshToken } = {}) => {
    if (!accessToken || !refreshToken) {
      console.error("토큰이 없습니다");
      return;
    }
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setAuthKey((prev) => prev + 1);
    navigate("/");
  };

  // ✅ 로그아웃 처리
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuthKey((prev) => prev + 1);
    navigate("/login");
  };

  // ✅ 인증 라우트
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // ✅ 공개 라우트
  const PublicRoute = ({ children }) => {
    if (isLoggedIn) {
      return <Navigate to="/shop" replace />;
    }
    return children;
  };

  return (
    <AuthContext.Provider
      key={authKey}
      value={{
        isLoggedIn,
        role,
        email,
        login,
        logout,
        ProtectedRoute,
        PublicRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
