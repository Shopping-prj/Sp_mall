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
  const { isLoggedIn, loginMember } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // ==========================================================
  // ==================== 비회원 로직 (Local) =================
  // ==========================================================

  // 1. 비회원 → 로컬스토리지 저장/불러오기
  useEffect(() => {
    if (!isLoggedIn) {
      const saved = localStorage.getItem("guest_cart");
      if (saved) setCartItems(JSON.parse(saved));
    } else {
      setCartItems([]); // 로그인 전환 시 guest_cart 초기화
      localStorage.removeItem("guest_cart");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem("guest_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoggedIn]);

  // 2. 비회원 → 상품 추가
  const addItemLocal = (product, count = 1) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.p_productId === product.p_productId);
      if (exists) {
        return prev.map((i) =>
          i.p_productId === product.p_productId
            ? { ...i, c_count: i.c_count + count }
            : i
        );
      } else {
        return [...prev, { ...product, c_count: count, c_no: Date.now() }];
      }
    });
  };

  // 3. 비회원 → 수량 변경
  const changeCountLocal = (item, newCount) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.p_productId === item.p_productId ? { ...i, c_count: newCount } : i
      )
    );
  };

  // 4. 비회원 → 단일 삭제
  const removeItemLocal = (item) => {
    setCartItems((prev) =>
      prev.filter((i) => i.p_productId !== item.p_productId)
    );
  };

  // 5. 비회원 → 전체 삭제
  const clearCartLocal = () => {
    setCartItems([]);
    localStorage.removeItem("guest_cart");
  };

  // ==========================================================
  // ==================== 회원 로직 (DB) =======================
  // ==========================================================

  // 1. 로그인 직후 자동 로드
  useEffect(() => {
    if (isLoggedIn && loginMember?.m_email) {
      loadCart(loginMember.m_email);
    }
  }, [isLoggedIn, loginMember]);

  const loadCart = async (userEmail) => {
    if (userEmail) {
      const data = await getCartByEmail(userEmail);
      setCartItems(data);
    }
  };

  // 2. 회원 → 상품 추가
  const addItemDB = async (product, count = 1) => {
    // UI 낙관적 반영
    setCartItems((prev) => {
      const exists = prev.find((i) => i.p_productId === product.p_productId);
      if (exists) {
        return prev.map((i) =>
          i.p_productId === product.p_productId
            ? { ...i, c_count: i.c_count + count }
            : i
        );
      } else {
        return [...prev, { ...product, c_count: count }];
      }
    });

    try {
      await addToCart({
        c_email: loginMember.m_email,
        c_productId: product.p_productId,
        c_count: count,
      });
      await loadCart(loginMember.m_email);
    } catch (err) {
      console.error(err);
      await loadCart(loginMember.m_email); // 롤백
    }
  };

  // 3. 회원 → 수량 변경
  const changeCountDB = async (item, newCount) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.ci_no === item.ci_no ? { ...i, c_count: newCount } : i
      )
    );
    try {
      await updateCartCount(item.ci_no, newCount);
      await loadCart(loginMember.m_email);
    } catch (err) {
      console.error(err);
      await loadCart(loginMember.m_email);
    }
  };

  // 4. 회원 → 단일 삭제
  const removeItemDB = async (item) => {
    setCartItems((prev) => prev.filter((i) => i.ci_no !== item.ci_no));
    try {
      await removeCartItem(item.ci_no);
      await loadCart(loginMember.m_email);
    } catch (err) {
      console.error(err);
      await loadCart(loginMember.m_email);
    }
  };

  // 5. 회원 → 전체 삭제
  const clearCartDB = async () => {
    try {
      await clearCartByEmail(loginMember.m_email);
      await loadCart(loginMember.m_email);
    } catch (err) {
      console.error(err);
      await loadCart(loginMember.m_email);
    }
  };

  // ==========================================================
  // ==================== 통합 제어 ============================
  // ==========================================================
  const addItem = (product, count = 1) =>
    isLoggedIn ? addItemDB(product, count) : addItemLocal(product, count);

  const changeCount = (item, newCount) =>
    isLoggedIn ? changeCountDB(item, newCount) : changeCountLocal(item, newCount);

  const removeItem = (item) =>
    isLoggedIn ? removeItemDB(item) : removeItemLocal(item);

  const clearCart = () =>
    isLoggedIn ? clearCartDB() : clearCartLocal();

  // ==========================================================
  // ==================== Context 반환 =========================
  // ==========================================================
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
