import axios from "axios";

const BASE = `${process.env.REACT_APP_SPRING_IP}api/carts`;

// 장바구니 추가
export const addToCart = async (cartItem) => {
  const res = await axios({
    method: "post",
    url: `${BASE}`,
    data: cartItem,
  });
  return res.data;
};

// 회원별 장바구니 조회
export const getCartByEmail = async (email) => {
  const res = await axios({
    method: "get",
    url: `${BASE}/member/${email}`,
  });
  return res.data;
};

// 장바구니 단건 조회
export const getCartByNo = async (no) => {
  const res = await axios({
    method: "get",
    url: `${BASE}/${no}`,
  });
  return res.data;
};

// 장바구니 수량 변경
export const updateCartCount = async (no, count) => {
  const res = await axios({
    method: "patch",
    url: `${BASE}/${no}/count`,
    data: count,
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// 장바구니 단건 삭제
export const removeCartItem = async (no) => {
  const res = await axios({
    method: "delete",
    url: `${BASE}/${no}`,
  });
  return res.data;
};

// 회원 장바구니 전체 비우기
export const clearCartByEmail = async (email) => {
  const res = await axios({
    method: "delete",
    url: `${BASE}/member/${email}`,
  });
  return res.data;
};
