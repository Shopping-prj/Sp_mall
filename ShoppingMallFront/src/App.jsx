import { Routes, Route, Navigate } from "react-router-dom";
import ShopLayout from "./layouts/ShopLayout";

// 페이지들
import HomePage from "./pages/HomePage";
import Categories from "pages/Categories";
import MyPage from "auth/account/MyPage";
import OrderList from "auth/account/OrderList";
import JoinPage from "auth/JoinPage";
import Member from "auth/account/Member";
import CartPage from "pages/CartPage";
import { useAuth } from "context/AuthContext";
import LoginPage from "auth/LoginPage";
import ShopNavbar from "components/include/ShopNavbar";
import PaymentPage from "pages/PaymentPage";
import SearchPage from "pages/Searchpage";

const App = () => {
  const { isLoggedIn } = useAuth();

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Routes>
      {/* 공통 레이아웃 (헤더/푸터 포함) */}
      <Route path="shop" element={<ShopLayout/>}>
        {/* 누구나 접근 가능한 페이지 */}
        <Route index element={<HomePage />} />
        <Route path="category" element={<Categories />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="payment" element={<PaymentPage />} />

        {/* 로그인해야 접근 가능한 페이지 */}
        <Route
          path="mypage"
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="mypage/member"
          element={
            <ProtectedRoute>
              <Member />
            </ProtectedRoute>
          }
        />
        <Route
          path="mypage/orders"
          element={
            <ProtectedRoute>
              <OrderList />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 로그인/회원가입 페이지 */}
        <Route path="login" element={<LoginPage />} />
        <Route path="join" element={<JoinPage />} />

      {/* 루트 접근 시 /shop으로 이동 */}
      <Route path="/" element={<Navigate to="/shop" replace />} />
    </Routes>
  );
};

export default App;
