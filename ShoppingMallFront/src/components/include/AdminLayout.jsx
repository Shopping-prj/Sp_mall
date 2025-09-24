// src/layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div style={{ flexShrink: 0 }}>
        <Sidebar />
      </div>
      <main className="flex-grow-1 ps-3">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;