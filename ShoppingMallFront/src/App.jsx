// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ShopLayout from "./layouts/ShopLayout";

// 페이지들
import HomePage from "./pages/HomePage";
import Categories from "pages/Categories";
import SearchPage from "pages/Searchpage";
import MyPage from "auth/account/MyPage";
import OrderList from "auth/account/OrderList";
import LoginPage from "auth/LoginPage";
import JoinPage from "auth/JoinPage";
import Member from "auth/account/Member";


const App = () => {
  return (
    <Routes>
      {/* 공통 레이아웃 */}
      <Route path="shop" element={<ShopLayout />}>
          <Route index element={<HomePage />} /> 
          <Route path="/shop/category" element={<Categories />} />
          <Route path="/shop/search" element={<SearchPage />} />
      {/* 로그인시 진입 가능한 페이지 */}
          <Route path="/shop/mypage" element={<MyPage />} />
          <Route path="/shop/mypage/member" element={<Member />} />
          <Route path="/shop/mypage/orders" element={<OrderList />} />
      </Route>
          <Route path="/shop/login" element={<LoginPage />} />
          <Route path="/shop/join" element={<JoinPage />} />

      {/* 루트 접근 시 /shop으로 이동 */}
      <Route path="/" element={<Navigate to="/shop" replace />} />
    </Routes>

    
  );
}

export default App
