// src/pages/Category.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";

const Categories = () => {
  const { categoryName } = useParams(); // ex) men, women, shoes
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // 카테고리별 상품 불러오기 (가짜 API 예시)
    fetch(`/api/products?category=${categoryName}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [categoryName]);

  return (
    <div>
      <h2>{categoryName} 상품 목록</h2>
      <Row>
        {products.map((p) => (
          <Col key={p.id} md={4} className="mb-4">
            <Card>
              <Card.Img variant="top" src={p.img} />
              <Card.Body>
                <Card.Title>{p.name}</Card.Title>
                <Card.Text>{p.price.toLocaleString()}원</Card.Text>
                <Button variant="primary">장바구니 담기</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Categories