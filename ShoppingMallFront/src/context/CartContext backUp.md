// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { addToCart, getCartByEmail, removeCartItem, clearCartByEmail } from "service/cartDB";
import { useAuth } from "context/AuthContext";
import { updateCartCount } from "service/cartDB";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { loginMember } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // 최초 로딩 시, DB에서 장바구니 불러오기
  useEffect(() => {
    if (loginMember?.m_email) {
      getCartByEmail(loginMember.m_email).then((cart) => {
        setCartItems(cart.items || []);
      });
    }
  }, [loginMember]);

  // 1. 장바구니 담기 (CartItem만 merge)
  const handleAddToCart = async (productId, count = 1) => {
    if (!loginMember?.m_email) return;

    try {
      // ✅ addToCart API는 이제 CartItem 하나만 반환
      const newItem = await addToCart({
        c_email: loginMember.m_email,
        c_productId: productId,
        c_count: count,
      });

      setCartItems((prevItems) => {
        const existing = prevItems.find((i) => i.c_productId === newItem.c_productId);
        if (existing) {
          // 기존 상품 수량 증가
          return prevItems.map((i) =>
            i.c_productId === newItem.c_productId
              ? { ...i, c_count: i.c_count + count }
              : i
          );
        } else {
          // 새 상품 추가
          return [...prevItems, newItem];
        }
      });
    } catch (err) {
      console.error("❌ addToCart 실패:", err);
    }
  };

  // 2. 단일 삭제
  const handleRemoveItem = async (ci_no) => {
    try {
      await removeCartItem(ci_no, loginMember.m_email);
      setCartItems((prev) => prev.filter((item) => item.ci_no !== ci_no));
    } catch (err) {
      console.error("❌ removeCartItem 실패:", err);
    }
  };

  // 3. 전체 삭제
  const handleClearCart = async () => {
    try {
      await clearCartByEmail(loginMember.m_email);
      setCartItems([]);
    } catch (err) {
      console.error("❌ clearCart 실패:", err);
    }
  };

  // 장바구니 버튼 클릭 수량 변경
  const handleChangeCount = async (item, delta) => {
  const newCount = item.c_count + delta;
  if (newCount < 1) return; // ✅ 0 이하 방어
  try {
    await updateCartCount(item.c_no, item.c_productId, delta);
    setCartItems((prev) =>
      prev.map((i) =>
        i.ci_no === item.ci_no ? { ...i, c_count: i.c_count + delta } : i
      )
    );
  } catch (err) {
    console.error("❌ changeCount 실패:", err);
  }
};

  
  return (
    <CartContext.Provider
      value={{
        cartItems,
        handleAddToCart,
        handleRemoveItem,
        handleClearCart,
        handleChangeCount,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);