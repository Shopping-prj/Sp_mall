import { Route, Routes, Navigate } from "react-router-dom";
import './components/style/MainBoard.css'
import "bootstrap/dist/css/bootstrap.min.css";
import NoticePage from "./components/page/NoticePage";
import MainPage from "./components/page/MainPage";
import LoginForm from "./components/auth/LoginForm";
import LocalSignUpPage from "./components/page/LocalSignUpPage";
import { useState } from "react";
import Header from "./components/include/Header";
import Footer from "./components/include/Footer";
import SettingPage from "./components/settings/Settings";
import StatsPage from "./components/stats/stats";
import OrdersPage from "./components/orders/Orders";
import ProductsPage from "./components/products/Products";
import MemberAdd from "./components/member/MemberAdd";
import MemberUpdate from "./components/member/MemberUpdate";
import MemberDelete from "./components/member/MemberDelete";
import AdminLayout from "./components/include/AdminLayout";
import Members from "./components/member/Members";
import ProductInfo from "./components/products/ProductInfo";
import ProductDelete from "./components/products/ProductDelete";
import ProductAdd from "./components/products/ProductAdd";
import OrderWaiting from "./components/orders/OrderWaiting";
import OrderReady from "./components/orders/OrderReady";
import OrderShipping from "./components/orders/OrderShipping";
import OrderDone from "./components/orders/OrderDone";
import OrderCancel from "./components/orders/OrderCancel";
import NoticeRow from "./components/notice/NoticeRow";
import NoticeDetail from "./components/notice/NoticeDetail";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
  return localStorage.getItem('isLoggedIn') === 'true';
});
  // 로그인 시 호출
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true'); // 로그인 상태 저장
  };
  //로그아웃시 호출
  const handleLogout = () => {
    console.log('로그아웃 호출');
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn'); // 로그인 상태 삭제
  }
  return (
    <>
      <div style={{ height: "100vh" }}>
        <Header onLogout={handleLogout} isLoggedIn={isLoggedIn} />

        <Routes>
          {/* 메인/공용 라우트 */}
          <Route path="/" element={<MainPage onLogout={handleLogout} />} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/localSignUp" element={<LocalSignUpPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/setting" element={<SettingPage />} />

          {/* notice start */}
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/notice/row" element={<NoticeRow />} />
          <Route path="/notice/detail" element={<NoticeDetail />} />
          {/* notice end */}

          {/*  Admin 레이아웃 + 중첩 라우트 */}
          <Route path="/member" element={<Navigate to="/admin/member" replace />} />
          <Route path="/product" element={<Navigate to="/admin/product" replace />} />
          <Route path="/order" element={<Navigate to="/admin/order" replace />} />
          <Route path="/admin" element={<AdminLayout />}>
          {/* index 라우트(선택): /admin 진입 시 기본 페이지 */}
          {/* <Route index element={<Dashboard />} /> */}

          {/* member start */}
          <Route path="member" element={<Members />} />
          <Route path="member/add" element={<MemberAdd />} />
          <Route path="member/update" element={<MemberUpdate />} />
          <Route path="member/delete" element={<MemberDelete />} />
          {/* member end */}

          {/* product start */}
          <Route path="product" element={<ProductsPage />} />
          <Route path="product/Info" element={<ProductInfo />} />
          <Route path="product/Add" element={<ProductAdd />} />
          <Route path="product/Delete" element={<ProductDelete />} />
          {/* product end */}

          {/* order start */}
          <Route path="order" element={<OrdersPage />} />
          <Route path="order/waiting" element={<OrderWaiting />} />
          <Route path="order/ready" element={<OrderReady />} />
          <Route path="order/shipping" element={<OrderShipping />} />
          <Route path="order/done" element={<OrderDone />} />
          <Route path="order/cancel" element={<OrderCancel />} />
          {/* order end */}
          </Route>
        </Routes>
        <Footer />
      </div>
    </>
  );
}