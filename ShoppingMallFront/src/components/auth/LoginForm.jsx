import { Link, useNavigate } from 'react-router-dom';
import '../style/MainBoard.css';
import '../style/LoginForm.css';
import { useState } from 'react';
import { FaGoogle } from "react-icons/fa";

const KakaoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="#3C1E1E" d="M12 2C6.48 2 2 5.92 2 10.5c0 2.73 1.79 5.13 4.56 6.5v3.16l3.05-1.68c.8.22 1.63.34 2.39.34 5.52 0 10-3.92 10-8.5S17.52 2 12 2z"/>
  </svg>
);

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    password: ''
  });

  const changeUser = (e) => {
    const id = e.currentTarget.id;
    const value = e.target.value;
    setUser({ ...user, [id]: value });
  };

  const handleLogin = () => {
    const storedUsers = JSON.parse(localStorage.getItem("localUsers")) || [];
    const foundUser = storedUsers.find(
      (u) => u.id === user.username && u.passwd === user.password
    );

    if (foundUser) {
      localStorage.setItem('email', foundUser.email || '');
      localStorage.setItem('username', foundUser.id); // id 사용
      localStorage.setItem('role', foundUser.role || 'user');
      localStorage.setItem('isLoggedIn', 'true');
      onLogin && onLogin();
      navigate("/home");
      navigate("/admin/member", { replace: true });
    } else {
      alert("아이디 또는 비밀번호가 잘못되었습니다.");
    }
  };

  return (
    <>
      <div className="box">
        <div className="form-row">
          <label htmlFor="username">아이디 :</label>
          <input type="text" id="username" onChange={changeUser} />
        </div>
        <div className="form-row">
          <label htmlFor="password">비밀번호 :</label>
          <input type="password" id="password" onChange={changeUser} />
        </div>
        <button className="btn-default" onClick={handleLogin}>로그인</button>
        <Link to="/localSignup" className="btn-join">회원가입</Link>
        <div className="login-methods-container">
          <button className="btn-google" onClick={() => window.location.href = 'http://localhost:8000/oauth2/authorization/google'}>
            <FaGoogle /> 구글 로그인
          </button>
          <button className="btn-kakao" onClick={() => window.location.href = 'http://localhost:8000/oauth2/authorization/kakao'}>
            <KakaoIcon /> 카카오 로그인
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginForm;