import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { getProductsByCategory } from "../service/productsDB"; // js 불러오기

const Categories = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const category = query.get("name");   // URL 파라미터
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsByCategory(category); // js 함수 호출
        setProducts(data);
      } catch (err) {
        console.error("카테고리별 상품 조회 실패:", err);
      }
    };
    fetchProducts();
  }, [category]);

  return (
    <div>
      <h2>{category} 상품 목록</h2>
      <Row>
        {Array.isArray(products) && products.length > 0 ? (
          products.map((p) => (
            <Col key={p.p_productId} md={4} className="mb-4">
              <Card>
                <Card.Img variant="top" src={p.p_image} />
                <Card.Body>
                  <Card.Title>{p.p_title}</Card.Title>
                  <Card.Text>{p.p_lprice.toLocaleString()}원</Card.Text>
                  <Button variant="primary">장바구니 담기</Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>상품이 없습니다.</p>
        )}
      </Row>
    </div>
  );
};

export default Categories;
