// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { addToCart, getCartByEmail, removeCartItem, clearCartByEmail, updateCartCount } from "service/cartDB";
import { useAuth } from "context/AuthContext";
import { useNavigate } from "react-router-dom";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { loginMember } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartKey, setCartKey] = useState(0); // 🔑 강제 리마운트 트리거
  const navigate = useNavigate()

  // ✅ 최초 로딩: 회원 → DB, 비회원 → localStorage
  useEffect(() => {
    if (loginMember?.m_email) {
      getCartByEmail(loginMember.m_email).then((cart) => {
        setCartItems(cart.items || []);
      });
    } else {
      const local = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setCartItems(local);
    }
  }, [loginMember, cartKey]); // cartKey 추가 → 리셋 시 강제 실행

  // ✅ 장바구니 담기
  const handleAddToCart = async (product, count = 1) => {
    if (loginMember?.m_email) {
      try {
        const newItem = await addToCart({
          c_email: loginMember.m_email,
          c_productId: product.p_productId,
          c_count: count,
        });
        
        setCartItems((prevItems) => {
          const existing = prevItems.find((i) => i.c_productId === newItem.c_productId);
          return existing
            ? prevItems.map((i) =>
                i.c_productId === newItem.c_productId
                  ? { ...i, c_count: i.c_count + count }
                  : i
              )
            : [...prevItems, newItem];
        });
      } catch (err) {
        console.error("❌ addToCart 실패:", err);
      }
    } else {
      const local = JSON.parse(localStorage.getItem("cartItems") || "[]");
      const idx = local.findIndex((i) => i.p_productId === product.p_productId);

      if (idx >= 0) {
        local[idx].c_count += count;
      } else {
        local.push({
          p_productId: product.p_productId,
          p_title: product.p_title,
          p_image: product.p_image,
          p_lprice: product.p_lprice,
          c_count: count,
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(local));
      setCartItems(local);
    }
  };

  // ✅ 단일 삭제
  const handleRemoveItem = async (ci_no, p_productId) => {
    if (loginMember?.m_email) {
      try {
        await removeCartItem(ci_no, loginMember.m_email);
        setCartItems((prev) => prev.filter((item) => item.ci_no !== ci_no));
      } catch (err) {
        console.error("❌ removeCartItem 실패:", err);
      }
    } else {
      const local = JSON.parse(localStorage.getItem("cartItems") || "[]");
      const filtered = local.filter((item) => item.p_productId !== p_productId);
      localStorage.setItem("cartItems", JSON.stringify(filtered));
      setCartItems(filtered);
    }
  };

  // ✅ 전체 삭제
  const handleClearCart = async () => {
    if (loginMember?.m_email) {
      try {
        await clearCartByEmail(loginMember.m_email);
        setCartItems([]);
      } catch (err) {
        console.error("❌ clearCart 실패:", err);
      }
    } else {
      localStorage.removeItem("cartItems");
      setCartItems([]);
    }
  };

  // ✅ 수량 변경
  const handleChangeCount = async (item, delta) => {
    const newCount = item.c_count + delta;
    if (newCount < 1) return;

    if (loginMember?.m_email) {
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
    } else {
      const local = JSON.parse(localStorage.getItem("cartItems") || "[]");
      const updated = local.map((i) =>
        i.p_productId === item.p_productId ? { ...i, c_count: newCount } : i
      );
      localStorage.setItem("cartItems", JSON.stringify(updated));
      setCartItems(updated);
    }
  };

  const handleOrder = () => navigate("shop/payment")

  // ✅ CartContext 전체 리셋 (외부에서 호출 가능)
  const resetCart = () => setCartKey((prev) => prev + 1);

  return (
    <CartContext.Provider
      key={cartKey} // 🔑 리마운트 트리거
      value={{
        cartItems,
        handleAddToCart,
        handleRemoveItem,
        handleClearCart,
        handleChangeCount,
        handleOrder,
        setCartItems,
        resetCart, // 🔑 외부에서 강제로 리셋할 수 있음
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
