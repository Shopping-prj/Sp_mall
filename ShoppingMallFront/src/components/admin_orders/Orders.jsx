// src/pages/admin/OrdersPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

// 검색 타입 옵션
const KW_TYPES = [
  { key: "o_no", label: "주문번호" },
  { key: "o_email", label: "주문자이메일" },
];

// 주문 상태 옵션
const STATUSES = [
  { value: "전체", label: "전체" },
  // { value: "입금대기", label: "입금대기" },
  // { value: "결제완료", label: "결제완료" },
  // { value: "배송준비", label: "배송준비" },
  // { value: "배송중", label: "배송중" },
  // { value: "배송완료", label: "배송완료" },
  // { value: "취소", label: "취소" },
  // { value: "반품", label: "반품" },
  // { value: "교환", label: "교환" },
  // { value: "CANCELLED", label: "결제취소" }, // ✅ 추가
];

const API_BASE = (process.env.REACT_APP_SPRING_IP || "http://localhost:8080").replace(/\/$/, "");

// 🔑 토큰 붙여주는 공용 fetch
const apiFetch = async (url, options = {}) => {
  const accessToken = localStorage.getItem("accessToken");

  const merged = {
    credentials: "include",
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  };

  return fetch(url, merged);
};

export default function OrdersPage() {
  const [sp] = useSearchParams();

  // 검색 상태
  const [kwType, setKwType] = useState("o_no");
  const [kw, setKw] = useState("");
  const [status, setStatus] = useState("전체");

  // 표 상태
  const [pageSize] = useState(30);
  const [checked, setChecked] = useState(new Set());

  // 데이터 상태
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const st = sp.get("status");
    if (!st) return;
    setStatus(st);
  }, [sp]);

  // 목록 조회
  const fetchList = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const params = new URLSearchParams();
      if (kw) params.set("kw", kw.trim());
      if (kwType) params.set("kwType", kwType);
      if (status && status !== "전체") params.set("status", status);
      params.set("page", "1");
      params.set("size", String(pageSize));

      const res = await apiFetch(`${API_BASE}/api/admin/orders?${params.toString()}`);
      if (!res.ok) {
        const text = await res.text();
        console.error("응답 오류:", res.status, text.slice(0, 200));
        throw new Error(`HTTP ${res.status}`);
      }
      const raw = await res.json();

      console.log("주문 raw 데이터:", raw);

      const mapped = (Array.isArray(raw) ? raw : raw.items || [])
        .filter((d) => d && d.o_no != null)
        .map((d) => ({
          oNo: d.o_no,
          oCreatedAt: d.o_created_at,
          oEmail: d.o_email,
          productTitle: d.productTitle,
          oAmount: d.o_amount,
          oStatus: d.o_status,
          payStatus: d.pay_status, // ✅ 결제상태 추가
        }));

      setRows(mapped);
      setChecked(new Set());
    } catch (e) {
      setErrorMsg("목록을 가져오지 못했습니다. (백엔드 연동 확인)");
      console.error(e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPayment = useMemo(
    () => rows.reduce((s, r) => s + Number(r.oAmount || 0), 0),
    [rows]
  );

  const toggleAll = (e) => {
    if (e.target.checked) setChecked(new Set(rows.map((r) => r.oNo)));
    else setChecked(new Set());
  };
  const toggleOne = (id) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="container-fluid py-3">
      <h4 className="fw-semibold mb-3">주문리스트</h4>

      {/* 검색 카드 */}
      <div className="card mb-3">
        <div className="card-header fw-semibold">기본검색</div>
        <div className="card-body">
          {/* 검색어 */}
          <div className="row g-3 align-items-center mb-2">
            <div className="col-12 col-md-2">
              <label className="col-form-label fw-semibold">검색어</label>
            </div>
            <div className="col-12 col-md-2">
              <select
                className="form-select"
                value={kwType}
                onChange={(e) => setKwType(e.target.value)}
              >
                {KW_TYPES.map((k) => (
                  <option key={k.key} value={k.key}>
                    {k.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6">
              <input
                className="form-control"
                placeholder="검색어 입력"
                value={kw}
                onChange={(e) => setKw(e.target.value)}
              />
            </div>
          </div>

          {/* 주문 상태 */}
          <div className="row g-3 align-items-center mb-2">
            <div className="col-12 col-md-2">
              <label className="col-form-label fw-semibold">주문상태</label>
            </div>
            <div className="col-12 col-md-10 d-flex flex-wrap gap-3">
              {STATUSES.map((s) => (
                <label
                  key={s.value}
                  style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s.value}
                    checked={status === s.value}
                    onChange={() => setStatus(s.value)}
                  />
                  {s.label}
                </label>
              ))}
            </div>
          </div>

          {/* 버튼 */}
          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-dark" onClick={fetchList} disabled={loading}>
              {loading ? "검색 중..." : "검색"}
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setKw("");
                setStatus("전체");
                fetchList();
              }}
            >
              초기화
            </button>
            {errorMsg && <span className="text-danger small">{errorMsg}</span>}
          </div>
        </div>
      </div>

      {/* 결과 테이블 */}
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr className="text-center">
              <th>
                <label style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <input
                    type="checkbox"
                    onChange={toggleAll}
                    checked={rows.length > 0 && rows.length === checked.size}
                  />
                  전체선택
                </label>
              </th>
              <th>주문일시</th>
              <th>주문번호</th>
              <th>회원이메일</th>
              <th>상품명</th>
              <th>결제금액</th>
              <th>주문상태</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              rows.slice(0, pageSize).map((r) => {
                const dateStr = r.oCreatedAt
                  ? new Date(r.oCreatedAt).toLocaleString()
                  : "";
                return (
                  <tr key={r.oNo ?? `tmp-${Math.random()}`}>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={checked.has(r.oNo)}
                        onChange={() => toggleOne(r.oNo)}
                      />
                    </td>
                    <td className="text-center">{dateStr}</td>
                    <td className="text-primary fw-semibold">{r.oNo}</td>
                    <td className="text-center">{r.oEmail}</td>
                    <td title={r.productTitle}>
                      {(() => {
                        if (!r.productTitle) return "";
                        const titles = String(r.productTitle)
                          .split(/,\s*/g)
                          .map((t) => t.trim())
                          .filter(Boolean);
                        const first = titles[0] || "";
                        const extraCount = titles.length - 1;
                        return extraCount > 0 ? `${first} (외 ${extraCount}건)` : first;
                      })()}
                    </td>
                    <td className="text-end">{Number(r.oAmount || 0).toLocaleString()}</td>
                    <td className="text-center">
                      {r.payStatus === "CANCELLED" ? "결제취소" : r.oStatus || "-"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 총 결제 금액 */}
      <div className="mt-2">
        총 결제금액: <strong>{totalPayment.toLocaleString()}원</strong>
      </div>
    </div>
  );
}
