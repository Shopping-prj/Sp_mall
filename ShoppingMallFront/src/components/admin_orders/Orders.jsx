import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * 백엔드 응답 형식(예시)
 * GET /api/admin/orders?kwType=ph_no|ph_email|p_productid|p_title&kw=...&from=YYYY-MM-DD&to=YYYY-MM-DD&status=&rex=&page=1&size=30
 * [
 *   {
 *     phNo: 25032009234920,               // 주문번호 (purchaseHistory.ph_no)
 *     phDate: "2025-03-20T09:23:49",      // 주문일 (purchaseHistory.ph_date)
 *     phEmail: "user@example.com",        // 주문자 이메일 (purchaseHistory.ph_email)
 *     pProductid: "SKU-ABC-001",          // 상품코드 (purchaseHistory.p_productid)
 *     phCount: 1,                         // 수량 (purchaseHistory.ph_count)
 *     phPayment: 35000,                   // 결제금액 (purchaseHistory.ph_payment)
 *     phRefundOrExchange: null | "환불" | "교환", // (purchaseHistory.ph_Refund_or_exchange)
 *     mpOrder: "배송준비",                 // 주문상태 (myPage.mp_order)
 *     // 조인으로 받은 보조 정보(선택)
 *     productTitle: "테스트 플랫 카라 골지 니트",
 *     productImage: "https://.../thumb.jpg"
 *   },
 *   ...
 * ]
 */

const KW_TYPES = [
  { key: "ph_no", label: "주문번호" },
  { key: "ph_email", label: "주문자이메일" },
  { key: "p_productid", label: "상품코드" },
  { key: "p_title", label: "상품명" }, // 백엔드에서 product 조인 제공 시
];

const STATUSES = [
  "전체",
  "입금대기",
  "입금완료",
  "배송준비",
  "배송중",
  "배송완료",
  "취소",
  "환불",
  "반품",
  "교환",
];

const REX = ["전체", "없음", "환불", "교환"]; // ph_Refund_or_exchange

export default function OrdersPage() {
  const [sp] = useSearchParams();

  // 검색 상태
  const [kwType, setKwType] = useState("ph_no");
  const [kw, setKw] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState("전체"); // myPage.mp_order (배송전/배송준비/…)
  const [rex, setRex] = useState("전체"); // purchaseHistory.ph_Refund_or_exchange

  // 표 상태
  const [pageSize, setPageSize] = useState(30);
  const [checked, setChecked] = useState(new Set());

  // 데이터
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // URL 쿼리 → 초기상태 맵핑(선택)
  useEffect(() => {
    const st = sp.get("status");
    if (!st) return;
    const map = {
      waiting: "입금대기",
      paid: "입금완료",
      ready: "배송준비",
      shipping: "배송중",
      done: "배송완료",
      cancel: "취소",
      refund: "환불",
      return: "반품",
      exchange: "교환",
    };
    if (map[st]) setStatus(map[st]);
  }, [sp]);

  const quickDate = (type) => {
    const today = new Date();
    const fmt = (d) => d.toISOString().slice(0, 10);
    if (type === "오늘") {
      setFrom(fmt(today));
      setTo(fmt(today));
      return;
    }
    if (type === "어제") {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      setFrom(fmt(y));
      setTo(fmt(y));
      return;
    }
    if (type === "일주일") {
      const s = new Date(today);
      s.setDate(s.getDate() - 7);
      setFrom(fmt(s));
      setTo(fmt(today));
      return;
    }
    if (type === "지난달") {
      const s = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const e = new Date(today.getFullYear(), today.getMonth(), 0);
      setFrom(fmt(s));
      setTo(fmt(e));
      return;
    }
    if (type === "1개월") {
      const s = new Date(today);
      s.setMonth(s.getMonth() - 1);
      setFrom(fmt(s));
      setTo(fmt(today));
      return;
    }
    if (type === "3개월") {
      const s = new Date(today);
      s.setMonth(s.getMonth() - 3);
      setFrom(fmt(s));
      setTo(fmt(today));
      return;
    }
    if (type === "전체") {
      setFrom("");
      setTo("");
      return;
    }
  };

  const reset = () => {
    setKwType("ph_no");
    setKw("");
    setFrom("");
    setTo("");
    setStatus("전체");
    setRex("전체");
    setChecked(new Set());
  };

  // 목록 불러오기
  const fetchList = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const params = new URLSearchParams();
      if (kw) params.set("kw", kw.trim());
      if (kwType) params.set("kwType", kwType);
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      if (status && status !== "전체") params.set("status", status);
      if (rex && rex !== "전체") {
        if (rex === "없음") params.set("rex", "none");
        else params.set("rex", rex); // "환불" | "교환"
      }
      // 페이지네이션 파라미터(서버가 지원하면 사용)
      params.set("page", "1");
      params.set("size", String(pageSize));

      const res = await fetch(`/api/admin/orders?${params.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRows(Array.isArray(data) ? data : data.items || []);
      setChecked(new Set());
    } catch (e) {
      setErrorMsg("목록을 가져오지 못했습니다. (백엔드 연동을 확인하세요)");
      console.error(e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // 처음 1회 자동 로딩(원하면 주석)
  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPayment = useMemo(
    () => rows.reduce((s, r) => s + Number(r.phPayment || 0), 0),
    [rows]
  );

  // 체크박스
  const toggleAll = (e) => {
    if (e.target.checked) setChecked(new Set(rows.map((r) => r.phNo)));
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
      <h4 className="fw-semibold mb-3">주문리스트(ERD 기반)</h4>

      {/* 검색 카드 */}
      <div className="card mb-3">
        <div className="card-header fw-semibold">기본검색</div>
        <div className="card-body">
          {/* 검색어 */}
          <div className="row g-2 align-items-center mb-2">
            <div className="col-12 col-md-2">
              <span className="fw-semibold">검색어</span>
            </div>
            <div className="col-6 col-md-2">
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
            <div className="col-6 col-md-6">
              <input
                className="form-control"
                placeholder="검색어 입력"
                value={kw}
                onChange={(e) => setKw(e.target.value)}
              />
            </div>
          </div>

          {/* 주문일(주문일자만 사용: ph_date) */}
          <div className="row g-2 align-items-center mb-2">
            <div className="col-12 col-md-2">
              <span className="fw-semibold">주문일</span>
            </div>
            <div className="col-6 col-md-2">
              <input
                type="date"
                className="form-control"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="col-6 col-md-2">
              <input
                type="date"
                className="form-control"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-6 d-flex flex-wrap gap-2">
              {["오늘", "어제", "일주일", "지난달", "1개월", "3개월", "전체"].map(
                (lbl) => (
                  <button
                    key={lbl}
                    className="btn btn-outline-secondary btn-sm"
                    type="button"
                    onClick={() => quickDate(lbl)}
                  >
                    {lbl}
                  </button>
                )
              )}
            </div>
          </div>

          {/* 주문상태(mp_order) */}
          <div className="row g-3 align-items-center mb-2">
            <div className="col-12 col-md-2">
              <span className="fw-semibold">주문상태</span>
            </div>
            <div className="col">
              <div className="d-flex flex-wrap gap-3">
                {STATUSES.map((v) => (
                  <label className="form-check" key={v}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      checked={status === v}
                      onChange={() => setStatus(v)}
                    />{" "}
                    <span className="ms-1">{v}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 환불/교환 (ph_Refund_or_exchange) */}
          <div className="row g-3 align-items-center mb-2">
            <div className="col-12 col-md-2">
              <span className="fw-semibold">환불/교환</span>
            </div>
            <div className="col">
              <div className="d-flex flex-wrap gap-3">
                {REX.map((v) => (
                  <label className="form-check" key={v}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="rex"
                      checked={rex === v}
                      onChange={() => setRex(v)}
                    />{" "}
                    <span className="ms-1">{v}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="mt-3 d-flex gap-2">
            <button
              type="button"
              className="btn btn-dark"
              onClick={fetchList}
              disabled={loading}
            >
              {loading ? "검색 중..." : "검색"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={reset}
              disabled={loading}
            >
              초기화
            </button>
            {errorMsg && (
              <span className="text-danger ms-2 small">{errorMsg}</span>
            )}
          </div>
        </div>
      </div>

      {/* 상단 제어줄 */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-2 gap-2">
        <div className="small">
          전체 : <strong>{rows.length}</strong>건 조회 &nbsp;|&nbsp; 총결제금액 :{" "}
          <strong>{totalPayment.toLocaleString()}원</strong>
        </div>
        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select form-select-sm"
            style={{ width: 110 }}
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[30, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}줄 정렬
              </option>
            ))}
          </select>
          <button className="btn btn-outline-secondary btn-sm" disabled>
            주문서출력
          </button>
          <button className="btn btn-outline-secondary btn-sm" disabled>
            선택 엑셀저장
          </button>
          <button className="btn btn-outline-secondary btn-sm" disabled>
            검색결과 엑셀저장
          </button>
        </div>
      </div>

      {/* 리스트 */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr className="text-center">
              <th style={{ width: 36 }}>
                <input
                  type="checkbox"
                  onChange={toggleAll}
                  checked={rows.length > 0 && rows.length === checked.size}
                />
              </th>
              <th style={{ width: 160 }}>주문일시</th>
              <th>주문번호</th>
              <th style={{ width: 70 }}>이미지</th>
              <th>상품명</th>
              <th style={{ width: 60 }}>수량</th>
              <th style={{ width: 120 }}>결제금액</th>
              <th style={{ width: 100 }}>주문상태</th>
              <th style={{ width: 100 }}>환불/교환</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center text-muted py-4">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              rows.slice(0, pageSize).map((r) => {
                const id = r.phNo;
                const dateStr = r.phDate
                  ? new Date(r.phDate).toLocaleString()
                  : "";
                return (
                  <tr key={id}>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={checked.has(id)}
                        onChange={() => toggleOne(id)}
                      />
                    </td>
                    <td className="text-center">{dateStr}</td>
                    <td className="text-primary fw-semibold">{r.phNo}</td>
                    <td className="text-center">
                      {r.productImage ? (
                        <img
                          src={r.productImage}
                          alt=""
                          width={40}
                          height={40}
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            background: "#eee",
                          }}
                        />
                      )}
                    </td>
                    <td>{r.productTitle || r.pProductid}</td>
                    <td className="text-center">{r.phCount}</td>
                    <td className="text-end">
                      {Number(r.phPayment || 0).toLocaleString()}
                    </td>
                    <td className="text-center">{r.mpOrder || "-"}</td>
                    <td className="text-center">
                      {r.phRefundOrExchange || "없음"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}