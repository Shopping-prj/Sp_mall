// src/components/Header.jsx
import { useCart } from "context/CartContext";
import { useState } from "react";
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = ({ title = "CosmoShop", cartCount = 0, onCartClick }) => {
  const { cartItems } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const location = useLocation();
  const navigate = useNavigate();

  const mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    const node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function () {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        {/* Mobile sidebar toggle */}
        <div className="d-flex align-items-center">
          <Button
            variant="dark"
            className="d-lg-none btn-fill rounded-circle p-2"
            onClick={mobileSidebarToggle}
          >
            <i className="fas fa-ellipsis-v"></i>
          </Button>
          <Navbar.Brand className="ml-2">{title}</Navbar.Brand>
        </div>

        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          {/* <Nav className="mr-auto" navbar>
            <Nav.Item>
              <Nav.Link as={Link} to="/admin/dashboard">
                <i className="nc-icon nc-palette"></i>
                <span className="d-lg-none ml-1">Dashboard</span>
              </Nav.Link>
            </Nav.Item>
          </Nav> */}

          <Nav className="ml-auto" navbar>
            {/* 장바구니 버튼 */}
            <Nav.Item>
              <Nav.Link onClick={() => navigate("/cart")}>
                <i className="nc-icon nc-cart-simple"></i>
                <span className="notification">{cartItems.length}</span>
                <span className="d-lg-none ml-1">Cart</span>
              </Nav.Link>
            </Nav.Item>
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
                  <Dropdown.Item as={Link} to="/mypage">마이 페이지</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/mypage/member">회원정보 수정</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/mypage/orders">주문 내역</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/mypage/address">배송지 관리</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => console.log("로그아웃 실행")}>
                    로그아웃
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Nav.Link as={Link} to="/qna">Q&A</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
