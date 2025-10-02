import api from "./axios";

const BASE = "/api/carts";

// 1. 회원 → 장바구니 로드
export const getCartByEmail = async () => {
  try {
    console.log("📌 [getCartByEmail] 실행됨");
    const res = await api({
      method: "get",
      url: `${BASE}`,
    });
    console.log("📌 [getCartByEmail 응답]", res.status, res.data);
    return res.data; // CartDTO 반환 예상
  } catch (err) {
    console.error("❌ [getCartByEmail 실패]", err.response?.status, err);
    throw err;
  }
};

// 2. 회원 → 상품 추가
export const addToCart = async ({ c_productId, c_count }) => {
  try {
    console.log("📌 [addToCart] 실행됨", { c_productId, c_count });
    const res = await api({
      method: "post",
      url: `${BASE}/add`,
      data: {
        productId: c_productId,
        count: c_count || 1,
      },
    });
    console.log("📌 [addToCart 응답]", res.status, res.data);
    return res.data;
  } catch (err) {
    console.error("❌ [addToCart 실패]", err.response?.status, err);
    throw err;
  }
};

// 3. 회원 → 수량 변경
export const updateCartCount = async (c_no, c_productId, addCount) => {
  try {
    console.log("📌 [updateCartCount] 실행됨", { c_no, c_productId, addCount });
    const res = await api({
      method: "put",
      url: `${BASE}/update`,
      params: {
        c_no,
        c_productId,
        addCount,
      },
    });
    console.log("📌 [updateCartCount 응답]", res.status, res.data);
    return res.data;
  } catch (err) {
    console.error("❌ [updateCartCount 실패]", err.response?.status, err);
    throw err;
  }
};

// 4. 회원 → 단일 삭제
export const removeCartItem = async (ci_no) => {
  try {
    console.log("📌 [removeCartItem] 실행됨", ci_no);
    const res = await api({
      method: "delete",
      url: `${BASE}/item`,
      params: { ci_no },
    });
    console.log("📌 [removeCartItem 응답]", res.status, res.data);
    return res.data;
  } catch (err) {
    console.error("❌ [removeCartItem 실패]", err.response?.status, err);
    throw err;
  }
};

// 5. 회원 → 전체 삭제
export const clearCartByEmail = async () => {
  try {
    console.log("📌 [clearCartByEmail] 실행됨");
    const res = await api({
      method: "delete",
      url: `${BASE}/clear`,
    });
    console.log("📌 [clearCartByEmail 응답]", res.status, res.data);
    return res.data;
  } catch (err) {
    console.error("❌ [clearCartByEmail 실패]", err.response?.status, err);
    throw err;
  }
};
