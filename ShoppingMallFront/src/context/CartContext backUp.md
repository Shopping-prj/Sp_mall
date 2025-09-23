// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  addToCart,
  getCartByEmail,
  updateCartCount,
  removeCartItem,
  clearCartByEmail,
} from "service/cartDB";
import { useAuth } from "context/AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isLoggedIn, loginMember } = useAuth(); // 로그인 상태 확인
  const [cartItems, setCartItems] = useState([]);

  // ==================== 1. 비회원 로컬스토리지 불러오기 ====================
  useEffect(() => {
    if (!isLoggedIn) {
      const saved = localStorage.getItem("guest_cart");
      if (saved) setCartItems(JSON.parse(saved));
    }
  }, [isLoggedIn]);

  // ==================== 2. 비회원 로컬스토리지 저장 ====================
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem("guest_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoggedIn]);

  // ==================== 3. 회원 장바구니 로드 ====================
  const loadCart = async (userEmail) => {
    if (userEmail) {
      const data = await getCartByEmail(userEmail); // 백엔드에서 DTO 형태로 받아옴
      setCartItems(data);
    }
  };

  // ==================== 4. 로그인 직후 → guest_cart → DB로 insert ====================
  useEffect(() => {
    const syncGuestCartToDB = async () => {
      const saved = localStorage.getItem("guest_cart");
      if (!saved || !loginMember?.m_email) return;

      const guestItems = JSON.parse(saved);

      for (const item of guestItems) {
        await addToCart({
          c_email: loginMember.m_email,         // 🔧 검증 로직 기준 key
          c_productId: item.p_productId,
          c_count: item.c_count,
        });
      }

      localStorage.removeItem("guest_cart"); // 병합이 아닌 insert 완료 후 제거
      loadCart(loginMember.m_email);         // 다시 장바구니 불러오기
    };

    if (isLoggedIn) {
      syncGuestCartToDB();
    }
  }, [isLoggedIn, loginMember]);

  // ==================== 5. 상품 추가 ====================
  const addItem = async (product) => {
    if (isLoggedIn) {
      await addToCart({
        c_email: loginMember.m_email,
        c_productId: product.p_productId,
        c_count: 1,
      });
      await loadCart(loginMember.m_email);
    } else {
      const exists = cartItems.find((i) => i.p_productId === product.p_productId);
      if (exists) {
        setCartItems(
          cartItems.map((i) =>
            i.p_productId === product.p_productId
              ? { ...i, c_count: i.c_count + 1 }
              : i
          )
        );
      } else {
        setCartItems([
          ...cartItems,
          { ...product, c_count: 1, c_no: Date.now() },
        ]);
      }
    }
  };

  // ==================== 6. 수량 변경 ====================
  const changeCount = async (item, count) => {
    if (isLoggedIn) {
      await updateCartCount(item.ci_no, count);
      await loadCart(loginMember.m_email);
    } else {
      setCartItems((prev) =>
        prev.map((i) =>
          i.p_productId === item.p_productId ? { ...i, c_count: count } : i
        )
      );
    }
  };

  // ==================== 7. 단일 삭제 ====================
  const removeItem = async (item) => {
    if (isLoggedIn) {
      await removeCartItem(item.ci_no);
      await loadCart(loginMember.m_email);
    } else {
      setCartItems(cartItems.filter((i) => i.p_productId !== item.p_productId));
    }
  };

  // ==================== 8. 전체 삭제 ====================
  const clearCart = async () => {
    if (isLoggedIn) {
      await clearCartByEmail(loginMember.m_email);
      setCartItems([]);
    } else {
      setCartItems([]);
      localStorage.removeItem("guest_cart");
    }
  };

  // ==================== Context 반환 ====================
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        changeCount,
        removeItem,
        clearCart,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
