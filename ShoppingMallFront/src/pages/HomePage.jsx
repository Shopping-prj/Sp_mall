import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { categories } from "common/categoriesData";
import { getProductsByCategory } from "service/productsDB";
import ProductCard from "common/ProductCard";
import SearchBar from "common/SearchBar";

const HomePage = () => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.all(
          categories.map((c) =>
            getProductsByCategory(c.key).then((res) => [c.key, res.slice(0, 5)])
          )
        );
        const data = Object.fromEntries(results);
        setProductsByCategory(data);
      } catch (error) {
        console.error("상품 불러오기 실패", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`search?keyword=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="homepage">
      {/* 배너 */}
      <div
        style={{
          /* backgroundImage: "url(https://via.placeholder.com/1200x250)", */
          backgroundSize: "cover",
          borderRadius: "10px",
          height: "250px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#979eaaff ",
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        쇼핑몰에 오신 것을 환영합니다!
      </div>

      {/* 검색창 */}
      <SearchBar/>

      {/* 카테고리별 최신 4개 상품 */}
      {categories.map((c) => {
        const items = productsByCategory[c.key] || [];
        const visibleItems = items.slice(0, 4); // 항상 4개만
        if (visibleItems.length === 0) return null;
        return (
          <div key={c.key} style={{
            marginBottom: "40px",
            paddingTop: "20px",
            borderBottom: "1px solid #90acc7ff",
            }}
            >
            <h3 
            style={{ 
              fontSize: "1.4rem",
              fontWeight: "600",
              borderLeft: "4px solid #0d6dfdad",
              paddingLeft: "10px",
              marginBottom: "20px",
              color: "rgba(20, 37, 87, 0.58)"
            }}
            >
              {c.name}
            </h3>
            <Row className="justify-content-center">
              {visibleItems.map((p) => (
                <Col key={p.p_productId} md={3} className="mb-4 d-flex justify-content-center">
                  <ProductCard product={p} />
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
