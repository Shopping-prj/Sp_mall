// src/RootApp.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import App from "App";            // 쇼핑몰 앱
import AdminApp from "AdminApp";  // 관리자 앱
import { useAuth } from "context/AuthContext";

const RootApp = () => {
  const { isLoggedIn, role } = useAuth();

  return (
    <Routes>
      {/* 관리자 라우트 */}
      <Route
        path="/admin/*"
        element={
          isLoggedIn && role?.toUpperCase() === "ADMIN"
            ? <AdminApp />
            : <Navigate to="/" replace />
        }
      />

      {/* 나머지 모든 경로는 쇼핑몰 */}
      <Route path="/*" element={<App />} />
    </Routes>
  );
};

export default RootApp;
