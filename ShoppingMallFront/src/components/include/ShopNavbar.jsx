// src/components/include/ShopNavbar.jsx
import React, { useState } from "react";
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "context/CartContext";
import { categories } from "common/categoriesData";

const ShopNavbar = ({ isNarrow }) => {
  const { cartItems } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 임시 로그인 상태
  const navigate = useNavigate();

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        {/* 왼쪽: 브랜드 + (좁을 때) 카테고리 드롭다운 */}
        <div className="d-flex align-items-center">
          {isNarrow && (
            <Dropdown>
              <Dropdown.Toggle
                variant="dark"
                className="btn-fill rounded-circle p-2"
              >
                <i className="fas fa-ellipsis-v" />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {categories.map((c) => (
                  <Dropdown.Item
                    key={c.key}
                    onClick={() =>
                      navigate(`/shop/category?name=${encodeURIComponent(c.key)}`)
                    }
                  >
                    {c.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}
          <Navbar.Brand className="ml-2">CosmoShop</Navbar.Brand>
        </div>

        {/* 오른쪽: 장바구니/로그인 등 메뉴 */}
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto" navbar>
            {/* 장바구니 버튼 */}
            <Nav.Item>
              <Nav.Link onClick={() => navigate("/shop/cart")}>
                <i className="nc-icon nc-cart-simple"></i>
                <span className="notification">{cartItems.length}</span>
                <span className="d-lg-none ml-1">Cart</span>
              </Nav.Link>
            </Nav.Item>

            {/* 로그인 분기 */}
            {!isLoggedIn ? (
              <>
                <Nav.Item>
                  <Nav.Link as={Link} to="/login">
                    로그인
                  </Nav.Link>
                  <Nav.Link as={Link} to="/join">
                    회원가입
                  </Nav.Link>
                </Nav.Item>
              </>
            ) : (
              <>
                {/* 로그인시 출력되는 헤더 항목 */}
                <Dropdown as={Nav.Item}>
                  <Dropdown.Toggle as={Nav.Link}>계정관리</Dropdown.Toggle>
                  <Dropdown.Menu className="account-menu">
                    <Dropdown.Item as={Link} to="/mypage">
                      마이 페이지
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/mypage/member">
                      회원정보 수정
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/mypage/orders">
                      주문 내역
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/mypage/address">
                      배송지 관리
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => console.log("로그아웃 실행")}>
                      로그아웃
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Nav.Link as={Link} to="/qna">
                  Q&A
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default ShopNavbar;
