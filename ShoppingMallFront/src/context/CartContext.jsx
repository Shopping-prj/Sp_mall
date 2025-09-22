// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  addToCart,
  getCartByEmail,
  updateCartCount,
  removeCartItem,
  clearCartByEmail,
  syncGuestCartToDB,
} from "service/cartDB";
import { useAuth } from "context/AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isLoggedIn, loginMember } = useAuth(); // ✅ 로그인 상태 가져오기
  const [cartItems, setCartItems] = useState([]);

  // ==================== 비회원 로컬스토리지 처리 ====================
  useEffect(() => {
    if (!isLoggedIn) {
      const saved = localStorage.getItem("guest_cart");
      if (saved) setCartItems(JSON.parse(saved));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem("guest_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoggedIn]);

  // ==================== 회원 장바구니 처리 ====================
  const loadCart = async (userEmail) => {
    if (userEmail) {
      const data = await getCartByEmail(userEmail);
      setCartItems(data);
    }
  };

  // ✅ 로그인 상태 변화를 감지해서 DB 장바구니 자동 로드
  useEffect(() => {
    if (isLoggedIn && loginMember?.m_email) {
      // ⚠️ guest_cart가 있으면 병합 → DB 반영
      syncGuestCartToDB(loginMember.m_email).then(() => {
        loadCart(loginMember.m_email);
      });
    }
  }, [isLoggedIn, loginMember]);

  // ==================== 장바구니 조작 함수들 ====================
  const addItem = async (product) => {
    if (isLoggedIn) {
      await addToCart({
        email: loginMember.m_email,
        productId: product.p_productId,
        count: 1,
      });
      loadCart(loginMember.m_email);
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
          { ...product, c_count: 1, c_no: Date.now() }, // guest용 임시 PK
        ]);
      }
    }
  };

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

  const removeItem = async (item) => {
    if (isLoggedIn) {
      await removeCartItem(item.ci_no);
      await loadCart(loginMember.m_email);
    } else {
      setCartItems(cartItems.filter((i) => i.p_productId !== item.p_productId));
    }
  };

  const clearCart = async () => {
    if (isLoggedIn) {
      await clearCartByEmail(loginMember.m_email);
      setCartItems([]);
    } else {
      setCartItems([]);
      localStorage.removeItem("guest_cart");
    }
  };

  // ==================== Context Provider 반환 ====================
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        changeCount,
        removeItem,
        clearCart,
        loadCart, // 필요시 수동 호출용
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
