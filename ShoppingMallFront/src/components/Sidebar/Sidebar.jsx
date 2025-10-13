// src/components/Sidebar/Sidebar.jsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";
import logo from "assets/img/reactlogo.png";
import { categories } from "common/categoriesData";

const Sidebar = ({ color, image, routes }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const currentCategory = query.get("name");
  return (
    <div className="sidebar" data-image={image} data-color={color}>
      <div
        className="sidebar-background"
        style={{ 
          backgroundImage: `url(${image})`,
        }}
      />
      <div className="sidebar-wrapper">
        {/* 상단 로고 + 브랜드명 */}
        <div className="logo d-flex align-items-center justify-content-start">
          <NavLink to="/shop" className="simple-text logo-mini mx-1">
            <div className="logo-img">
              <img src={logo} alt="Logo" />
            </div>
          </NavLink>
          <NavLink to="/shop" className="simple-text">
            CosmoShop
          </NavLink>
        </div>

        {/* 네비게이션 */}
        <Nav as="ul">
          {categories.map((c) => (
            <li key={c.key}>
              <NavLink
                to={`/shop/category?name=${encodeURIComponent(c.key)}`}
                className="nav-link"
                style={
                  currentCategory === c.key
                    ? {
                        fontWeight: "bold",
                        backgroundColor: "rgba(255, 255, 255, 0.36) ",
                        borderRadius: "6px",
                      }
                    : {}
                }
              >
                <p>{c.name}</p>
              </NavLink>
            </li>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
