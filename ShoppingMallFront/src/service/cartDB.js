import axios from "axios";

const BASE = `${process.env.REACT_APP_SPRING_IP}/api/carts`;

// ✅ 공통 헤더 생성 함수
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 1. 회원 → 장바구니 로드
export const getCartByEmail = async () => {
  try {
    const res = await axios({
      method: "get",
      url: `${BASE}`,
      headers: getAuthHeaders(),
    });
    return res.data; // CartDTO 반환 예상
  } catch (err) {
    console.error("❌ getCartByEmail 실패:", err);
    throw err;
  }
};

// 2. 회원 → 상품 추가
export const addToCart = async ({ c_productId, c_count }) => {
  try {
    const res = await axios({
      method: "post",
      url: `${BASE}/add`,
      data: {
        productId: c_productId,
        count: c_count || 1,
      },
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    console.error("❌ addToCart 실패:", err);
    throw err;
  }
};

// 3. 회원 → 수량 변경
export const updateCartCount = async (c_no, c_productId, addCount) => {
  try {
    const res = await axios({
      method: "put",
      url: `${BASE}/update`,
      params: {
        c_no,       // @RequestParam Long c_no
        c_productId,
        addCount,   // @RequestParam int count
      },
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    console.error("❌ removeCartItem 실패:", err);
    throw err;
  }
};

// 5. 회원 → 전체 삭제
export const clearCartByEmail = async () => {
  try {
    const res = await axios({
      method: "delete",
      url: `${BASE}/clear`,
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    console.error("❌ clearCartByEmail 실패:", err);
    throw err;
  }
};
