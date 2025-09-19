// src/layouts/ShopLayout.jsx
import React, { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ShopNavbar from "components/include/ShopNavbar";
import Footer from "components/include/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import sidebarImage from "assets/img/sidebar-3.jpg";
import { categories } from "common/categoriesData";

const sidebarNav = categories.map((c) => ({
  path: c.key,
  name: c.name,
}));

const ShopLayout = () => {
  const [image] = useState(sidebarImage);
  const [color] = useState("black");
  const [hasImage] = useState(true);
  const [isNarrow, setIsNarrow] = useState(false);

  const location = useLocation();
  const mainPanel = useRef(null);

  // 화면 크기 감지
  useEffect(() => {
    const handleResize = () => {
      setIsNarrow(window.innerWidth < 992); // 992px 이하일 때 좁은 화면으로 간주
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 페이지 이동 시 스크롤 상단으로
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainPanel.current) mainPanel.current.scrollTop = 0;
  }, [location]);

  return (
    <div className="wrapper">
      {!isNarrow && (
        <Sidebar
          color={color}
          image={hasImage ? image : ""}
          routes={sidebarNav}
        />
      )}
      <div className="main-panel" ref={mainPanel}>
        <ShopNavbar isNarrow={isNarrow} />
        <div className="content">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ShopLayout;
