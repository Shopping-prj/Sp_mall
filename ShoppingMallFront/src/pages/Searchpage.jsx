// src/pages/SearchPage.jsx
import { categories } from "contants/categories";
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const SearchPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [results, setResults] = useState([]);
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const keyword = query.get("keyword") || "";

useEffect(() => {
  const mockProducts = [];
  categories.forEach((c) => {
    for (let i = 1; i <= 20; i++) {
      mockProducts.push({
        id: `${c.key}-${i}`,
        name: `${c.name} 상품 ${i}`,
        price: i * 1000,
        img: "https://via.placeholder.com/200",
      });
    }
  });
  setAllProducts(mockProducts);
}, []);

  useEffect(() => {
    if (keyword.trim() === "") {
      setResults([]);
      return;
    }
    const filtered = allProducts.filter((p) =>
      p.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setResults(filtered);
  }, [keyword, allProducts]);

  return (
    <div className="search-page">
      <h3>검색 결과: "{keyword}"</h3>
      <Row>
        {results.map((p) => (
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
        {results.length === 0 && keyword.trim() !== "" && (
          <p>검색 결과가 없습니다.</p>
        )}
      </Row>
    </div>
  );
};

export default SearchPage;
