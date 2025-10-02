import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * 백엔드 계약(예시)
 * GET /api/admin/orders?status=입금대기&kwType=ph_no|ph_email|p_productid|p_title&kw=&from=YYYY-MM-DD&to=YYYY-MM-DD&page=1&size=30
 * [
 *   {
 *     phNo: 250910140001,            // purchaseHistory.ph_no
 *     phDate: "2025-09-10T14:00:00", // purchaseHistory.ph_date
 *     phEmail: "user@example.com",   // purchaseHistory.ph_email
 *     pProductid: "SKU-001",         // purchaseHistory.p_productid
 *     phCount: 1,                    // purchaseHistory.ph_count
 *     phPayment: 59000,              // purchaseHistory.ph_payment
 *     mpOrder: "입금대기",           // myPage.mp_order
 *     // 선택(조인 정보)
 *     productTitle: "테스트 니트 가디건",
 *     productImage: "https://.../thumb.jpg"
 *   }
 * ]
 *
 * 상태 변경(예시)
 * PUT /api/admin/orders/{phNo}/status   body: { status: "입금완료" | "취소" }
 */

const KW_TYPES = [
  { key: "ph_no", label: "주문번호" },
  { key: "ph_email", label: "주문자이메일" },
  { key: "p_productid", label: "상품코드" },
  { key: "p_title", label: "상품명" }, // 백엔드가 product 조인 제공 시
];

export default function OrderWaiting() {
  const [sp] = useSearchParams();

  // 검색/필터 상태
  const [kwType, setKwType] = useState("ph_no");
  const [kw, setKw] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // 표/선택 상태
  const [pageSize, setPageSize] = useState(30);
  const [checked, setChecked] = useState(new Set());

  // 데이터 로딩 상태
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // URL 프리셋 (?from, ?to, ?kwType, ?kw 지원)
  useEffect(() => {
    const qKwType = sp.get("kwType");
    const qKw = sp.get("kw");
    const qFrom = sp.get("from");
    const qTo = sp.get("to");
    if (qKwType && KW_TYPES.some(k => k.key === qKwType)) setKwType(qKwType);
    if (qKw) setKw(qKw);
    if (qFrom) setFrom(qFrom);
    if (qTo) setTo(qTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const quickDate = (type) => {
    const today = new Date();
    const fmt = (d) => d.toISOString().slice(0, 10);
    if (type === "오늘") { setFrom(fmt(today)); setTo(fmt(today)); return; }
    if (type === "어제") { const y = new Date(today); y.setDate(y.getDate() - 1); setFrom(fmt(y)); setTo(fmt(y)); return; }
    if (type === "일주일") { const s = new Date(today); s.setDate(s.getDate() - 7); setFrom(fmt(s)); setTo(fmt(today)); return; }
    if (type === "지난달") { const s = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const e = new Date(today.getFullYear(), today.getMonth(), 0); setFrom(fmt(s)); setTo(fmt(e)); return; }
    if (type === "1개월") { const s = new Date(today); s.setMonth(s.getMonth() - 1); setFrom(fmt(s)); setTo(fmt(today)); return; }
    if (type === "3개월") { const s = new Date(today); s.setMonth(s.getMonth() - 3); setFrom(fmt(s)); setTo(fmt(today)); return; }
    if (type === "전체") { setFrom(""); setTo(""); return; }
  };

  const reset = () => {
    setKwType("ph_no");
    setKw("");
    setFrom("");
    setTo("");
    setChecked(new Set());
    setMsg("");
  };

  // 목록 조회
  const fetchList = async () => {
    setLoading(true);
    setMsg("");
    try {
      const params = new URLSearchParams();
      params.set("status", "입금대기"); // ERD myPage.mp_order
      if (kw) params.set("kw", kw.trim());
      params.set("kwType", kwType);
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      params.set("page", "1");
      params.set("size", String(pageSize));

      const res = await fetch(`/api/admin/orders?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRows(Array.isArray(data) ? data : data.items || []);
      setChecked(new Set());
      if ((Array.isArray(data) ? data : data.items || []).length === 0) {
        setMsg("입금대기 주문이 없습니다.");
      }
    } catch (e) {
      console.error(e);
      setRows([]);
      setMsg("목록을 가져오지 못했습니다. (백엔드 연동 확인)");
    } finally {
      setLoading(false);
    }
  };

  // 첫 로딩
  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 합계
  const totalPayment = useMemo(
    () => rows.reduce((s, r) => s + Number(r.phPayment || 0), 0),
    [rows]
  );

  // 체크박스
  const toggleAll = (e) => {
    if (e.target.checked) setChecked(new Set(rows.map(r => r.phNo)));
    else setChecked(new Set());
  };
  const toggleOne = (id) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // 선택 상태 변경 공통
  const bulkUpdateStatus = async (nextStatus) => {
    if (checked.size === 0) {
      setMsg("선택된 주문이 없습니다.");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      // 병렬 처리(백엔드 성능 따라 일괄 API가 있다면 그걸 권장)
      const tasks = [...checked].map(phNo =>
        fetch(`/api/admin/orders/${phNo}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: nextStatus }), // "입금완료" | "취소"
        })
      );
      const resList = await Promise.all(tasks);
      const ok = resList.every(r => r.ok);
      if (!ok) throw new Error("일부 상태 변경 실패");

      // 성공 후 목록 갱신
      await fetchList();
      setMsg(`선택한 주문을 '${nextStatus}' 처리했습니다.`);
    } catch (e) {
      console.error(e);
      setMsg("상태 변경에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-3">
      <h4 className="fw-semibold mb-1">입금대기</h4>
      <div className="text-muted small mb-3">HOME &gt; 주문관리 &gt; 입금대기</div>

      {msg && <div className="alert alert-secondary py-2">{msg}</div>}

      {/* 검색 카드 */}
      <div className="card mb-3">
        <div className="card-header fw-semibold">기본검색</div>
        <div className="card-body">
          {/* 검색어 */}
          <div className="row g-2 align-items-center mb-2">
            <div className="col-12 col-md-2"><span className="fw-semibold">검색어</span></div>
            <div className="col-6 col-md-2">
              <select className="form-select" value={kwType} onChange={(e)=>setKwType(e.target.value)}>
                {KW_TYPES.map(k => <option key={k.key} value={k.key}>{k.label}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-6">
              <input className="form-control" placeholder="검색어 입력" value={kw} onChange={(e)=>setKw(e.target.value)} />
            </div>
          </div>

          {/* 기간검색 (주문일: ph_date) */}
          <div className="row g-2 align-items-center mb-2">
            <div className="col-12 col-md-2"><span className="fw-semibold">주문일</span></div>
            <div className="col-6 col-md-2">
              <input type="date" className="form-control" value={from} onChange={(e)=>setFrom(e.target.value)} />
            </div>
            <div className="col-6 col-md-2">
              <input type="date" className="form-control" value={to} onChange={(e)=>setTo(e.target.value)} />
            </div>
            <div className="col-12 col-md-6 d-flex flex-wrap gap-2">
              {["오늘","어제","일주일","지난달","1개월","3개월","전체"].map(lbl=>(
                <button key={lbl} className="btn btn-outline-secondary btn-sm" type="button" onClick={()=>quickDate(lbl)}>{lbl}</button>
              ))}
            </div>
          </div>

          {/* 버튼 */}
          <div className="mt-3 d-flex gap-2">
            <button type="button" className="btn btn-dark" onClick={fetchList} disabled={loading}>
              {loading ? "검색 중..." : "검색"}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={reset} disabled={loading}>초기화</button>
          </div>
        </div>
      </div>

      {/* 상단 제어줄 */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-2 gap-2">
        <div className="small">
          전체 : <strong>{rows.length}</strong>건 조회 &nbsp;|&nbsp;
          총결제금액 : <strong>{totalPayment.toLocaleString()}원</strong>
        </div>
        <div className="d-flex align-items-center gap-2">
          <select className="form-select form-select-sm" style={{width:110}} value={pageSize} onChange={(e)=>setPageSize(Number(e.target.value))}>
            {[30,50,100].map(n=><option key={n} value={n}>{n}줄 정렬</option>)}
          </select>
          <button className="btn btn-outline-primary btn-sm" onClick={()=>bulkUpdateStatus("입금완료")} disabled={loading}>선택 입금완료 처리</button>
          <button className="btn btn-outline-danger btn-sm" onClick={()=>bulkUpdateStatus("취소")} disabled={loading}>선택 취소</button>
        </div>
      </div>

      {/* 리스트 */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr className="text-center">
              <th style={{width:36}}>
                <input type="checkbox" onChange={toggleAll} checked={rows.length>0 && rows.length===checked.size} />
              </th>
              <th style={{width:160}}>주문일시</th>
              <th>주문번호</th>
              <th style={{width:70}}>이미지</th>
              <th>상품명</th>
              <th style={{width:70}}>수량</th>
              <th style={{width:120}}>결제금액</th>
              <th style={{width:100}}>주문상태</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={8} className="text-center text-muted py-4">검색 결과가 없습니다.</td></tr>
            ) : (
              rows.slice(0, pageSize).map(r => {
                const id = r.phNo;
                const dateStr = r.phDate ? new Date(r.phDate).toLocaleString() : "";
                return (
                  <tr key={id}>
                    <td className="text-center">
                      <input type="checkbox" checked={checked.has(id)} onChange={()=>toggleOne(id)} />
                    </td>
                    <td className="text-center">{dateStr}</td>
                    <td className="text-primary fw-semibold">{r.phNo}</td>
                    <td className="text-center">
                      {r.productImage ? (
                        <img src={r.productImage} alt="" width={40} height={40} style={{objectFit:"cover"}}/>
                      ) : (
                        <div style={{width:40,height:40,background:"#eee"}} />
                      )}
                    </td>
                    <td>{r.productTitle || r.pProductid}</td>
                    <td className="text-center">{r.phCount}</td>
                    <td className="text-end">{Number(r.phPayment||0).toLocaleString()}</td>
                    <td className="text-center">{r.mpOrder || "입금대기"}</td>
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