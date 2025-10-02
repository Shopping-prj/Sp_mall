// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { addToCart, getCartByEmail, removeCartItem, clearCartByEmail, updateCartCount } from "service/cartDB";
import { useAuth } from "context/AuthContext";
import { useNavigate } from "react-router-dom";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartKey, setCartKey] = useState(0);
  const navigate = useNavigate();

  // ✅ 최초 로딩: 로그인 사용자만 DB에서 장바구니 로드
  useEffect(() => {
    if (isLoggedIn) {
      getCartByEmail() // email은 토큰 기반으로 백엔드에서 추출
        .then((cart) => {
          setCartItems((cart.items || []).filter(it => it.ci_no !== null));
        })
        .catch((err) => {
          console.error("❌ 장바구니 불러오기 실패:", err);
        });
    } else {
      setCartItems([]); // 로그인 안 된 상태 → 비워둠
    }
  }, [isLoggedIn, cartKey]);

  // ✅ 로그인 여부 체크 공통 함수
  const requireLogin = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return false;
    }
    return true;
  };

  // ✅ 장바구니 담기
  const handleAddToCart = async (product, count = 1) => {
    if (!requireLogin()) return;
    try {
      const newItem = await addToCart({
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
  };

  // ✅ 단일 삭제
  const handleRemoveItem = async (ci_no) => {
    if (!requireLogin()) return;
    try {
      await removeCartItem(ci_no);
      setCartItems((prev) => prev.filter((item) => item.ci_no !== ci_no));
    } catch (err) {
      console.error("❌ removeCartItem 실패:", err);
    }
  };

  // ✅ 전체 삭제
  const handleClearCart = async () => {
    if (!requireLogin()) return;
    try {
      await clearCartByEmail();
      setCartItems([]);
    } catch (err) {
      console.error("❌ clearCart 실패:", err);
    }
  };

  // ✅ 수량 변경
  const handleChangeCount = async (item, delta) => {
    if (!requireLogin()) return;
    const newCount = item.c_count + delta;
    if (newCount < 1) return;
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

  const handleOrder = () => {
    if (!requireLogin()) return;
    navigate("/shop/payment");
  };

  // ✅ CartContext 전체 리셋
  const resetCart = () => setCartKey((prev) => prev + 1);

  return (
    <CartContext.Provider
      key={cartKey}
      value={{
        cartItems,
        handleAddToCart,
        handleRemoveItem,
        handleClearCart,
        handleChangeCount,
        handleOrder,
        setCartItems,
        resetCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
