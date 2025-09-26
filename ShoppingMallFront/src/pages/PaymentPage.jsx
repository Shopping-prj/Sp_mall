import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { useCart } from "context/CartContext";
import { useAuth } from "context/AuthContext";

const PORTONE_IMP = "imp63553763";  // 포트원 가맹점 식별코드
const PG = "kakaopay";              // PG사: "kakaopay", "html5_inicis", "tosspayments" 등
const BASE_URL = process.env.REACT_APP_SPRING_IP || "http://localhost:8080";

// 토큰 헤더
const AUTH_HEADER = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// PortOne SDK 로드
function usePortOneLoader() {
  const [loaded, setLoaded] = useState(() => !!window.IMP);
  useEffect(() => {
    if (window.IMP) { setLoaded(true); return; }
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/v1/iamport.js";
    script.async = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => setLoaded(false);
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);
  return loaded;
}

const makeMerchantUid = (prefix = "mid") => `${prefix}_${Date.now()}`;
const toInt = (v) => (Number.isFinite(+v) ? parseInt(v, 10) : 0);

const PaymentPage = () => {
  const portOneLoaded = usePortOneLoader();
  const { cartItems } = useCart();
  const { isLoggedIn, loginMember } = useAuth();

  // 장바구니 합계
  const totalPrice = useMemo(
    () => (cartItems || []).reduce((sum, it) => sum + (it.p_lprice || 0) * (it.c_count || 0), 0),
    [cartItems]
  );
  const shipping = totalPrice > 50000 ? 0 : (totalPrice > 0 ? 2500 : 0);
  const finalPrice = totalPrice + shipping;

  // 구매자 정보
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerTel, setBuyerTel] = useState("");
  const [buyerPostcode, setBuyerPostcode] = useState("");
  const [buyerAddr, setBuyerAddr] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (loginMember) {
      setBuyerName(loginMember.m_name || "");
      setBuyerEmail(loginMember.m_email || "");
      setBuyerTel(loginMember.m_phone || "");
    }
  }, [loginMember]);

  // custom_data 용 요약
  const itemSummary = useMemo(
    () =>
      (cartItems || []).map((it) => ({
        productId: it.p_productId,
        title: it.p_title,
        price: it.p_lprice,
        count: it.c_count,
      })),
    [cartItems]
  );

  // 서버에 저장될 pending 요청 JSON
  const pendingPayload = useMemo(
    () => ({
      pay_merchant_uid: makeMerchantUid("mid"),
      pay_status: "ready",
      pay_currency: "KRW",
      m_amount: finalPrice,
      m_email: loginMember?.m_email ?? buyerEmail,

      c_no: cartItems.length > 0 ? cartItems[0].c_no : null, // 🔹 장바구니 FK

      pay_buyer_name: buyerName,
      pay_buyer_email: buyerEmail,
      pay_buyer_tel: buyerTel,
      pay_buyer_postcode: buyerPostcode,
      pay_address: buyerAddr,

      pay_name: `장바구니 결제 (${cartItems.length}개)`,
      pay_method: PG,
      pg_provider: PG,
      pg_type: "payment",
    }),
    [buyerName, buyerEmail, buyerTel, buyerPostcode, buyerAddr, finalPrice, cartItems]
  );

  const onClickPayment = useCallback(async () => {
    if (!isLoggedIn) {
      alert("로그인 후 결제할 수 있습니다.");
      return;
    }
    if (!portOneLoaded || !window.IMP) {
      alert("결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      alert("장바구니가 비어 있습니다.");
      return;
    }
    if (finalPrice <= 0) {
      alert("결제 금액이 올바르지 않습니다.");
      return;
    }

    setIsPaying(true);
    try {
      // 1) 서버에 pending 기록
      const pendingRes = await fetch(`${BASE_URL}/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...AUTH_HEADER() },
        body: JSON.stringify(pendingPayload),
      });
      if (!pendingRes.ok) {
        const text = await pendingRes.text();
        throw new Error(`결제 요청 기록 실패: ${text}`);
      }

      // 2) 포트원 결제창 호출
      const { IMP } = window;
      IMP.init(PORTONE_IMP);

      IMP.request_pay(
        {
          pg: PG,
          pay_method: PG,
          merchant_uid: pendingPayload.pay_merchant_uid,
          name: pendingPayload.pay_name,
          amount: toInt(finalPrice),
          buyer_name: buyerName,
          buyer_email: buyerEmail,
          buyer_tel: buyerTel,
          buyer_postcode: buyerPostcode,
          buyer_addr: buyerAddr,
          custom_data: { items: itemSummary, shipping, total: totalPrice },
        },
        async (rsp) => {
          try {
            if (rsp.success) {
              await fetch(`${BASE_URL}/api/payments/callback/success`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...AUTH_HEADER() },
                body: JSON.stringify(rsp),
              });
              alert("결제가 완료되었습니다.");
            } else {
              await fetch(`${BASE_URL}/api/payments/callback/cancel`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...AUTH_HEADER() },
                body: JSON.stringify(rsp),
              });
              alert(`결제가 취소되었습니다.\n사유: ${rsp.error_msg || "사용자 취소"}`);
            }
          } catch (e) {
            console.error(e);
            alert("결제 결과 저장 중 오류가 발생했습니다.");
          } finally {
            setIsPaying(false);
          }
        }
      );
    } catch (err) {
      console.error(err);
      alert(err.message || "결제를 시작할 수 없습니다.");
      setIsPaying(false);
    }
  }, [
    isLoggedIn,
    portOneLoaded,
    cartItems,
    pendingPayload,
    finalPrice,
    buyerName,
    buyerEmail,
    buyerTel,
    buyerPostcode,
    buyerAddr,
    itemSummary,
  ]);

  return (
    <Row className="justify-content-center mt-4">
      <Col md={8} lg={7}>
        <Card>
          <Card.Header>
            <strong>결제</strong>
          </Card.Header>
          <Card.Body>
            <div className="mb-3">
              <div>상품 합계: {totalPrice.toLocaleString()}원</div>
              <div>배송비: {shipping.toLocaleString()}원</div>
              <div style={{ fontWeight: 700 }}>
                결제 금액: {finalPrice.toLocaleString()}원
              </div>
            </div>

            <Form>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="buyerName">
                    <Form.Label>구매자 이름</Form.Label>
                    <Form.Control
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="buyerEmail">
                    <Form.Label>이메일</Form.Label>
                    <Form.Control
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="buyerTel">
                    <Form.Label>전화번호</Form.Label>
                    <Form.Control
                      type="text"
                      value={buyerTel}
                      onChange={(e) => setBuyerTel(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="primary"
                onClick={onClickPayment}
                disabled={!portOneLoaded || isPaying || !isLoggedIn || finalPrice <= 0}
              >
                {isPaying ? "결제 진행중..." : "결제하기"}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default PaymentPage;
