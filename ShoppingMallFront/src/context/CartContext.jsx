import { createContext, useContext, useState, useEffect } from "react";
import {
  addToCart,
  getCartByEmail,
  updateCartCount,
  removeCartItem,
  clearCartByEmail,
} from "service/cartDB";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState(null);

  // ✅ 비회원: localStorage에서 불러오기
  useEffect(() => {
    if (!isLoggedIn) {
      const saved = localStorage.getItem("guest_cart");
      if (saved) setCartItems(JSON.parse(saved));
    }
  }, [isLoggedIn]);

  // ✅ 비회원: cartItems 변경 시 localStorage에 저장
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem("guest_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoggedIn]);

  // ✅ 회원: 로그인 시 DB에서 불러오기
  const loadCart = async (userEmail) => {
    if (userEmail) {
      const data = await getCartByEmail(userEmail);
      setCartItems(data);
    }
  };

  const addItem = async (product) => {
    if (isLoggedIn) {
      await addToCart({
        c_email: email,
        c_productId: product.p_productId,
        c_count: 1,
        c_payment: 0,
      });
      loadCart(email);
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
          { ...product, c_count: 1, c_no: Date.now() }, // 비회원은 임시 key
        ]);
      }
    }
  };

  const changeCount = async (item, count) => {
    if (isLoggedIn) {
      await updateCartCount(item.c_no, count);
      await loadCart(email);
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
      await removeCartItem(item.c_no);
      await loadCart(email);
    } else {
      setCartItems(cartItems.filter((i) => i.p_productId !== item.p_productId));
    }
  };

  const clearCart = async () => {
    if (isLoggedIn) {
      await clearCartByEmail(email);
      setCartItems([]);
    } else {
      setCartItems([]);
      localStorage.removeItem("guest_cart");
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
