// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // ✅ 로그인된 회원 정보 (없으면 null)
  const [loginMember, setLoginMember] = useState(null);

  // ✅ 로그인 여부 (boolean)
  const isLoggedIn = !!loginMember;

  // ✅ mount 시 localStorage 확인 → 새로고침해도 로그인 유지
  useEffect(() => {
    const stored = localStorage.getItem("loginMember");
    if (stored) {
      setLoginMember(JSON.parse(stored));
    }
  }, []);

  // ✅ 로그인 처리
  const login = (user) => {
    localStorage.setItem("loginMember", JSON.stringify(user));
    setLoginMember(user);
    // ⚠️ 주의: 여기서는 장바구니 loadCart 호출 ❌
    // loadCart는 CartProvider 안에서 로그인 정보 변화를 감지해서 처리
  };

  // ✅ 로그아웃 처리
  const logout = () => {
    localStorage.removeItem("loginMember");
    setLoginMember(null);
  };

  // ✅ AuthContext에서 제공할 값들
  return (
    <AuthContext.Provider value={{ loginMember, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
