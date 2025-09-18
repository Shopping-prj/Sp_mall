import { Card, Button } from "react-bootstrap";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { red } from "@mui/material/colors";

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
            <div
              className="d-flex align-items-center"
              style={{ gap: "12px" }}
            >
              <Button
                style={{
                  border: "1px solid #ddd",
                  backgroundColor: "#f8f9fa",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                }}
                onClick={() => onDecrease(item)}
                disabled={item.c_count <= 1}
              >
                <RemoveIcon fontSize="small" />
              </Button>

              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  minWidth: "32px",
                  textAlign: "center",
                }}
              >
                {item.c_count}
              </span>

              <Button
                style={{
                  border: "1px solid #ddd",
                  backgroundColor: "#f8f9fa",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                }}
                onClick={() => onIncrease(item)}
              >
                <AddIcon fontSize="small" />
              </Button>
            </div>

            <Button 
              style={{
                borderRadius: "10px",
                color: "#ec5a5aff",
                fontSize: "1rem",
                borderColor: "#ec5a5aff",
                fontWeight: "bold"
              }}
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
