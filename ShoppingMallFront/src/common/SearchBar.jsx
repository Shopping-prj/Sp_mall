// src/common/SearchBar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, InputGroup, Button } from "react-bootstrap";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/shop/search?keyword=${encodeURIComponent(searchTerm)}`);
    setSearchTerm("");
  };

  return (
    <Form
      className="mb-4 d-flex justify-content-center"
      onSubmit={handleSubmit}
    >
      <div style={{ width: "1200px" }}> {/* 상품카드 4개 폭과 맞춤 */}
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="상품명을 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ height: "46px" }}   // 높이 통일
          />
          <Button 
            type="submit" 
            variant="primary"
            style={{ height: "46px" }}   // 버튼도 같은 높이
          >
            <i className="fas fa-search" />
          </Button>
        </InputGroup>
      </div>
    </Form>
  );
};

export default SearchBar;
