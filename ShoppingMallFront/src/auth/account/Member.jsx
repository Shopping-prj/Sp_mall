import { useAuth } from "context/AuthContext";
import React, { useEffect, useState } from "react";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getMyInfo, updateMemberProfile, updateMyPassword } from "service/memberDB";

const Member = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    m_email: "",
    m_name: "",
    m_address: "",
    m_class: "",
  });

  const [passwords, setPasswords] = useState({
    newPassword: "",
    newPasswordConfirm: "",
  });

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const me = await getMyInfo();
        setProfile({
          m_email: me.m_email || "",
          m_name: me.m_name || "",
          m_address: me.m_address || "",
          m_class: me.m_class || "",
        });
      } catch (e) {
        console.error("❌ 내 정보 조회 실패:", e);
        alert("내 정보 조회에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const onChangeProfile = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const onSaveProfile = async () => {
    try {
      const payload = {
        m_email: profile.m_email,
        m_name: profile.m_name,
        m_address: profile.m_address,
      };
      const result = await updateMemberProfile(payload);
      if (result === 1) {
        alert("프로필이 저장되었습니다.");
      } else {
        alert("프로필 저장에 실패했습니다.");
      }
    } catch (e) {
      console.error("❌ 프로필 저장 실패:", e);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const onChangePwField = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const onChangePassword = async () => {
    if (!passwords.newPassword || passwords.newPassword.length < 6) {
      alert("새 비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    if (passwords.newPassword !== passwords.newPasswordConfirm) {
      alert("비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    try {
      const status = await updateMyPassword(passwords.newPassword);
      if (status === 204) {
        alert("비밀번호가 변경되었습니다. 다시 로그인해 주세요.");
        logout();
      } else {
        alert("비밀번호 변경에 실패했습니다.");
      }
    } catch (e) {
      console.error("❌ 비밀번호 변경 실패:", e);
      alert("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p className="m-3">로딩 중...</p>;

  return (
    <div className="container mt-4">
      <h4 className="mb-3" style={{ borderLeft: "4px solid #0d6efd", paddingLeft: 10 }}>
        회원정보 수정
      </h4>

      <Card className="mb-4 shadow-sm border-0 rounded-3">
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="m_email">
                <Form.Label>이메일</Form.Label>
                <Form.Control type="email" value={profile.m_email} disabled />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="m_name">
                <Form.Label>이름</Form.Label>
                <Form.Control
                  type="text"
                  name="m_name"
                  value={profile.m_name}
                  onChange={onChangeProfile}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="m_address">
                <Form.Label>주소</Form.Label>
                <Form.Control
                  type="text"
                  name="m_address"
                  value={profile.m_address}
                  onChange={onChangeProfile}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2 justify-content-end">
            <Button variant="secondary" onClick={() => navigate("/shop/mypage")}>
              마이페이지로
            </Button>
            <Button variant="primary" onClick={onSaveProfile}>
              저장
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-5 shadow-sm border-0 rounded-3">
        <Card.Body>
          <h6 className="mb-3">비밀번호 변경</h6>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="newPassword">
                <Form.Label>새 비밀번호</Form.Label>
                <Form.Control
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={onChangePwField}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="newPasswordConfirm">
                <Form.Label>새 비밀번호 확인</Form.Label>
                <Form.Control
                  type="password"
                  name="newPasswordConfirm"
                  value={passwords.newPasswordConfirm}
                  onChange={onChangePwField}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-end">
            <Button variant="outline-primary" onClick={onChangePassword}>
              비밀번호 변경
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Member;
