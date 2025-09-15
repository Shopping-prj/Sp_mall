// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {categories} from "contants/categories"

const HomePage = () => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 더미 데이터 생성 → DB 연결 시 API로 교체
    const mockData = {};
    categories.forEach((c) => {
      mockData[c.key] = Array.from({ length: 20 }, (_, i) => ({
        id: `${c.key}-${i + 1}`,
        name: `${c.name} 상품 ${i + 1}`,
        price: (i + 1) * 1000,
        img: "https://via.placeholder.com/200",
      }));
    });
    setProductsByCategory(mockData);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/search?keyword=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="homepage">
      {/* 배너 */}
      <div
        style={{
          backgroundImage: "url(https://via.placeholder.com/1200x250)",
          backgroundSize: "cover",
          borderRadius: "10px",
          height: "250px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "black",
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        쇼핑몰에 오신 것을 환영합니다!
      </div>

      {/* 검색창 */}
      <Form className="mb-4" onSubmit={handleSubmit}>
        <Form.Control
          type="text"
          placeholder="상품명을 입력하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>

      {/* 카테고리별 최신 5개 상품 */}
      {categories.map((c) => {
        const items = productsByCategory[c.key] || [];
        const visibleItems = items.slice(0, 5); // 최신 5개만

        if (visibleItems.length === 0) return null;

        return (
          <div key={c.key} style={{ marginBottom: "40px" }}>
            <h3 style={{ marginBottom: "20px" }}>{c.name}</h3>
            <Row>
              {visibleItems.map((p) => (
                <Col key={p.id} md={2} className="mb-4">
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
      })}
    </div>
  );
};

export default HomePage;
