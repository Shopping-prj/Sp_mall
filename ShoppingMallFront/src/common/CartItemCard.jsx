import { Card, Button, FormControl } from "react-bootstrap";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const CartItemCard = ({ item, changeCount, onRemove }) => {
  return (
    <Card
      style={{
        width: "740px",
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
            <div className="d-flex align-items-center" style={{ gap: "12px" }}>
              {/* - 버튼 */}
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
                onClick={() => changeCount(item, item.c_count - 1)}
                disabled={item.c_count <= 1}
              >
                <RemoveIcon fontSize="small" />
              </Button>

              {/* 직접 입력 */}
              <FormControl
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={item.c_count}
                onChange={(e) => {
                  const onlyNum = e.target.value.replace(/[^0-9]/g, "");
                  if (onlyNum === "") return;
                  const parsed = parseInt(onlyNum, 10);
                  if (!isNaN(parsed) && parsed > 0) {
                    changeCount(item, parsed);
                  }
                }}
                style={{
                  width: "60px",
                  textAlign: "center",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                }}
              />

              {/* + 버튼 */}
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
                onClick={() => changeCount(item, item.c_count + 1)}
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
                fontWeight: "bold",
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
