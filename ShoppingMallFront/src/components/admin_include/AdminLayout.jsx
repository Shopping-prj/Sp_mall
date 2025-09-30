import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  const location = useLocation();
  const hideSidebar = location.pathname === "/admin"; // 대시보드 메인에서는 사이드바 숨김

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {!hideSidebar && (
        <div style={{ flexShrink: 0 }}>
          <Sidebar />
        </div>
      )}
      <main className="flex-grow-1 ps-3">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;