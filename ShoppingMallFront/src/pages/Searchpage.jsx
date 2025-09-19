// src/pages/SearchPage.jsx
import PaginationComponent from "common/PaginationComponent";
import ProductCard from "common/ProductCard";
import SearchBar from "common/SearchBar";
import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { searchProducts } from "service/productsDB";

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const keyword = query.get("keyword") || "";

  // const[products, setProducts] = useState([])
  const[currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = results.slice(startIndex, startIndex + itemsPerPage);
  
  useEffect(() => {
    if(!keyword.trim()){
      setResults([])
      return
    }
    
    const fetchSearch = async() => {
      try {
        const data = await searchProducts(keyword)
        setResults(data)
        setCurrentPage(1)
      } catch (error) {
        console.error("검색 실패", error);
      }
    }
    fetchSearch()
  }, [keyword]);

  const handleBuy = (product) => {
    console.log("결제 요청:", product);
  };

  const handleAddToCart = (product) => {
    console.log("장바구니 담기:", product);
  };

  return (
    <div>
      <SearchBar/>
      <h3
        style={{
          fontSize: "1.4rem",
          fontWeight: "600",
          borderLeft: "4px solid #0d6dfdad",
          paddingLeft: "10px",
          marginBottom: "20px",
          color: "rgba(95, 108, 148, 0.58)",
        }}
      >
        {keyword}
      </h3>

      <Row>
        {Array.isArray(currentItems) && currentItems.length > 0 ? (
        currentItems.map((p) => (
          <Col key={p.productId} md={3} className="mb-4 d-flex justify-content-center">
            <ProductCard 
              product={p}
              onBuy={handleBuy}
              onAddToCart={handleAddToCart}
            />
          </Col>
        ))
          ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </Row>

      <PaginationComponent
        totalItems={results.length}   // ✅ 여기 products.length 말고 results.length
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default SearchPage;
