import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ShopNavbar from "components/include/ShopNavbar";

const JoinPage = () => {
  const [form, setForm] = useState({
    m_email: "",
    m_password: "",
    m_name: "",
    m_address: "",
    m_class: "USER",
    m_social: "LOCAL",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_SPRING_IP}/api/members/join`, form);
      alert("회원가입 완료. 로그인해주세요.");
      navigate("/login");  // ✅ 장바구니도 이미 DB에 생성된 상태
    } catch (err) {
      console.error(err);
      alert("회원가입 실패하였습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
    <ShopNavbar />
      <div className="container mt-5">
        <h3>회원가입</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>이메일</label>
            <input type="email" name="m_email" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>비밀번호</label>
            <input type="password" name="m_password" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>이름</label>
            <input type="text" name="m_name" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>주소</label>
            <input type="text" name="m_address" className="form-control" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary">가입</button>
        </form>
      </div>
    </>
  );
};

export default JoinPage;
