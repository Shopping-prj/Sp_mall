import { createContext, useContext, useEffect, useState } from "react";
import {
  addToCart,
  getCartByEmail,
  updateCartCount,
  removeCartItem,
  clearCartByEmail,
} from "service/cartDB";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부
  const [email, setEmail] = useState(null); // 로그인한 사용자 이메일

  // ✅ 회원 장바구니 로드
  const loadCart = async (userEmail) => {
    if (!userEmail) return;
    try {
      const data = await getCartByEmail(userEmail);
      setCartItems(data);
    } catch (err) {
      console.error("장바구니 불러오기 실패:", err);
    }
  };

  // ✅ 아이템 추가
  const addItem = async (item) => {
    if (isLoggedIn && email) {
      try {
        await addToCart({
          c_email: email,
          c_productId: item.p_productId,
          c_count: 1,
          c_payment: 0,
        });
        loadCart(email);
      } catch (err) {
        console.error("DB 장바구니 추가 실패:", err);
      }
    } else {
      // 비회원 → localStorage
      setCartItems((prev) => {
        const exists = prev.find((p) => p.p_productId === item.p_productId);
        if (exists) {
          return prev.map((p) =>
            p.p_productId === item.p_productId
              ? { ...p, c_count: p.c_count + 1 }
              : p
          );
        }
        return [...prev, { ...item, c_count: 1 }];
      });
    }
  };

  // ✅ 수량 변경
  const changeCount = async (id, newCount) => {
    if (newCount < 1) return;

    if (isLoggedIn && email) {
      try {
        await updateCartCount(id, newCount); // c_no 기준
        loadCart(email);
      } catch (err) {
        console.error("DB 수량 변경 실패:", err);
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.p_productId === id ? { ...item, c_count: newCount } : item
        )
      );
    }
  };

  // ✅ 아이템 삭제
  const removeItem = async (id) => {
    if (isLoggedIn && email) {
      try {
        await removeCartItem(id); // c_no 기준
        loadCart(email);
      } catch (err) {
        console.error("DB 삭제 실패:", err);
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item.p_productId !== id));
    }
  };

  // ✅ 전체 비우기
  const clearCart = async () => {
    if (isLoggedIn && email) {
      try {
        await clearCartByEmail(email);
        loadCart(email);
      } catch (err) {
        console.error("DB 전체 비우기 실패:", err);
      }
    } else {
      setCartItems([]);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        changeCount,
        removeItem,
        clearCart,
        loadCart,
        isLoggedIn,
        setIsLoggedIn,
        email,
        setEmail,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
