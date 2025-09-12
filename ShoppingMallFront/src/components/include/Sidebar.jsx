import { NavLink, useLocation } from "react-router-dom";
import menuConfig from "../../config/menuconfig";

const Sidebar = () => {
  const location = useLocation();

  // URL 기반으로 현재 메뉴 그룹 추출
  const currentSection = Object.keys(menuConfig).find((key) =>
    location.pathname.includes(key)
  );

  const menu = menuConfig[currentSection] || {};

  return (
    <aside style={{ width: "220px", padding: "10px", borderRight: "1px solid #ddd" }}>
      <h3>{menu.title}</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {menu.items?.map((item) => (
          <li key={item.path} style={{ marginBottom: "10px" }}>
            <NavLink
              to={item.path}
              end
              style={({ isActive }) => ({
                textDecoration: "none",
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? "#007bff" : "#000000",
              })}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};


export default Sidebar;