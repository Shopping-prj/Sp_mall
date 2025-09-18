import { Card, Button } from "react-bootstrap";

const CartItemCard = ({ item, onIncrease, onDecrease, onRemove }) => {
  return (
    <Card
      style={{
        width: "100%",
        border: "none",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        overflow: "hidden",
        marginBottom: "20px",
      }}
      className="cart-item-card"
    >
      <div className="d-flex">
        {/* 상품 이미지 */}
        <div
          style={{
            width: "120px",
            height: "120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
          }}
        >
          <img
            src={item.p_image}
            alt={item.p_title}
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* 본문 */}
        <Card.Body className="d-flex flex-column justify-content-between">
          {/* 상품명 + 가격 */}
          <div>
            <Card.Title
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                marginBottom: "8px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.p_title}
            </Card.Title>
            <Card.Text
              style={{
                fontSize: "1rem",
                fontWeight: "700",
                color: "#0d6efd",
              }}
            >
              {(item.p_lprice * item.c_count).toLocaleString()}원
            </Card.Text>
          </div>

          {/* 수량 조절 + 삭제 */}
          <div className="d-flex justify-content-between align-items-center mt-2">
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => onDecrease(item)}
              >
                -
              </Button>
              <span>{item.c_count}</span>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => onIncrease(item)}
              >
                +
              </Button>
            </div>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onRemove(item)}
            >
              삭제
            </Button>
          </div>
        </Card.Body>
      </div>
    </Card>
  );
};

export default CartItemCard;
