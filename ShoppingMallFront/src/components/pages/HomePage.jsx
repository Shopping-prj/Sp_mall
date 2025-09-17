import React, { useEffect, useState } from 'react'
import Header from '../include/Header'
import Footer from '../include/Footer'
import axios from 'axios';

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState(""); // 검색어
  const [category, setCategory] = useState(""); // 선택된 카테고리
  const [selectedCategory, setSelectedCategory] = useState("");
  useEffect(() => {
  shopList(); // shopList 내부에서 selectedCategory 기준 필터 적용
  }, [selectedCategory]);
  // SpringBoot에서 전체 상품 가져오기
  const shopList = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_SPRING_IP}/api/products`);

      // 카테고리 필터링
      let filtered = res.data;
      if (category) {
        filtered = filtered.filter(item => item.p_category1 === category);
      }

      // 검색어 필터링
      if (query) {
        filtered = filtered.filter(item =>
          item.p_title.toLowerCase().includes(query.toLowerCase())
        );
      }

      setItems(filtered);
    } catch (error) {
      console.error("상품 조회 실패", error);
    }
  };

  // 최초 렌더링 + query/카테고리 변경 시 실행
  useEffect(() => {
    shopList();
  }, [query, category]);

  const shopSearch = () => {
    const val = document.querySelector("#query").value;
    setQuery(val);
  };

  return (
    <>
      <Header setSelectedCategory={setSelectedCategory}/>
      {/* 검색 바 */}
      <div className="row mt-5 justify-content-end">
        <div className="col-6 col-md-4">
          <form name="frm" onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
              <input type="text" id="query" className="form-control" />
              <button type="button" onClick={shopSearch} className="btn btn-success">
                검색
              </button>
            </div>
          </form>
        </div>
      </div>

      <hr />

      {/* 상품 리스트 */}
      <div className="row">
        {items.map((item, index) => (
          <div className="col-6 col-md-4 col-lg-2" key={index}>
            <div className="card my-2">
              <div className="card-body text-center">
                <img
                  src={item.p_image}
                  alt="상품이미지"
                  style={{ cursor: "pointer", width: "80%" }}
                />
                <div className="ellipsis mt-2">{item.p_title}</div>
                <div style={{ fontSize: "0.8rem", color: "#555" }}>
                  {item.p_brand} / {item.p_maker}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#888" }}>
                  {item.p_category1}
                </div>
              </div>
              <div className="card-footer text-center" style={{ fontSize: "0.9rem" }}>
                {item.p_lprice}원
                <span
                  className="cart ms-3"
                  style={{ cursor: "pointer", color: "green" }}
                >
                  CART
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </>
  )
}

export default HomePage;