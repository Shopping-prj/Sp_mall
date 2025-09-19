import { useCart } from "context/CartContext";
import CartItemCard from "common/CartItemCard";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const CartPage = () => {
  const { cartItems, changeCount, removeItem, clearCart } = useCart();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.p_lprice * item.c_count,
    0
  );
  const shipping = totalPrice > 50000 ? 0 : 2500; 
  const finalPrice = totalPrice + shipping;

  return (
    <Container className="mt-4">
      <h2
        style={{
          fontSize: "1.4rem",
          fontWeight: "600",
          borderLeft: "4px solid #0d6dfdad",
          paddingLeft: "10px",
          marginBottom: "20px",
          color: "rgba(20, 37, 87, 0.58)",
        }}
      >
        장바구니
      </h2>

      <Row className="flex-wrap">
        <Col md={8}>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <CartItemCard
                key={item.c_no || item.p_productId}
                item={item}
                changeCount={changeCount}
                onRemove={removeItem}
              />
            ))
          ) : (
            <p>장바구니가 비어 있습니다.</p>
          )}
        </Col>

        {/* 합계 카드 */}
        <Col>
          <Card style={{ width: "300px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
            <Card.Body>
              <h5>주문 요약</h5>
              <p>상품가격: {totalPrice.toLocaleString()}원</p>
              <p>배송비: {shipping.toLocaleString()}원</p>
              <h5>결제금액: {finalPrice.toLocaleString()}원</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                  gap: "12px",
                }}
              >
                <Button
                  style={{
                    borderRadius: "10px",
                    color: "#ec5a5aff",
                    borderColor: "#ec5a5aff",
                    minWidth: "120px",
                    height: "42px",
                    fontSize: "15px",
                    fontWeight: "500",
                  }}
                  variant="outline"
                  onClick={clearCart}
                >
                  전체 비우기
                </Button>

                <Button
                  style={{
                    borderRadius: "10px",
                    borderColor: "#0d6efd",
                    minWidth: "120px",
                    height: "42px",
                    fontSize: "15px",
                    fontWeight: "500",
                  }}
                  variant="primary"
                >
                  결제하기
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
