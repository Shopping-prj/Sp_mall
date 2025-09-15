// src/components/Sidebar/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import logo from "assets/img/reactlogo.png";

const Sidebar = ({ color, image, routes }) => {
  return (
    <div className="sidebar" data-image={image} data-color={color}>
      <div
        className="sidebar-background"
        style={{ backgroundImage: `url(${image})` }}
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
          {routes.map((prop, key) => {
            if (prop.redirect) return null;
            const liClass = prop.upgrade ? "active-pro" : "";

            return (
              <li className={liClass} key={key}>
                <NavLink
                  to={`/shop/${prop.path}`}
                  end
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active" : "")
                  }
                >
                  {prop.icon && <i className={prop.icon} />}
                  <p>{prop.name}</p>
                </NavLink>
              </li>
            );
          })}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
