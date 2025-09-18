// src/layouts/ShopLayout.jsx
import React, { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ShopNavbar from "components/include/ShopNavbar";
import Footer from "components/include/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import sidebarImage from "assets/img/sidebar-3.jpg";
import { categories } from "common/categoriesData";

const sidebarNav = categories.map((c) =>({
  path: c.key,
  name: c.name
}))

const ShopLayout = () => {
  const [image, setImage] = useState(sidebarImage);
  const [color, setColor] = useState("black");
  const [hasImage, setHasImage] = useState(true);
  const location = useLocation();
  const mainPanel = useRef(null);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainPanel.current) mainPanel.current.scrollTop = 0;
  }, [location]);

  return (
    <div className="wrapper">
      <Sidebar color={color} image={hasImage ? image : ""} routes={sidebarNav} />
      <div className="main-panel" ref={mainPanel}>
        <ShopNavbar />
        <div className="content">
          <Outlet /> {/* 여기로 자식 라우트 페이지가 들어옴 */}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default ShopLayout