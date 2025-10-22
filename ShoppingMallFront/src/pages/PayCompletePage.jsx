// src/pages/PayComplete.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { clearCartByEmail } from "service/cartDB";   // ✅ 이미 있는 함수 사용
import { useCart } from "context/CartContext";        // ✅ cart 상태 초기화 위해
import { getMyInfo } from "service/memberDB";
import { getOrdersGroupedByDate } from "service/orderDB";

const MY_PAGE_PATH = "/shop/mypage";

const PayComplete = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { resetCart } = useCart();

  // 결제 완료 콜백에서 넘어온(있을 수도, 없을 수도) 값
  const state_o_no = state?.o_no ?? null;
  const state_amount = state?.pay_amount ?? null;
  const state_o_image = state?.o_image ?? null;   // ✅ 추가
  const receiptUrl = state?.pay_receipt_url ?? null;

  // ✅ DB 재조회로 얻을 최신 주문
  const [order, setOrder] = useState(null);

  // ✅ 결제 완료 시점에서 "가장 최근 주문" 가져오기
  useEffect(() => {
    const loadOrder = async () => {
      try {
        const me = await getMyInfo();
        if (!me?.m_email) return;

        const grouped = await getOrdersGroupedByDate(me.m_email);
        // 1) 모든 주문 펼치기
        const all = Object.values(grouped).flat();

        if (!all?.length) return;

        // 2) 최신 한 건 선택: o_created_at DESC, 보조로 o_no DESC
        all.sort((a, b) => {
          const tB = Date.parse(b.o_created_at) || 0;
          const tA = Date.parse(a.o_created_at) || 0;
          if (tB !== tA) return tB - tA;
          return (parseInt(b.o_no, 10) || 0) - (parseInt(a.o_no, 10) || 0);
        });

        setOrder(all[0]);

        console.log(all);
      } catch (err) {
        console.error("❌ 주문 재조회 실패:", err);
      }
    };

    loadOrder();
  }, []);

  // 화면에 보여줄 값(우선순위: DB재조회 → state)
  const displayONo = order?.o_no ?? state_o_no ?? "-";
  const displayAmount = order?.o_amount ?? state_amount ?? null;
  const displayOImage = order?.o_image ?? state_o_image ?? null;   // ✅ 최신 이미지 선택

  // ✅ "확인" 버튼 클릭 시 장바구니 비우기 + 마이페이지 이동
  const handleConfirm = async () => {
    try {
      await clearCartByEmail(); // DB 장바구니 삭제
      resetCart();              // Context 상태도 초기화
    } catch (e) {
      console.error("❌ 카트 초기화 실패:", e);
    } finally {
      navigate(MY_PAGE_PATH, { replace: true });
    }
  };

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>
          <strong>결제 성공</strong>
        </Card.Header>
        <Card.Body>
          <p className="mb-1">결제가 정상 처리되었습니다.</p>

          {/* ✅ 최신 주문 이미지 썸네일 (있을 때만) */}
          {displayOImage && (
            <div className="mb-3 d-flex">
              <img
                src={displayOImage}
                alt="주문 상품"
                style={{
                  width: 96,
                  height: 96,
                  objectFit: "cover",
                  borderRadius: 10,
                  border: "1px solid #e9ecef",
                }}
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </div>
          )}

          <div className="text-muted" style={{ fontSize: "0.9rem" }}>
            <div>주문번호: {displayONo}</div>
            <div>
              결제 금액:{" "}
              {displayAmount != null ? `${Number(displayAmount).toLocaleString()}원` : "-"}
            </div>
          </div>

          <div className="d-flex gap-2 justify-content-end mt-3">
            {/* 테스트(mockup) 영수증은 종종 타임아웃 → 운영 전환 전엔 숨기거나 안내하세요 */}
            {receiptUrl && (
              <Button
                variant="secondary"
                onClick={() =>
                  window.open(receiptUrl, "_blank", "noopener,noreferrer")
                }
              >
                영수증 보기
              </Button>
            )}
            <Button variant="primary" onClick={handleConfirm}>
              확인
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PayComplete;
