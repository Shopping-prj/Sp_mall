// src/auth/LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col, Card, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginMember } from "service/memberDB";
import { useCart } from "context/CartContext";
import { useAuth } from "context/AuthContext";
import ShopNavbar from "components/include/ShopNavbar";
import { getCartByEmail } from "service/cartDB";

const LoginPage = () => {
  const { setCartItems } = useCart();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [User, setUser] = useState({
    m_email: "",
    m_password: "",
  });

  const changeUser = (e) => {
    const id = e.currentTarget.id;
    const value = e.target.value;
    setUser({ ...User, [id]: value });
  };

  const [passwordType, setPasswordType] = useState({
    type: "password",
    visible: false,
  });

  const passwordView = () => {
    setPasswordType((prev) => ({
      type: prev.visible ? "password" : "text",
      visible: !prev.visible,
    }));
  };

  const loginE = async () => {
    try {
      // 1. 로그인 시도
      const userData = await loginMember(User.m_email, User.m_password);

      // 2. AuthContext에 로그인 처리 (토큰 저장)
      login(userData);

      // 3. 장바구니 불러오기 (토큰 기반 → email 불필요)
      const cart = await getCartByEmail();
      setCartItems(cart.items || []);

      // 4. 홈으로 이동
      navigate("/shop");
    } catch (err) {
      console.error("로그인 실패:", err);
      alert(err.response?.data?.message || "로그인 실패");
    }
  };


  const loginG = () => {
    const googleUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const googleRedirectUrl = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
    const googleScope = "openid profile email";

    const auth_uri = `${googleUrl}?client_id=${googleClientId}&redirect_uri=${googleRedirectUrl}&response_type=code&scope=${googleScope}`;
    window.location.href = auth_uri;
  };

  const loginK = () => {
    const kakaoUrl = "https://kauth.kakao.com/oauth/authorize";
    const kakaoClientId = process.env.REACT_APP_KAKAO_CLIENT_ID;
    const kakaoRedirectUrl = process.env.REACT_APP_KAKAO_REDIRECT_URI;

    const auth_uri = `${kakaoUrl}?client_id=${kakaoClientId}&redirect_uri=${kakaoRedirectUrl}&response_type=code`;
    window.location.href = auth_uri;
  };

  return (
    <>
      <ShopNavbar />
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Row className="w-100 justify-content-center">
          <Col md={6} lg={4}>
            <Card className="shadow-sm" style={{ borderRadius: "10px", padding: "30px 20px" }}>
              <Card.Body>
                <h3 className="text-center mb-4">로그인</h3>
                <Form onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    loginE();   // 엔터 입력 시 로그인 실행
                  }
                }}>
                  <Form.Group className="mb-3" controlId="m_email">
                    <Form.Label style={{ fontSize: "1.2rem", color: "black" }}>이메일</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="이메일을 입력해주세요"
                      value={User.m_email}
                      onChange={changeUser}
                      style={{ height: "48px" }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="m_password">
                    <Form.Label style={{ fontSize: "1.2rem", color: "black" }}>비밀번호</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={passwordType.type}
                        placeholder="비밀번호를 입력해주세요"
                        value={User.m_password}
                        onChange={changeUser}
                      />
                      <InputGroup.Text
                        style={{ cursor: "pointer", backgroundColor: "white" }}
                        onClick={passwordView}
                      >
                        {passwordType.visible ? <FaEyeSlash /> : <FaEye />}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  <Button className="w-100 mb-3" variant="primary" type="button" onClick={loginE} style={{ height: "48px", fontWeight: "500" }}>
                    로그인
                  </Button>

                  {/* <div className="text-center my-3 text-muted">또는</div> */}

                  {/* <Button
                    variant="light"
                    className="w-100 mb-2 p-0 border"
                    onClick={loginG}
                    style={{ height: "48px", overflow: "hidden", borderRadius: "12px" }}
                  >
                    <img src="../srcimg/google-signin-assets/web/web_neutral_sq_SI@2x.png" alt="구글 로그인"
                         style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </Button> */}

                  {/* <Button
                    variant="light"
                    className="w-100 mb-2 p-0 border"
                    onClick={loginK}
                    style={{ height: "48px", overflow: "hidden", borderRadius: "12px" }}
                  >
                    <img src="../srcimg/kakao/kakao_login_large_narrow.png" alt="카카오 로그인"
                         style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </Button> */}

                  <div className="mt-4 text-center" style={{ fontSize: "0.9rem", lineHeight: "1.8" }}>
                    <p>신규 사용자이신가요? <Link to="/join">계정 만들기</Link></p>
                    {/* <p>이메일을 잊으셨나요? <Link to="/login/findEmail">이메일 찾기</Link></p>
                    <p>비밀번호를 잊으셨나요? <Link to="/login/resetPwd">비밀번호 변경</Link></p> */}
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LoginPage;
