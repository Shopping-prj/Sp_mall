import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { useCart } from "context/CartContext";
import { useAuth } from "context/AuthContext";

const PORTONE_IMP = "imp63553763"; // 포트원 가맹점 식별코드
const PG = "kakaopay"; // PG사
const BASE_URL = process.env.REACT_APP_SPRING_IP || "http://localhost:8080";

// ✅ JWT 토큰 헤더
const AUTH_HEADER = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ PortOne SDK 로드 훅
function usePortOneLoader() {
  const [loaded, setLoaded] = useState(() => !!window.IMP);
  useEffect(() => {
    if (window.IMP) {
      setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/v1/iamport.js";
    script.async = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => setLoaded(false);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return loaded;
}

const makeMerchantUid = (prefix = "mid") => `${prefix}_${Date.now()}`;
const toInt = (v) => (Number.isFinite(+v) ? parseInt(v, 10) : 0);

const PaymentPage = () => {
  const portOneLoaded = usePortOneLoader();
  const { cartItems } = useCart();
  const { isLoggedIn, email } = useAuth();

  // ✅ 장바구니 번호
  const cartNo = useMemo(
    () => (cartItems && cartItems.length > 0 ? cartItems[0].c_no : null),
    [cartItems]
  );

  // ✅ 장바구니 합계
  const totalPrice = useMemo(
    () =>
      (cartItems || []).reduce(
        (sum, it) => sum + (it.p_lprice || 0) * (it.c_count || 0),
        0
      ),
    [cartItems]
  );

  // ✅ 구매자 정보 상태
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerTel, setBuyerTel] = useState("");
  const [buyerPostcode, setBuyerPostcode] = useState("");
  const [buyerAddr, setBuyerAddr] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  // ✅ 결제 상세
  const [paymentDetail, setPaymentDetail] = useState(null);

  // ✅ 로그인한 사용자 기본 정보 불러오기
  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/users/me`, {
          method: "GET",
          headers: { ...AUTH_HEADER() },
        });
        if (res.ok) {
          const member = await res.json();
          setBuyerName(member.m_name || "");
          setBuyerEmail(member.m_email || "");
          setBuyerAddr(member.m_address || "");
          setBuyerTel(member.m_tel || "");
        }
      } catch (err) {
        console.error("회원 정보 불러오기 실패:", err);
      }
    };
    if (isLoggedIn) fetchMemberInfo();
  }, [isLoggedIn]);

  // ✅ 결제요약(custom_data)
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

  // ✅ 결제 준비용 payload (pending)
  const pendingPayload = useMemo(
    () => ({
      pay_merchant_uid: makeMerchantUid("mid"),
      pay_status: "ready",
      pay_currency: "KRW",
      pay_amount: totalPrice,
      pay_email: email,
      c_no: cartNo,
      pay_buyer_name: buyerName,
      pay_buyer_tel: buyerTel,
      pay_buyer_postcode: buyerPostcode,
      pay_address: buyerAddr,
      pay_name: `장바구니 결제 (${cartItems.length}개)`,
      pay_method: PG,
      pg_provider: PG,
      pg_type: "payment",
    }),
    [
      email,
      buyerName,
      buyerTel,
      buyerPostcode,
      buyerAddr,
      totalPrice,
      cartNo,
      cartItems,
    ]
  );

  // ✅ 결제 상세 조회
  const fetchPaymentDetail = async (impUid) => {
    try {
      const res = await fetch(`${BASE_URL}/api/payments/${impUid}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", ...AUTH_HEADER() },
      });
      if (!res.ok) throw new Error("결제 상세 조회 실패");
      const data = await res.json();
      console.log("결제 상세 조회 성공:", data);
      setPaymentDetail(data);
      return data;
    } catch (err) {
      console.error("결제 상세 조회 오류:", err);
    }
  };

  // ✅ 결제 실행 함수
  const onClickPayment = useCallback(async () => {
    if (!isLoggedIn) {
      alert("로그인 후 결제할 수 있습니다.");
      return;
    }
    if (!portOneLoaded || !window.IMP) {
      alert("결제 모듈을 불러오는 중입니다.");
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      alert("장바구니가 비어 있습니다.");
      return;
    }
    if (totalPrice <= 0) {
      alert("결제 금액이 올바르지 않습니다.");
      return;
    }

    setIsPaying(true);
    try {
      // ✅ 1) 금액 검증 (pending 저장)
      const pendingRes = await fetch(`${BASE_URL}/api/payments/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...AUTH_HEADER() },
        body: JSON.stringify(pendingPayload),
      });
      if (!pendingRes.ok) {
        const text = await pendingRes.text();
        throw new Error(`결제 요청 기록 실패: ${text}`);
      }

      // ✅ 2) 결제창 호출
      const { IMP } = window;
      IMP.init(PORTONE_IMP);

      IMP.request_pay(
        {
          pg: PG,
          pay_method: PG,
          merchant_uid: pendingPayload.pay_merchant_uid,
          name: pendingPayload.pay_name,
          amount: toInt(totalPrice),
          buyer_name: buyerName,
          buyer_email: buyerEmail,
          buyer_tel: buyerTel,
          buyer_postcode: buyerPostcode,
          buyer_addr: buyerAddr,
          custom_data: { items: itemSummary, total: totalPrice },
        },
        async (rsp) => {
          try {
            if (rsp.success) {
              // ✅ 결제 성공
              await fetch(`${BASE_URL}/api/payments/callback/success`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...AUTH_HEADER(),
                },
                body: JSON.stringify({
                  ...pendingPayload,
                  pay_imp_uid: rsp.imp_uid,
                  pay_pg_tid: rsp.pg_tid || null,
                  pay_paid_amount: rsp.paid_amount,
                  pay_receipt_url: rsp.receipt_url || null,
                  apply_num: rsp.apply_num || null,
                  card_name: rsp.card_name || null,
                  card_number: rsp.card_number || null,
                  bank_name: rsp.bank_name || null,
                  pay_status: "paid",
                  success: rsp.success,
                }),
              });
              alert("결제가 완료되었습니다.");
            } else {
              // ❌ 결제 취소/실패
              await fetch(`${BASE_URL}/api/payments/callback/cancel`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...AUTH_HEADER(),
                },
                body: JSON.stringify({
                  ...pendingPayload, // ⚡ PortOne이 안 주는 값 채움
                  pay_imp_uid: rsp.imp_uid || null,
                  pay_merchant_uid: rsp.merchant_uid || null,
                  pay_pg_tid: rsp.pg_tid || null,
                  pay_status: "cancelled",
                  pay_paid_amount: 0,
                  pay_paid_at: null,
                  error_msg:
                    rsp.error_msg || "[결제포기] 사용자가 결제를 취소하셨습니다",
                  success: rsp.success || false,
                }),
              });
              alert(
                `결제가 취소되었습니다.\n사유: ${
                  rsp.error_msg || "사용자 취소"
                }`
              );
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
    totalPrice,
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
              <div style={{ fontWeight: 700 }}>
                결제 금액: {totalPrice.toLocaleString()}원
              </div>
            </div>

            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="buyerName">
                    <Form.Label>구매자 이름</Form.Label>
                    <Form.Control type="text" value={buyerName} readOnly />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="buyerEmail">
                    <Form.Label>이메일</Form.Label>
                    <Form.Control type="email" value={buyerEmail} readOnly />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="buyerTel">
                    <Form.Label>전화번호</Form.Label>
                    <Form.Control
                      type="text"
                      value={buyerTel}
                      onChange={(e) => setBuyerTel(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="buyerPostcode">
                    <Form.Label>우편번호</Form.Label>
                    <Form.Control
                      type="text"
                      value={buyerPostcode}
                      onChange={(e) => setBuyerPostcode(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group controlId="buyerAddress">
                    <Form.Label>배송지</Form.Label>
                    <Form.Control
                      type="text"
                      value={buyerAddr}
                      placeholder="배송지를 입력하세요"
                      onChange={(e) => setBuyerAddr(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="primary"
                onClick={onClickPayment}
                disabled={!portOneLoaded || isPaying || !isLoggedIn || totalPrice <= 0}
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
