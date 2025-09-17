import React from 'react'
import { useParams } from 'react-router-dom';
import Header from '../include/Header';

const CategoryDetail = () => {
  const { cat, id } = useParams();
  return (
    <>
      <Header />
      <h3>{cat} 카테고리 - 상품 상세 {id}</h3>
    </>
  );
};
export default CategoryDetail