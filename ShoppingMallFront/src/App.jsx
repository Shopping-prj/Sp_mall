import { Routes, Route, Navigate } from "react-router-dom";
import ShopLayout from "./layouts/ShopLayout";

// 페이지들
import HomePage from "./pages/HomePage";
import Categories from "pages/Categories";
import MyPage from "auth/account/MyPage";
import JoinPage from "auth/JoinPage";
import Member from "auth/account/Member";
import CartPage from "pages/CartPage";
import { useAuth } from "context/AuthContext";
import SearchPage from "pages/Searchpage";
import LoginPage from "auth/LoginPage";
import PaymentPage from "pages/PaymentPage";
import PayCompletePage from "pages/PayCompletePage";


const App = () => {
  const { ProtectedRoute, PublicRoute } = useAuth();

  return (
    <Routes>
      {/* 공통 레이아웃 (헤더/푸터 포함) */}
      <Route path="shop" element={<ShopLayout />}>
        {/* 누구나 접근 가능 */}
        <Route index element={<HomePage />} />
        <Route path="category" element={<Categories />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="payment" element={<PaymentPage />} />
        <Route path="payComplete" element={<PayCompletePage />} />

        {/* 로그인 필요 */}
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
      </Route>

      {/* 로그인/회원가입 */}
      <Route
        path="login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route path="join" element={<JoinPage />} />

      {/* 루트 접근 시 /shop으로 */}
      <Route path="/" element={<Navigate to="/shop" replace />} />
    </Routes>
  );
};

export default App;
