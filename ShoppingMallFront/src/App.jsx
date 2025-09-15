// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ShopLayout from "./layouts/ShopLayout";

// 페이지들
import HomePage from "./pages/HomePage";
import Categories from "pages/Categories";
import SearchPage from "pages/Searchpage";


const App = () => {
  return (
    <Routes>
      {/* 공통 레이아웃 */}
      <Route path="/shop" element={<ShopLayout />}>
          <Route index element={<HomePage />} /> 
          <Route path="category/:categoryName" element={<Categories />} />
          <Route path="shop/search" element={<SearchPage />} />
      </Route>

      {/* 루트 접근 시 /shop으로 이동 */}
      <Route path="/" element={<Navigate to="/shop" replace />} />
    </Routes>
  );
}

export default App
