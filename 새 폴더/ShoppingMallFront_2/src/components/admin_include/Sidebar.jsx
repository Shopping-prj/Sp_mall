import menuConfig from "components/admin_config/menuconfig";
import { NavLink, useLocation } from "react-router-dom";


const Sidebar = () => {
  const location = useLocation();

  // URL 기반으로 현재 메뉴 그룹 추출
  const currentSection = Object.keys(menuConfig).find((key) =>
    location.pathname.includes(key)
  );

  const menu = menuConfig[currentSection] || {};

  return (
    <>
      <aside
        style={{
          width: "220px",          // 사이드바 가로폭 고정
          minWidth: "220px",       // flex item이 강제로 줄어들지 않도록
          maxWidth: "220px",       // 강제로 늘어나지 않도록
          padding: "10px",
          borderRight: "1px solid #ddd",
          overflowX: "hidden",     // 내부 컨텐츠가 넘치면 스크롤 대신 숨김
          whiteSpace: "nowrap",    // 텍스트 줄바꿈 방지
          boxSizing: "border-box", // padding, border 포함한 width 계산
        }}
        >
        <h3>{menu.title}</h3>
        <ul style={{ listStyle: "none", padding: 0 }} >
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
    </>
  );
};


export default Sidebar;