import axios from "axios";

const BASE = `${process.env.REACT_APP_SPRING_IP}/api/carts`;

export const syncGuestCartToDB = async (loginEmail) => {
  const saved = localStorage.getItem("guest_cart");
  if (!saved) return;

  const guestItems = JSON.parse(saved);

  for (const item of guestItems) {
    const transformed = {
      c_email: loginEmail,           // 필수: 로그인한 회원 이메일
      c_productId: item.p_productId, // 기존 키 → 백엔드 키로 맞춤
      c_count: item.c_count,         // 수량 그대로 전달
    };

    await axios({
      method: "post",
      url: `${BASE}`,
      params: transformed,
    });
  }

  localStorage.removeItem("guest_cart");
};

/**
 * 장바구니 추가
 * 🔧 유지: Controller가 @RequestParam으로 받으므로 params에 실어 전송
 */
export const addToCart = async ({ c_email, c_productId, c_count }) => {
  const res = await axios({
    method: "post",
    url: `${BASE}`,
    params: {
      email: c_email,                 // Controller: @RequestParam String email
      productId: c_productId,         // Controller: @RequestParam String productId
      count: c_count || 1,            // Controller: @RequestParam int count (default 1)
    },
  });
  return res.data;
};

/** 
 * 회원별 장바구니 조회
 * 🔧 변경: 백엔드가 List<CartItemDTO> (배열) 반환 → 프론트는 그대로 setCartItems(data)
 */
export const getCartByEmail = async (email) => {
  const res = await axios({
    method: "get",
    url: `${BASE}/${email}`,
  });
  return res.data; // Array<CartItemDTO>
};

/** 장바구니 수량 변경 */
export const updateCartCount = async (ciNo, count) => {
  const res = await axios({
    method: "patch",
    url: `${BASE}/item/${ciNo}`,
    params: { count },
  });
  return res.data;
};

/** 장바구니 단건 삭제 */
export const removeCartItem = async (ciNo) => {
  const res = await axios({
    method: "delete",
    url: `${BASE}/item/${ciNo}`,
  });
  return res.data;
};

/** 장바구니 전체 삭제 */
export const clearCartByEmail = async (email) => {
  const res = await axios({
    method: "delete",
    url: `${BASE}/clear/${email}`,
  });
  return res.data;
};
