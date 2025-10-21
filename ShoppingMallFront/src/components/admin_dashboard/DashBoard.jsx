import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaMoneyBillWave, FaTruck, FaBan } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const API_BASE = (process.env.REACT_APP_SPRING_IP || "/proxy").replace(/\/$/, "");
const token = localStorage.getItem("accessToken");

export default function Dashboard() {
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalPayment: 0,
    completed: 0,
    cancelled: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentMembers, setRecentMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // 📦 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1️⃣ 요약 통계
        const res1 = await fetch(`${API_BASE}/api/admin/orders/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const summaryData = res1.ok ? await res1.json() : {};

        // 2️⃣ 최근 주문 5건
        const res2 = await fetch(`${API_BASE}/api/admin/orders/recent`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const orderData = res2.ok ? await res2.json() : [];

        // 3️⃣ 최근 회원가입 5명
        const res3 = await fetch(`${API_BASE}/api/admin/members/recent`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const memberData = res3.ok ? await res3.json() : [];

        setSummary(summaryData);
        setRecentOrders(orderData);
        setRecentMembers(memberData);
      } catch (e) {
        console.error("📛 대시보드 데이터 로드 실패:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <div className="mt-3">대시보드 데이터를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      <h3 className="fw-bold mb-4">관리자 메인 대시보드</h3>

      {/* 📊 KPI 카드 */}
      <div className="row g-3 mb-4">
        <KpiCard
          icon={<FaShoppingCart size={28} className="text-primary" />}
          label="총 주문건수"
          value={summary.totalOrders}
          bg="#eaf3ff"
        />
        <KpiCard
          icon={<FaMoneyBillWave size={28} className="text-success" />}
          label="총 주문액"
          value={`${summary.totalPayment?.toLocaleString() || 0}원`}
          bg="#e6f7ef"
        />
        <KpiCard
          icon={<FaTruck size={28} className="text-info" />}
          label="배송완료"
          value={summary.completed}
          bg="#e8f5ff"
        />
        <KpiCard
          icon={<FaBan size={28} className="text-danger" />}
          label="취소"
          value={summary.cancelled}
          bg="#ffeaea"
        />
      </div>

      {/* 📦 최근 주문내역 */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">최근 주문내역</div>
        <div className="card-body">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>주문번호</th>
                <th>주문자 이메일</th>
                <th>상품명</th>
                <th>총주문액</th>
                <th>주문일시</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-muted py-3">
                    최근 주문이 없습니다.
                  </td>
                </tr>
              ) : (
                recentOrders.map((o) => (
                  <tr key={o.o_no}>
                    <td className="text-primary fw-semibold">{o.o_no}</td>
                    <td>{o.o_email}</td>
                    <td title={o.productTitle}>{o.productTitle || "-"}</td>
                    <td>{Number(o.o_amount || 0).toLocaleString()}</td>
                    <td>
                      {new Date(o.o_created_at).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
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
                <th>이메일</th>
                <th>가입방식</th>
                <th>등급</th>
                <th>가입일</th>
              </tr>
            </thead>
            <tbody>
              {recentMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-muted py-3">
                    최근 가입한 회원이 없습니다.
                  </td>
                </tr>
              ) : (
                recentMembers.map((m) => (
                  <tr key={m.m_no}>
                    <td>{m.m_name || "-"}</td>
                    <td>{m.m_email}</td>
                    <td>{m.m_social || "-"}</td>
                    <td>{m.m_class}</td>
                    <td>
                      {new Date(m.m_created).toLocaleDateString("ko-KR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 🔹 KPI 카드 컴포넌트
function KpiCard({ icon, label, value, bg }) {
  return (
    <div className="col-md-3">
      <div className="card shadow-sm border-0">
        <div className="d-flex align-items-center p-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 60, height: 60, backgroundColor: bg }}
          >
            {icon}
          </div>
          <div className="ms-3">
            <h4 className="mb-0 fw-bold">{value}</h4>
            <small className="text-muted">{label}</small>
          </div>
        </div>
      </div>
    </div>
  );
}
