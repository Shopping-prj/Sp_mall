// src/service/orderDB.js
import api from "./axios";

/**
 * 1. 회원 이메일로 전체 주문 내역 조회
 * 백엔드: GET /api/order?o_email=...
 * 반환: OrderItemDTO[]
 */
export const getOrdersByEmail = async (o_email) => {
  const res = await api({
    method: "get",
    url: "/api/order",
    params: { o_email },
    headers: { "Content-Type": "application/json" },
  });
  return res.data; // List<OrderItemDTO>
};

/**
 * 2. 회원 이메일 기준으로 날짜별 주문 그룹 조회
 * 백엔드: GET /api/order/grouped?o_email=...
 * 반환: { "YYYY-MM-DD": [OrderItemDTO, ...] }
 */
export const getOrdersGroupedByDate = async (o_email) => {
  const res = await api({
    method: "get",
    url: "/api/order/grouped",
    params: { o_email },
    headers: { "Content-Type": "application/json" },
  });
  return res.data; // Map<String, List<OrderItemDTO>>
};

/**
 * 3. 주문 검색 (상품명 등)
 * 백엔드: POST /api/order/search
 * 요청: { o_email: "...", keyword: "..." } 형태의 Map<String,String>
 * 반환: List<OrderItemDTO>
 */
export const searchOrders = async (searchParams) => {
  const res = await api({
    method: "post",
    url: "/api/order/search",
    params: searchParams,
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const searchPayments = async (searchParams = {}) => {
  const res = await api({
    method: "get",
    url: "/api/payments/search",
    params: searchParams, // 예: { status: "paid", email: "test@test.com" }
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

