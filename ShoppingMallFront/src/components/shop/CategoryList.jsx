import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import Header from '../include/Header'
import Footer from '../include/Footer';
import HomePage from '../pages/HomePage';

const CategoryList = () => {
  return (
    <>
      <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:cat" element={<CategoryList />} />
          </Routes>
      <Footer />
    </>
  );
}

export default CategoryList