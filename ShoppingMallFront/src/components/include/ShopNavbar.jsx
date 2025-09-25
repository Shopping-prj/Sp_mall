import React from "react";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "context/CartContext";
import { useAuth } from "context/AuthContext";
import { categories } from "common/categoriesData";

const ShopNavbar = ({ isNarrow }) => {
  const { cartItems } = useCart();
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toHome = () => {
    navigate("/");
  };

  const cartCount = Array.isArray(cartItems)
  ? cartItems.reduce((sum, item) => sum + (item.c_count || 0), 0)
  : 0;

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <div className="d-flex align-items-center">
          {isNarrow && (
            <Dropdown>
              <Dropdown.Toggle variant="dark" className="btn-fill rounded-circle p-2">
                <i className="fas fa-ellipsis-v" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {categories.map((c) => (
                  <Dropdown.Item
                    key={c.key}
                    onClick={() => navigate(`/shop/category?name=${encodeURIComponent(c.key)}`)}
                  >
                    {c.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}
          <Navbar.Brand type="button" className="ml-2" onClick={toHome}>
            CosmoShop
          </Navbar.Brand>
        </div>

        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto" navbar>
            
            {/* 로그인 여부 분기 */}
            {!isLoggedIn ? (
              <>
                <Nav.Item>
                  <Nav.Link as={Link} to="/login">로그인</Nav.Link>
                  <Nav.Link as={Link} to="/join">회원가입</Nav.Link>
                </Nav.Item>
              </>
            ) : (
              <>
                <Dropdown as={Nav.Item}>
                  <Dropdown.Toggle as={Nav.Link}>계정관리</Dropdown.Toggle>
                  <Dropdown.Menu className="account-menu">
                    <Dropdown.Item as={Link} to="mypage">마이 페이지</Dropdown.Item>
                    <Dropdown.Item as={Link} to="mypage/member">회원정보 수정</Dropdown.Item>
                    <Dropdown.Item as={Link} to="mypage/orders">주문 내역</Dropdown.Item>
                    <Dropdown.Item as={Link} to="mypage/address">배송지 관리</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
                  </Dropdown.Menu>
                  <Nav.Link as={Link} to="/qna">Q&A</Nav.Link>
                  {/* 장바구니 버튼 */}
                  <Nav.Item>
                    <Nav.Link onClick={() => navigate("/shop/cart")}>
                      <i className="nc-icon nc-cart-simple"></i>
                      <span className="notification">{cartCount}</span>
                      <span className="d-lg-none ml-1">Cart</span>
                    </Nav.Link>
                  </Nav.Item>
                </Dropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default ShopNavbar;
