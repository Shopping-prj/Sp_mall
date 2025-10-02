import React from "react";
import { FaShoppingCart, FaMoneyBillWave, FaTruck, FaBan } from "react-icons/fa";

export default function Dashboard() {
  // 실제 데이터는 props 또는 API 연동으로 받아올 수 있음
  const stats = {
    totalOrders: 8,
    totalPayment: 1568200,
    completed: 1,
    cancelled: 7,
  };

  return (
    <div className="container-fluid py-3">
      <h3 className="fw-bold mb-4">관리자 메인 대시보드</h3>

      {/* 📊 KPI 카드 */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="d-flex align-items-center p-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 60, height: 60, backgroundColor: "#eaf3ff" }}
              >
                <FaShoppingCart size={28} className="text-primary" />
              </div>
              <div className="ms-3">
                <h4 className="mb-0 fw-bold">{stats.totalOrders}</h4>
                <small className="text-muted">총 주문건수</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="d-flex align-items-center p-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 60, height: 60, backgroundColor: "#e6f7ef" }}
              >
                <FaMoneyBillWave size={28} className="text-success" />
              </div>
              <div className="ms-3">
                <h4 className="mb-0 fw-bold">
                  {stats.totalPayment.toLocaleString()}원
                </h4>
                <small className="text-muted">총 주문액</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="d-flex align-items-center p-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 60, height: 60, backgroundColor: "#e8f5ff" }}
              >
                <FaTruck size={28} className="text-info" />
              </div>
              <div className="ms-3">
                <h4 className="mb-0 fw-bold">{stats.completed}</h4>
                <small className="text-muted">배송완료</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="d-flex align-items-center p-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 60, height: 60, backgroundColor: "#ffeaea" }}
              >
                <FaBan size={28} className="text-danger" />
              </div>
              <div className="ms-3">
                <h4 className="mb-0 fw-bold">{stats.cancelled}</h4>
                <small className="text-muted">취소</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📦 최근 주문내역 */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">최근 주문내역</div>
        <div className="card-body">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>주문번호</th>
                <th>주문자명</th>
                <th>전화번호</th>
                <th>결제방법</th>
                <th>총주문액</th>
                <th>주문일시</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-primary fw-semibold">25090411260805</td>
                <td>관리자</td>
                <td>010-0000-0000</td>
                <td>포인트</td>
                <td>0</td>
                <td>2025-09-04 11:26</td>
              </tr>
              <tr>
                <td className="text-primary fw-semibold">25072214510065</td>
                <td>관리자</td>
                <td>010-0000-0000</td>
                <td>무통장</td>
                <td>35,000</td>
                <td>2025-07-22 14:52</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 👥 최근 회원가입 */}
      <div className="card">
        <div className="card-header fw-semibold">최근 회원가입</div>
        <div className="card-body">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>이름</th>
                <th>아이디</th>
                <th>이메일</th>
                <th>등급</th>
                <th>가입일</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>가명철물</td>
                <td>submall</td>
                <td>spmallnara@naver.com</td>
                <td>가맹점</td>
                <td>2024-12-16</td>
              </tr>
              <tr>
                <td>세글관</td>
                <td>test3</td>
                <td>test3@gmail.com</td>
                <td>일반회원</td>
                <td>2020-10-04</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}