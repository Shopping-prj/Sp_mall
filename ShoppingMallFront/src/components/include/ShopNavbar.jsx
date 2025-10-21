import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, Dropdown, Modal, Button, Form, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "context/CartContext";
import { useAuth } from "context/AuthContext";
import { verifyPassword } from "service/memberDB"; // ✅ 추가
import { BsEye, BsEyeSlash } from "react-icons/bs"; // ✅ 아이콘

import { categories } from "common/categoriesData";

const ShopNavbar = ({ isNarrow }) => {
  const { cartItems } = useCart();
  const { isLoggedIn, logout, role } = useAuth();
  const navigate = useNavigate();

  // ✅ 비밀번호 확인 모달 상태 (MyPage와 동일 구조)
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 모달 열기
  const handleOpenVerifyModal = () => {
    setPassword("");
    setErrorMsg("");
    setShowPassword(false);
    setShowModal(true);
  };

  // 확인 동작
  const handleVerifyPassword = async (e) => {
    e?.preventDefault?.();
    if (!password) {
      setErrorMsg("비밀번호를 입력하세요.");
      return;
    }
    try {
      setVerifying(true);
      setErrorMsg("");
      const status = await verifyPassword(password);
      if (status === 200) {
        setShowModal(false);
        navigate("/shop/mypage/member");
      } else {
        setErrorMsg("비밀번호가 일치하지 않습니다.");
      }
    } catch (err) {
      setErrorMsg("비밀번호 확인 중 오류가 발생했습니다.");
      // console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  // 모달 열릴 때 바디 스크롤 잠금(선택 사항, MyPage와 동일 느낌)
  useEffect(() => {
    if (!showModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [showModal]);

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
    <>
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
              COSMOSHOP
            </Navbar.Brand>
          </div>

          <Navbar.Toggle aria-controls="basic-navbar-nav">
            <span className="navbar-toggler-bar burger-lines"></span>
            <span className="navbar-toggler-bar burger-lines"></span>
            <span className="navbar-toggler-bar burger-lines"></span>
          </Navbar.Toggle>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto" navbar>
              {!isLoggedIn ? (
                <>
                  <Nav.Item>
                    <Nav.Link as={Link} to="/login">로그인</Nav.Link>
                    <Nav.Link as={Link} to="/join">회원가입</Nav.Link>
                  </Nav.Item>
                </>
              ) : (
                <>
                  {/* 장바구니 버튼 */}
                  <Nav.Item>
                    <Nav.Link onClick={() => navigate("/shop/cart")}>
                      <i className="nc-icon nc-cart-simple"></i>
                      <span className="notification">{cartCount}</span>
                      <span className="d-lg-none ml-1">Cart</span>
                    </Nav.Link>
                  </Nav.Item>

                  <Dropdown as={Nav.Item}>
                    <Dropdown.Toggle as={Nav.Link}>계정관리</Dropdown.Toggle>
                    <Dropdown.Menu className="account-menu">
                      <Dropdown.Item as={Link} to="mypage">마이 페이지</Dropdown.Item>

                      {/* ✅ ‘회원정보 수정’은 MyPage처럼: 모달 먼저 */}
                      <Dropdown.Item onClick={handleOpenVerifyModal}>
                        회원정보 수정
                      </Dropdown.Item>

                      {role?.toUpperCase() === "ADMIN" && (
                        <>
                          <Dropdown.Divider />
                          <Dropdown.Item as={Link} to="/admin">관리자 페이지</Dropdown.Item>
                        </>
                      )}

                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
                    </Dropdown.Menu>

                    <Nav.Link as={Link} to="/qna">Q&A</Nav.Link>
                  </Dropdown>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ✅ 비밀번호 확인 모달 (MyPage와 동일 UX) */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 9999,
            display: "grid",
            placeItems: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "460px",
              maxWidth: "calc(100vw - 32px)",
              background: "#ffffff",
              borderRadius: 14,
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              padding: "22px 24px 18px",
              position: "relative",
            }}
          >
            <button
              type="button"
              aria-label="닫기"
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 12,
                width: 32,
                height: 32,
                border: "none",
                background: "transparent",
                fontSize: 22,
                fontWeight: 800,
                color: "#222",
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              ×
            </button>

            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111" }}>
                비밀번호 확인
              </span>
            </div>

            <Form onSubmit={handleVerifyPassword}>
              <Form.Label style={{ fontWeight: 700, marginBottom: 6, color: "#222" }}>
                현재 비밀번호
              </Form.Label>

              <div style={{ display: "flex", alignItems: "stretch" }}>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="비밀번호를 입력하세요"
                  disabled={verifying}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg("");
                  }}
                  autoFocus
                  style={{
                    flex: 1,
                    height: 46,
                    border: "2px solid #c9ced6",
                    borderRight: "none",
                    borderRadius: "10px 0 0 10px",
                    padding: "0 12px",
                    fontSize: "0.98rem",
                    color: "#111",
                    background: "#fff",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    width: 50,
                    border: "2px solid #c9ced6",
                    borderLeft: "none",
                    borderRadius: "0 10px 10px 0",
                    background: "#f3f5f8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <BsEyeSlash size={20} color="#222" /> : <BsEye size={20} color="#222" />}
                </button>
              </div>

              {errorMsg && (
                <div style={{ color: "#dc3545", marginTop: 8, fontSize: "0.92rem" }}>
                  {errorMsg}
                </div>
              )}

              <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <Button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={verifying}
                  style={{
                    background: "#e9ecef",
                    color: "#212529",
                    border: "none",
                    borderRadius: 10,
                    padding: "9px 16px",
                    fontWeight: 600,
                  }}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={verifying}
                  style={{
                    background: verifying ? "#6da8ff" : "#0d6efd",
                    color: "#ffffffff",
                    border: "none",
                    borderRadius: 10,
                    padding: "9px 16px",
                    fontWeight: 700,
                  }}
                >
                  {verifying ? "확인 중..." : "확인"}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopNavbar;
