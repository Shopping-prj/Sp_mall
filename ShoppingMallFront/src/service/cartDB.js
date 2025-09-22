import axios from "axios";

const BASE = `${process.env.REACT_APP_SPRING_IP}/api/carts`;

// 장바구니 추가
export const addToCart = async ({ c_email, c_productId, c_count }) => {
  const res = await axios({
    method: "post",
    url: `${BASE}`,
    params: {
      email: c_email,
      productId: c_productId,
      count: c_count || 1,
    },
  });
  return res.data;
};

// 회원별 장바구니 조회
export const getCartByEmail = async (email) => {
  const res = await axios({
    method: "get",
    url: `${BASE}/${email}`,
  });
  return res.data;
};

// 장바구니 수량 변경
export const updateCartCount = async (ciNo, count) => {
  const res = await axios({
    method: "patch",
    url: `${BASE}/item/${ciNo}`,
    params: { count },
  });
  return res.data;
};

// 장바구니 단건 삭제
export const removeCartItem = async (ciNo) => {
  const res = await axios({
    method: "delete",
    url: `${BASE}/item/${ciNo}`,
  });
  return res.data;
};

// 회원 장바구니 전체 비우기
export const clearCartByEmail = async (email) => {
  const res = await axios({
    method: "delete",
    url: `${BASE}/clear/${email}`,
  });
  return res.data;
};

// ✅ guest_cart → DB 머지 (추후 merge API 필요)
export const syncGuestCartToDB = async (userEmail) => {
  const saved = localStorage.getItem("guest_cart");
  if (saved) {
    const guestItems = JSON.parse(saved).map((item) => ({
      c_email: userEmail,
      c_productId: item.p_productId,
      c_count: item.c_count,
    }));
    if (guestItems.length > 0) {
      // TODO: 백엔드에 /merge 엔드포인트 구현 후 사용
      await axios.post(`${BASE}/merge`, guestItems);
      localStorage.removeItem("guest_cart");
    }
  }
};
