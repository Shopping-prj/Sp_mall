// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ShopLayout from "./layouts/ShopLayout";

// 페이지들
import HomePage from "./pages/HomePage";
import Categories from "pages/Categories";
import SearchPage from "pages/SearchPage";
import MyPage from "auth/account/MyPage";
import OrderList from "auth/account/OrderList";
import LoginPage from "auth/LoginPage";
import JoinPage from "auth/JoinPage";
import Member from "auth/account/Member";
import CartPage from "pages/CartPage";
import { useEffect, useState } from "react";

const App = () => {
  const [loginMember, setLoginMember] = useState(null);

  // mount 시 localStorage 체크 (JWT 적용 전 테스트용)
  useEffect(() => {
    const stored = localStorage.getItem("loginMember");
    if (stored) {
      setLoginMember(JSON.parse(stored));
    }
  }, []);

  // 로그인 여부 확인 함수
  const isLoggedIn = () => !!loginMember;

  return (
    <Routes>
      {/* 공통 레이아웃 */}
      <Route path="shop" element={<ShopLayout isLoggedIn={isLoggedIn} />}>
          <Route index element={<HomePage />} /> 
          <Route path="category" element={<Categories />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="cart" element={<CartPage />} />
      {/* 로그인시 진입 가능한 페이지 */}
          <Route path="mypage" element={<MyPage />} />
          <Route path="mypage/member" element={<Member />} />
          <Route path="mypage/orders" element={<OrderList />} />
      </Route>
      
          <Route path="login" element={<LoginPage />} />
          <Route path="join" element={<JoinPage />} />

      {/* 루트 접근 시 /shop으로 이동 */}
      <Route path="/" element={<Navigate to="/shop" replace />} />
    </Routes>

    
  );
}

export default App
