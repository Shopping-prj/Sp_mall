import React, { useState } from 'react'
import Header from '../include/Header'
import axios from 'axios';

const CartPage = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  // DB에서 장바구니 목록 조회
  const fetchCartItems = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/cart/list", {
        params: { userId },
      });
      setCartItems(res.data);
    } catch (err) {
      console.error("장바구니 조회 실패", err);
    }
  };
  return (
    <>
      <Header />
      <h2>내 장바구니</h2>
      <div className="row">
        {cartItems.length === 0 && (
          <p className="text-center">장바구니가 비어있습니다.</p>
        )}
        {cartItems.map((item, index) => (
          <div className="col-6 col-md-4 col-lg-2" key={`cart-${index}`}>
            <div className="card my-2">
              <div className="card-body text-center">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{ width: "80%", cursor: "pointer" }}
                />
                <div>{item.name}</div>
                <div>{item.quantity}개</div>
              </div>
              <div className="card-footer text-center">{item.price}원</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default CartPage