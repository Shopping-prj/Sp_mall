// src/AdminApp.jsx
import { Routes, Route } from "react-router-dom";
import AdminLayout from "./components/admin_include/AdminLayout";
import MainPage from "./components/admin_page/MainPage";
import StatsPage from "./components/admin_stats/Stats";
import SettingPage from "./components/admin_settings/Settings";

import Members from "./components/admin_member/Members";
import MemberAdd from "./components/admin_member/MemberAdd";
import MemberUpdate from "./components/admin_member/MemberUpdate";
import MemberDelete from "./components/admin_member/MemberDelete";

import ProductsPage from "./components/admin_products/Products";
import ProductInfo from "./components/admin_products/ProductInfo";
import ProductAdd from "./components/admin_products/ProductAdd";
import ProductDelete from "./components/admin_products/ProductDelete";

import OrdersPage from "./components/admin_orders/Orders";
import OrderWaiting from "./components/admin_orders/OrderWaiting";
import OrderReady from "./components/admin_orders/OrderReady";
import OrderShipping from "./components/admin_orders/OrderShipping";
import OrderDone from "./components/admin_orders/OrderDone";
import OrderCancel from "./components/admin_orders/OrderCancel";

import BoardList from "./components/admin_board/BoardList";
import BoardUpsert from "./components/admin_board/BoardUpsert";
import Header from "components/admin_include/Header";
import Footer from "components/include/Footer";

const AdminApp = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="" element={<AdminLayout />}>
          <Route index element={<MainPage />} />

          {/* 통계/설정 */}
          <Route path="stats" element={<StatsPage />} />
          <Route path="setting" element={<SettingPage />} />

          {/* 게시판 */}
          <Route path="board" element={<BoardList />} />
          <Route path="board/new" element={<BoardUpsert />} />
          <Route path="board/:bNo/edit" element={<BoardUpsert />} />

          {/* 회원 */}
          <Route path="member" element={<Members />} />
          <Route path="member/add" element={<MemberAdd />} />
          <Route path="member/update" element={<MemberUpdate />} />
          <Route path="member/delete" element={<MemberDelete />} />

          {/* 상품 */}
          <Route path="product" element={<ProductsPage />} />
          <Route path="product/info" element={<ProductInfo />} />
          <Route path="product/add" element={<ProductAdd />} />
          <Route path="product/delete" element={<ProductDelete />} />

          {/* 주문 */}
          <Route path="order" element={<OrdersPage />} />
          <Route path="order/waiting" element={<OrderWaiting />} />
          <Route path="order/ready" element={<OrderReady />} />
          <Route path="order/shipping" element={<OrderShipping />} />
          <Route path="order/done" element={<OrderDone />} />
          <Route path="order/cancel" element={<OrderCancel />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
};

export default AdminApp;
