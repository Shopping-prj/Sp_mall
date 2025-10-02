import { useCart } from "context/CartContext";
import { Card, Button } from "react-bootstrap";

const ProductCard = ({ product }) => {
  const { handleAddToCart, handleOrder } = useCart();
  return (
    <Card
      style={{
        width: "280px",
        height: "400px",
        border: "none",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.31)",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      className="product-card"
    >
      {/* 이미지 */}
      <div
        style={{
          height: "220px",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px",
        }}
      >
        <img
          src={product.p_image}
          alt={product.p_title}
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
              color: "rgba(0, 0, 0, 0.62)"
            }}
          >
            {product.p_title}
          </Card.Title>
          <Card.Text
            style={{
              fontSize: "1rem",
              fontWeight: "700",
              color: "#0d6efd",
            }}
          >
            {product.p_lprice.toLocaleString()}원
          </Card.Text>
        </div>
        {/* 버튼 영역 */}
        <div style={{ display: "flex", gap: "8px" }}>
          {/* 결제 버튼 */}
          <Button
            variant="outline-success"
            style={{
              flex: 1,
              height: "42px",
              lineHeight: "42px",   // 텍스트 수직 중앙 보정
              padding: 0,
              fontSize: "15px",
            }}
            onClick={handleOrder} // 부모에서 받은 함수 호출
          >
            주문하기
          </Button>
          {/* 장바구니 버튼 (아이콘만) */}
          <Button
            variant="outline-primary"
            style={{
              width: "42px",
              height: "42px",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "skyblue",
              borderColor: "skyblue"
            }}
            onClick={() => {
            console.log("장바구니 추가 클릭됨:", product.p_productId);
            handleAddToCart(product, 1);
            }} // 부모에서 받은 함수 호출
          >
            <i className="fas fa-shopping-cart" style={{ fontSize: "18px" }} />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
