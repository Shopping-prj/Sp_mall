// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // ✅ 로그인된 회원 정보 (없으면 null)
  const [loginMember, setLoginMember] = useState(null);
  const navigate = useNavigate();
  const [authKey, setAuthKey] = useState(0); // 🔑 재마운트 트리거

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
    // localStorage.setItem("accessToken", token);
    // localStorage.setItem("refreshToken", refreshToken); // 있다면
    
    setLoginMember(user);
    // ⚠️ 주의: 여기서는 장바구니 loadCart 호출 ❌
    // loadCart는 CartProvider 안에서 로그인 정보 변화를 감지해서 처리
    localStorage.removeItem("cartItems");
  };

  // ✅ 로그아웃 처리
  const logout = () => {
    // 회원 관련 정보
    localStorage.removeItem("loginMember");

    // 앞으로 토큰 도입할 때 추가할 부분
    // localStorage.removeItem("accessToken");
    // localStorage.removeItem("refreshToken");

    // 장바구니 같은 부가 데이터
    localStorage.removeItem("cartItems");
    setLoginMember(null);

    // 🔑 key 변경 → Provider 재마운트 → 상태 초기화
    setAuthKey((prev) => prev + 1);

    navigate("/login");
  };

  // ✅ AuthContext에서 제공할 값들
  return (
    <AuthContext.Provider 
      key={authKey} // 리마운트용 🔑 key
      value={{ loginMember, isLoggedIn, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
