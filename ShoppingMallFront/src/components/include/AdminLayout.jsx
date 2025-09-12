// src/layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <main className="flex-grow-1 ps-3">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;