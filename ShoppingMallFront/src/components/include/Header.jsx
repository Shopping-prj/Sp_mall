import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

const Header = ({ setSelectedCategory }) => {
  const navigate = useNavigate();
  
  // 로그인 여부 체크 (예: localStorage 토큰 존재 여부)
  const [isLogin, setIsLogin] = useState(!!localStorage.getItem("accessToken"));
  const [catCollapse, setCatCollapse] = useState(false);

  const categories = [
    "여성의류","남성의류","패션잡화","신발","화장품/미용",
    "신선식품","가공식품","건강식품","출산/유아동","반려동물용품",
    "가전","휴대폰/카메라","PC/주변기기","가구","조명/인테리어",
    "패브릭/홈데코","주방용품","생활용품","스포츠/레저","자동차/오토바이",
    "키덜트/취미","건강/의료용품","악기/문구"
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    setIsLogin(false);
    navigate("/login");
  };

  return (
    <>
      {/* 상단 네비 */}
      <nav className="navbar navbar-expand-lg gradient-header">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img
              src="/images/testimonial/man4.png"
              alt="Avatar Logo"
              style={{ width: "40px" }}
              className="rounded-pill"
            />
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {/* 왼쪽 메뉴 */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" to="/home">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/board">게시판</Link>
              </li>
            </ul>

            {/* 오른쪽 메뉴 */}
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/mypage">마이페이지</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/orders">주문내역</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/qna">Q&A</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cart">장바구니</Link>
              </li>

              {/* 로그인/로그아웃 */}
              {!isLogin ? (
                <li className="nav-item">
                  <Link className="nav-link" to="/">로그인</Link>
                </li>
              ) : (
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}>로그아웃</button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* 카테고리 사이드 메뉴 */}
      <div>
        <button
          className="navbar-toggler d-flex align-items-center mt-2 ms-2"
          type="button"
          onClick={() => setCatCollapse(!catCollapse)}
          style={{ gap: "8px" }}
        >
          <FaBars size={20} />
          <span>카테고리</span>
        </button>

        {catCollapse && (
          <div
            className="overlay"
            onClick={() => setCatCollapse(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.4)",
              zIndex: 998,
            }}
          />
        )}

        <div
          className={`sidebar ${catCollapse ? "open" : ""}`}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100%",
            width: "250px",
            background: "#fff",
            boxShadow: "2px 0 5px rgba(0,0,0,0.3)",
            transform: catCollapse ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease-in-out",
            zIndex: 999,
            padding: "20px",
          }}
        >
          <h5>카테고리</h5>
          <ul className="navbar-nav flex-column mt-2 text-start">
            {categories.map((cat) => (
              <li className="nav-item" key={cat}>
                <Link
                  className="nav-link"
                  to={`/category/${cat}`}
                  onClick={() => {
                    setSelectedCategory && setSelectedCategory(cat); // 카테고리 선택 시 전달
                    setCatCollapse(false);
                  }}
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;
