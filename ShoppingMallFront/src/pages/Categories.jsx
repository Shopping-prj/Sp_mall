import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { getProductsByCategory } from "../service/productsDB";
import PaginationComponent from "common/PaginationComponent";
import ProductCard from "common/ProductCard";
import SearchBar from "common/SearchBar";

const Categories = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const category = query.get("name");

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsByCategory(category);
        setProducts(data);
        setCurrentPage(1);
      } catch (err) {
        console.error("카테고리별 상품 조회 실패:", err);
      }
    };
    fetchProducts();
  }, [category]);

  // 현재 페이지 데이터 계산
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = products.slice(startIndex, startIndex + itemsPerPage);

  // 부모에서 제어하는 이벤트 핸들러
  const handleBuy = (product) => {
    console.log("결제 요청:", product);
    // 결제 로직 추가
  };

  const handleAddToCart = (product) => {
    console.log("장바구니 담기:", product);
    // 장바구니 로직 추가
  };

  return (
    <div>
      <SearchBar/>
      <h2
        style={{
          fontSize: "1.4rem",
          fontWeight: "600",
          borderLeft: "4px solid #0d6dfdad",
          paddingLeft: "10px",
          marginBottom: "20px",
          color: "rgba(95, 108, 148, 0.58)",
        }}
      >
        {category}
      </h2>
      <Row>
        {Array.isArray(currentItems) && currentItems.length > 0 ? (
          currentItems.map((p) => (
            <Col key={p.p_productId} md={3} className="mb-4" style={{borderBottom: "1px solid #9eb9d3ff",}}>
              <ProductCard
                product={p}
                onBuy={handleBuy}
                onAddToCart={handleAddToCart}
              />
            </Col>
          ))
        ) : (
          <p>상품이 없습니다.</p>
        )}
      </Row>

      <PaginationComponent
        totalItems={products.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Categories;
