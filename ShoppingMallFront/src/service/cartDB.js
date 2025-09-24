import axios from "axios";

const BASE = `${process.env.REACT_APP_SPRING_IP}/api/carts`;

// 1. 회원 → 장바구니 로드
export const getCartByEmail = async (email) => {
  try {
    const res = await axios({
      method: "get",
      url: `${BASE}`,
      params: { email }, // Controller: @RequestParam String email
    });
    return res.data; // CartDTO 반환 예상
  } catch (err) {
    console.error("❌ getCartByEmail 실패:", err);
    throw err;
  }
};

// 2. 회원 → 상품 추가
export const addToCart = async ({ c_email, c_productId, c_count }) => {
  try {
    const res = await axios({
      method: "post",
      url: `${BASE}/add`,
      data: {
        email: c_email,
        productId: c_productId,
        count: c_count || 1,
      },
    });
    return res.data;
  } catch (err) {
    console.error("❌ addToCart 실패:", err);
    throw err;
  }
};


// 3. 회원 → 수량 변경
export const updateCartCount = async (ci_no, c_count) => {
  try {
    const res = await axios({
      method: "put",
      url: `${BASE}/update`,
      params: {
        ci_no,   // @RequestParam Long ci_no
        count: c_count, // @RequestParam int count
      },
    });
    return res.data;
  } catch (err) {
    console.error("❌ updateCartCount 실패:", err);
    throw err;
  }
};

// 4. 회원 → 단일 삭제
export const removeCartItem = async (ci_no) => {
  try {
    const res = await axios({
      method: "delete",
      url: `${BASE}/item`,
      params: { ci_no }, // @RequestParam Long ci_no
    });
    return res.data;
  } catch (err) {
    console.error("❌ removeCartItem 실패:", err);
    throw err;
  }
};

// 5. 회원 → 전체 삭제
export const clearCartByEmail = async (email) => {
  try {
    const res = await axios({
      method: "delete",
      url: `${BASE}/clear`,
      params: { email }, // @RequestParam String email
    });
    return res.data;
  } catch (err) {
    console.error("❌ clearCartByEmail 실패:", err);
    throw err;
  }
};
