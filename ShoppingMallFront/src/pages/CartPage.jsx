import { useCart } from "context/CartContext";
import CartItemCard from "common/CartItemCard";
import { Container, Button } from "react-bootstrap";

const CartPage = () => {
  const { cartItems, changeCount, removeItem, clearCart } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.p_lprice * item.c_count,
    0
  );

  return (
    <Container style={{ marginTop: "30px" }}>
      <h3 style={{ marginBottom: "20px" }}>장바구니</h3>
      {cartItems.length === 0 ? (
        <p>장바구니가 비어 있습니다.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <CartItemCard
              key={item.c_no || item.p_productId}
              item={item}
              onIncrease={() =>
                changeCount(item.c_no || item.p_productId, item.c_count + 1)
              }
              onDecrease={() =>
                changeCount(item.c_no || item.p_productId, item.c_count - 1)
              }
              onRemove={() => removeItem(item.c_no || item.p_productId)}
            />
          ))}
          <h5 style={{ marginTop: "20px" }}>
            총합: {total.toLocaleString()}원
          </h5>
          <div className="d-flex gap-2 mt-3">
            <Button variant="secondary" onClick={clearCart}>
              전체 비우기
            </Button>
            <Button variant="success">결제하기</Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default CartPage;
