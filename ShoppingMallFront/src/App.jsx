import {BrowserRouter , Route, Routes } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles.css'
import CartPage from "./components/pages/CartPage";
import MyPage from "./components/pages/MyPage";
import UserUpdatePage from "./components/pages/UserUpdatePage";
import BoardPage from "./components/pages/BoardPage";
import LoginView from "./components/auth/LoginView";
import Members from "./components/pages/Join";

const App= () => {
  return (
    <>
      <BrowserRouter>
        <div className="container">
          <Routes>
            <Route path="/" element={<LoginView />} />
            <Route path="/api/members/join" element={<Members />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/board" element={<BoardPage />} />
            <Route path="/mypage/cart" element={<CartPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/mypage/userupdatepage" element={<UserUpdatePage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}
export default App
