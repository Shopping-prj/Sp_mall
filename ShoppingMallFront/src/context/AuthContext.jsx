// src/context/AuthContext.jsx
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
  );

  const isLoggedIn = !!token;

  const { role, email } = useMemo(() => {
    if (!token) return { role: null, email: null };
    try {
      const decoded = jwtDecode(token);
      console.log(decoded);
      return {
        role: decoded?.role ?? null,
        email: decoded?.sub ?? null,
      };
    } catch (error) {
      console.error("토큰 디코딩 실패", error);
      return { role: null, email: null };
    }
  }, [token]);

  const login = ({ accessToken, refreshToken } = {}) => {
    if (!accessToken || !refreshToken) {
      console.error("토큰이 없습니다");
      return;
    }
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setToken(accessToken);
    navigate("/shop");
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setToken(null);
    navigate("/login");
  };

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    return children;
  };

  const PublicRoute = ({ children }) => {
    if (isLoggedIn) return <Navigate to="/shop" replace />;
    return children;
  };

  setAuthContextRef({ setToken, logout });

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        role,
        email,
        token,
        setToken,  // ✅ axios 인터셉터에서 새 토큰 반영할 때 사용
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


let authContextRef = null;

export const setAuthContextRef = (ref) => {
  authContextRef = ref;
};

export const getAuthContextRef = () => authContextRef;