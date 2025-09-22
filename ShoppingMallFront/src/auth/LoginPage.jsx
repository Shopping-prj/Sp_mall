import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col, Card, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginMember } from "service/memberDB";     // ✅ 백엔드 로그인 API
import { useCart } from "context/CartContext";      // ✅ 장바구니 Context
import { syncGuestCartToDB } from "service/cartDB"; // ✅ guest_cart → DB 동기화 함수
import ShopNavbar from "components/include/ShopNavbar";
import { useAuth } from "context/AuthContext";      // ✅ 로그인 상태 관리 Context

const LoginPage = () => {
  // ✅ Context 사용
  const { login } = useAuth();      // AuthContext → 로그인 상태/정보 관리
  const { loadCart } = useCart();   // CartContext → 장바구니 관리
  const navigate = useNavigate();

  // ✅ 입력값 관리 (이메일, 비밀번호)
  const [User, setUser] = useState({
    m_email: "",
    m_password: "",
  });

  // ✅ 입력 필드 변경 핸들러
  const changeUser = (e) => {
    const id = e.currentTarget.id;   // input의 id (m_email, m_password)
    const value = e.target.value;    // 입력된 값
    setUser({ ...User, [id]: value }); // 기존 상태 복사 + 해당 필드 값 갱신
  };

  // ✅ 비밀번호 보기/숨기기 상태
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

  // ✅ 일반 로그인 실행
  const loginE = async () => {
    try {
      // 1. 로그인 API 호출
      const userData = await loginMember(User.m_email, User.m_password);

      // 2. 로그인 성공 → AuthContext에 저장
      login(userData);

      // 3. 비회원 장바구니(localStorage: guest_cart) → DB로 merge
      await syncGuestCartToDB(userData.m_email);

      // 4. DB에서 장바구니 불러오기 (CartContext 갱신)
      await loadCart(userData.m_email);

      // 5. 메인 페이지로 이동
      navigate("/shop");
    } catch (err) {
      console.error("로그인 실패:", err);
      // 에러 메시지가 백엔드에서 내려오면 보여주고, 없으면 기본 메시지 표시
      alert(err.response?.data?.message || "로그인 실패");
    }
  };

  // ✅ 구글 로그인
  const loginG = () => {
    const googleUrl = "https://accounts.google.com/o/oauth2/auth";
    const googleClientId = "858945058074-7droigq2d1o18bh69su5q5frd9qff4m2.apps.googleusercontent.com";
    const googleRedirectUrl = "http://localhost:3000/oauth/google/redirect";
    const googleScope = "openid profile email";

    // 실제 구글 인증 페이지로 리다이렉트
    const auth_uri = `${googleUrl}?client_id=${googleClientId}&redirect_uri=${googleRedirectUrl}&response_type=code&scope=${googleScope}`;
    window.location.href = auth_uri;
  };

  // ✅ 카카오 로그인
  const loginK = () => {
    const kakaoUrl = "https://kauth.kakao.com/oauth/authorize";
    const kakaoClientId = "ac8481e5c39e26462dda5a549b1aaa39";
    const kakaoRedirectUrl = "http://localhost:3000/oauth/kakao/redirect";

    // 실제 카카오 인증 페이지로 리다이렉트
    const auth_uri = `${kakaoUrl}?client_id=${kakaoClientId}&redirect_uri=${kakaoRedirectUrl}&response_type=code`;
    window.location.href = auth_uri;
  };

  return (
    <>
      <ShopNavbar />
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Row className="w-100 justify-content-center">
          <Col md={6} lg={4}>
            <Card
              className="shadow-sm"
              style={{ borderRadius: "10px", padding: "30px 20px" }}
            >
              <Card.Body>
                <h3 className="text-center mb-4">로그인</h3>
                <Form>
                  {/* ✅ 이메일 입력 */}
                  <Form.Group className="mb-3" controlId="m_email">
                    <Form.Label>이메일</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="이메일을 입력해주세요"
                      value={User.m_email}
                      onChange={changeUser}
                      style={{ height: "48px" }}
                    />
                  </Form.Group>

                  {/* ✅ 비밀번호 입력 */}
                  <Form.Group className="mb-3" controlId="m_password">
                    <Form.Label>비밀번호</Form.Label>
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

                  {/* ✅ 일반 로그인 버튼 */}
                  <Button
                    className="w-100 mb-3"
                    variant="primary"
                    type="button"
                    onClick={loginE}
                    style={{ height: "48px", fontWeight: "500" }}
                  >
                    로그인
                  </Button>

                  <div className="text-center my-3 text-muted">또는</div>

                  {/* ✅ 구글 로그인 버튼 */}
                  <Button
                    variant="light"
                    className="w-100 mb-2 p-0 border"
                    onClick={loginG}
                    style={{
                      height: "48px",
                      overflow: "hidden",
                      borderRadius: "12px",
                    }}
                  >
                    <img
                      src="../srcimg/google-signin-assets/web/web_neutral_sq_SI@2x.png"
                      alt="구글 로그인"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Button>

                  {/* ✅ 카카오 로그인 버튼 */}
                  <Button
                    variant="light"
                    className="w-100 mb-2 p-0 border"
                    onClick={loginK}
                    style={{
                      height: "48px",
                      overflow: "hidden",
                      borderRadius: "12px",
                    }}
                  >
                    <img
                      src="../srcimg/kakao/kakao_login_large_narrow.png"
                      alt="카카오 로그인"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Button>

                  {/* ✅ 하단 링크 */}
                  <div
                    className="mt-4 text-center"
                    style={{ fontSize: "0.9rem", lineHeight: "1.8" }}
                  >
                    <p>
                      신규 사용자이신가요?{" "}
                      <Link to="/api/members/join">계정 만들기</Link>
                    </p>
                    <p>
                      이메일을 잊으셨나요?{" "}
                      <Link to="/login/findEmail">이메일 찾기</Link>
                    </p>
                    <p>
                      비밀번호를 잊으셨나요?{" "}
                      <Link to="/login/resetPwd">비밀번호 변경</Link>
                    </p>
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
