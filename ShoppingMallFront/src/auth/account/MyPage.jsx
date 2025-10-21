import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Spinner,
  Modal,
  Form,
  InputGroup,
} from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useAuth } from "context/AuthContext";
import { getMyInfo, verifyPassword } from "service/memberDB";
import { getOrdersGroupedByDate } from "service/orderDB";
import OrderList from "./OrderList";

const MyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [member, setMember] = useState(null);
  const [ordersGrouped, setOrdersGrouped] = useState({});
  const [loading, setLoading] = useState(true);

  // 비밀번호 확인 모달 상태
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 총 주문 개수
  const totalOrders = useMemo(
    () =>
      Object.values(ordersGrouped).reduce(
        (sum, items) => sum + (Array.isArray(items) ? items.length : 0),
        0
      ),
    [ordersGrouped]
  );

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const me = await getMyInfo();
        setMember(me);

        if (me?.m_email) {
          const grouped = await getOrdersGroupedByDate(me.m_email);
          setOrdersGrouped(grouped || {});
        }
      } catch (err) {
        console.error("❌ MyPage 데이터 로딩 오류:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
  if (!showModal) return;
  const prev = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  return () => { document.body.style.overflow = prev; };
}, [showModal]);


  // 정보 수정 → 비번 확인 모달 오픈
  const handleOpenVerifyModal = () => {
    setPassword("");
    setErrorMsg("");
    setShowPassword(false);
    setShowModal(true);
  };

  // 비번 확인 실행
  const handleVerifyPassword = async () => {
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
    } catch (e) {
      console.error("❌ 비밀번호 확인 실패:", e);
      setErrorMsg("비밀번호 확인 중 오류가 발생했습니다.");
    } finally {
      setVerifying(false);
    }
  };

  // 로딩
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // 사용자 정보 실패
  if (!member) {
    return (
      <div className="text-center mt-5">
        <p>회원 정보를 불러오지 못했습니다.</p>
        <Button onClick={() => navigate("/login")}>로그인 페이지로 이동</Button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* 내 정보 */}
      <Card className="shadow-sm mb-4 p-3">
        <h4
          className="mb-3"
          style={{ borderLeft: "4px solid #0d6efd", paddingLeft: "10px" }}
        >
          내 정보
        </h4>
        <p><strong>이메일:</strong> {member.m_email}</p>
        <p><strong>이름:</strong> {member.m_name}</p>
        <p><strong>주소:</strong> {member.m_address}</p>
        <p>
          <strong>가입일:</strong>{" "}
          {member.m_created ? new Date(member.m_created).toLocaleDateString() : "-"}
        </p>

        <div className="text-end">
          <Button variant="outline-primary" onClick={handleOpenVerifyModal}>
            정보 수정하기
          </Button>
        </div>
      </Card>

      {/* 주문 내역 */}
      <Card className="shadow-sm p-3">
        <h4
          className="mb-3"
          style={{ borderLeft: "4px solid #0d6efd", paddingLeft: "10px" }}
        >
          주문 내역
        </h4>

        {totalOrders === 0 ? (
          <p className="text-muted text-center mt-3">아직 주문 내역이 없습니다.</p>
        ) : (
          Object.entries(ordersGrouped)
            .filter(([_, items]) => Array.isArray(items) && items.length > 0)
            .sort((a, b) => new Date(b[0]) - new Date(a[0]))
            .map(([date, items]) => (
              <div key={date} className="mb-5">
                <h5
                  style={{
                    fontWeight: "600",
                    color: "#343a40",
                    fontSize: "1.15rem",
                    marginBottom: "16px",
                    borderLeft: "4px solid #0d6efd",
                    paddingLeft: "10px",
                  }}
                >
                  {date}
                </h5>
                <OrderList items={items} />
              </div>
            ))
        )}
      </Card>

      {/* ✅ 비밀번호 확인 모달(react-bootstrap 기본 헤더/풋터 활용 + 인라인 스타일만) */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowModal(false)}           // 오버레이 클릭 시 닫힘
          style={{
            position: "fixed",
            inset: 0,                                   // top:0,right:0,bottom:0,left:0
            background: "rgba(0,0,0,0.45)",
            zIndex: 9999,                               // 최상단
            display: "grid",
            placeItems: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}        // 내부 클릭은 닫힘 방지
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
            {/* 닫기(X) 버튼 - 큼직하고 진한 색 */}
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

            {/* 제목 */}
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111" }}>
                비밀번호 확인
              </span>
            </div>

            {/* 폼 */}
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerifyPassword();
              }}
            >
              <Form.Label style={{ fontWeight: 700, marginBottom: 6, color: "#222" }}>
                현재 비밀번호
              </Form.Label>

              {/* 입력 + 눈아이콘 */}
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
                    border: "2px solid #c9ced6",           // 진한 테두리
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

              {/* 버튼 영역 */}
              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                }}
              >
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
    </div>
  );
};

export default MyPage;
