import React from "react";
import { useCart } from "context/CartContext";
import CartItemCard from "common/CartItemCard";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const CartPage = () => {
  const { cartItems, handleChangeCount, handleRemoveItem, handleClearCart, handleOrder } = useCart();

  const totalPrice = cartItems.reduce((sum, item) => sum + item.p_lprice * item.c_count, 0);
  const shipping = totalPrice > 50000 ? 0 : 2500;
  const finalPrice = totalPrice + shipping;

  return (
    <Container className="mt-4">
      <h2 style={{ fontSize: "1.4rem", fontWeight: "600", borderLeft: "4px solid #0d6dfdad", paddingLeft: "10px", marginBottom: "20px", color: "rgba(20, 37, 87, 0.58)" }}>
        장바구니
      </h2>

      <Row className="flex-wrap">
        <Col md={8}>
          {cartItems.length > 0 ? (
            cartItems.map(item => (
              <CartItemCard
              key={item.ci_no ? `ci-${item.ci_no}` : `p-${item.p_productId}`}
              item={item}
              changeCount={handleChangeCount}
              onRemove={handleRemoveItem}
            />
            ))
          ) : (
            <p>장바구니가 비어 있습니다.</p>
          )}
        </Col>

        <Col>
          <Card style={{ width: "300px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
            <Card.Body>
              <h5>주문 요약</h5>
              <p>상품가격: {totalPrice.toLocaleString()}원</p>
              <p>배송비: {shipping.toLocaleString()}원</p>
              <h5>결제금액: {finalPrice.toLocaleString()}원</h5>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", gap: "12px" }}>
                <Button style={{ borderRadius: "10px", color: "#ec5a5aff", borderColor: "#ec5a5aff", minWidth: "120px", height: "42px", fontSize: "15px", fontWeight: "500" }} variant="outline" onClick={handleClearCart}>
                  전체 비우기
                </Button>
                <Button 
                  style={{ 
                    borderRadius: "10px", 
                    borderColor: "#0d6efd", 
                    minWidth: "120px", 
                    height: "42px", 
                    fontSize: "15px", 
                    fontWeight: "500" 
                  }} 
                    variant="primary"
                    onClick={handleOrder}
                    >
                  주문하기
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
