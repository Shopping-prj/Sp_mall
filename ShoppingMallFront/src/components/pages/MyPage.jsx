import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../include/Header";
import { Link, Navigate, useNavigate } from "react-router-dom";
const MyPage = ({ mp_email }) => {
  const [orders, setOrders] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("주문내역"); // 기본 선택 메뉴
  const navigate = useNavigate()
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/mypage/orders", {
        params: { mp_email },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("주문 조회 실패", err);
    }
  };

  useEffect(() => {
    if (selectedMenu === "주문내역") {
      fetchOrders();
    }
  }, [mp_email, selectedMenu]);

  return (
    <>
      <Header />
      <div className="container mt-4">
        <div className="row">
          {/* 사이드 메뉴 */}
          <div className="col-3">
            <div className="list-group">
              {["주문내역", "배송조회", "회원정보수정"].map((menu) => (
                <button
                  key={menu}
                  className={`list-group-item list-group-item-action ${
                    selectedMenu === menu ? "active" : ""
                  }`}
                  onClick={() => setSelectedMenu(menu)}
                >
                  {menu}
                </button>
              ))}
            </div>
          </div>

          {/* 콘텐츠 영역 */}
          <div className="col-9">
            {selectedMenu === "주문내역" && (
              <>
                <h3>주문내역</h3>
                {orders.length === 0 ? (
                  <p>주문 내역이 없습니다.</p>
                ) : (
                  <div className="row">
                    {orders.map((order, index) => (
                      <div className="col-12 col-md-6 col-lg-4" key={`order-${index}`}>
                        <div className="card my-2">
                          <div className="card-body">
                            <div>회원아이디: {order.mp_email}</div>
                            <div>주문번호: {order.ph_no}</div>
                            <div>주문상태: {order.mp_order}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {selectedMenu === "배송조회" && <p>배송조회 기능은 준비중입니다.</p>}
            {selectedMenu === "회원정보수정" &&           <button 
          className="btn btn-gradient-green"
          onClick={() => navigate("/mypage/userUpdatePage")}
        >
          회원정보 수정으로 이동
        </button>}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyPage