import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PAY_METHODS = ["전체","무통장","가상계좌","계좌이체","휴대폰","신용카드","PG간편결제","KAKAOPAY"];
const KW_TYPES = [
  { key:"ph_no", label:"주문번호" },
  { key:"ph_email", label:"주문자이메일" },
  { key:"p_productid", label:"상품코드" },
  { key:"p_title", label:"상품명" }, // product 조인 시
];

// 상단 탭 종류
const TABS = [
  { key: "all",    label: "전체(취소/교환)" },
  { key: "cancel", label: "취소만" },
  { key: "exchange", label: "교환만" },
];

export default function OrderCancelExchange() {
  const [sp] = useSearchParams();

  // 탭 상태 (기본: 전체)
  const [tab, setTab] = useState(sp.get("tab") === "cancel" ? "cancel" : sp.get("tab") === "exchange" ? "exchange" : "all");

  // 검색 상태
  const [kwType, setKwType] = useState("ph_no");
  const [kw, setKw] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [payMethod, setPayMethod] = useState("전체");

  // 데이터/표 상태
  const [rows, setRows] = useState([]);
  const [pageSize, setPageSize] = useState(30);
  const [checked, setChecked] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // URL 프리셋
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
    const fmt = (d) => d.toISOString().slice(0,10);
    if (type==="오늘") { setFrom(fmt(today)); setTo(fmt(today)); return; }
    if (type==="어제") { const y=new Date(today); y.setDate(y.getDate()-1); setFrom(fmt(y)); setTo(fmt(y)); return; }
    if (type==="일주일") { const s=new Date(today); s.setDate(s.getDate()-7); setFrom(fmt(s)); setTo(fmt(today)); return; }
    if (type==="지난달") { const s=new Date(today.getFullYear(), today.getMonth()-1, 1);
      const e=new Date(today.getFullYear(), today.getMonth(), 0); setFrom(fmt(s)); setTo(fmt(e)); return; }
    if (type==="1개월") { const s=new Date(today); s.setMonth(s.getMonth()-1); setFrom(fmt(s)); setTo(fmt(today)); return; }
    if (type==="3개월") { const s=new Date(today); s.setMonth(s.getMonth()-3); setFrom(fmt(s)); setTo(fmt(today)); return; }
    if (type==="전체") { setFrom(""); setTo(""); return; }
  };

  // 목록 조회
  const fetchList = async () => {
    setLoading(true); setAlert(null);
    try {
      const params = new URLSearchParams();
      // 탭별 파라미터 구성
      if (tab === "all") {
        params.set("status", "취소");
        params.set("rex", "교환");
        params.set("any", "1"); // (mp_order='취소' OR ph_Refund_or_exchange='교환')
      } else if (tab === "cancel") {
        params.set("status", "취소");
      } else if (tab === "exchange") {
        params.set("rex", "교환");
      }

      params.set("kwType", kwType);
      if (kw) params.set("kw", kw.trim());
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      if (payMethod !== "전체") params.set("payMethod", payMethod);
      params.set("page", "1");
      params.set("size", String(pageSize));

      const res = await fetch(`/api/admin/orders?${params.toString()}`, { credentials:"include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.items || []);
      setRows(list);
      setChecked(new Set());
      if (list.length === 0) {
        setAlert({ type: "secondary", msg: tab === "cancel" ? "취소 주문이 없습니다." : tab === "exchange" ? "교환 주문이 없습니다." : "취소/교환 주문이 없습니다." });
      }
    } catch (e) {
      console.error(e);
      setRows([]);
      setAlert({ type: "danger", msg: "목록을 가져오지 못했습니다. (백엔드 연동 확인)" });
    } finally {
      setLoading(false);
    }
  };

  // 최초 및 탭/페이지 크기 변동 시 가져오기
  useEffect(() => { fetchList(); /* eslint-disable-next-line */ }, [tab]);

  const totalPayment = useMemo(
    () => rows.reduce((s,r)=> s + Number(r.phPayment || 0), 0),
    [rows]
  );

  // 클라 보조 필터(결제수단)
  const filtered = useMemo(() => {
    return rows.filter(o => (payMethod === "전체" || o.payMethod === payMethod));
  }, [rows, payMethod]);

  const reset = () => {
    setKwType("ph_no"); setKw("");
    setFrom(""); setTo("");
    setPayMethod("전체");
    setChecked(new Set());
    setAlert(null);
  };

  // 체크박스
  const toggleAll = (e) => {
    if (e.target.checked) setChecked(new Set(filtered.map(o=>o.phNo)));
    else setChecked(new Set());
  };
  const toggleOne = (id) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // 상태 변경: ‘배송준비’로 복구 (필요 시 다른 상태로 변경 가능)
  const restoreToReady = async () => {
    if (checked.size === 0) { setAlert({type:"warning", msg:"선택된 주문이 없습니다."}); return; }
    setLoading(true); setAlert(null);
    try {
      const tasks = [...checked].map(phNo =>
        fetch(`/api/admin/orders/${phNo}/status`, {
          method:"PUT",
          headers:{ "Content-Type":"application/json" },
          credentials:"include",
          body: JSON.stringify({ status: "배송준비" })
        })
      );
      const rs = await Promise.all(tasks);
      if (!rs.every(r => r.ok)) throw new Error();
      await fetchList();
      setAlert({type:"success", msg:"선택 주문을 ‘배송준비’로 복구했습니다."});
    } catch {
      setAlert({type:"danger", msg:"복구 처리 실패"});
    } finally { setLoading(false); }
  };

  // 환불/교환 표기 변경
  const bulkRex = async (type) => {
    if (checked.size === 0) { setAlert({type:"warning", msg:"선택된 주문이 없습니다."}); return; }
    setLoading(true); setAlert(null);
    try {
      const tasks = [...checked].map(phNo =>
        fetch(`/api/admin/orders/${phNo}/rex`, {
          method:"PUT",
          headers:{ "Content-Type":"application/json" },
          credentials:"include",
          body: JSON.stringify({ type }) // "환불" | "교환" | null
        })
      );
      const rs = await Promise.all(tasks);
      if (!rs.every(r => r.ok)) throw new Error();
      await fetchList();
      setAlert({type:"success", msg:`선택 주문에 ‘${type ?? "표기삭제"}’ 반영했습니다.`});
    } catch {
      setAlert({type:"danger", msg:"환불/교환 반영 실패"});
    } finally { setLoading(false); }
  };

  return (
    <div className="container-fluid py-3">
      <h4 className="fw-semibold mb-1">취소/교환</h4>
      <div className="text-muted small mb-3">HOME &gt; 주문관리 &gt; 취소/교환</div>

      {/* 탭 */}
      <div className="mb-3 d-flex gap-2">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`btn btn-sm ${tab===t.key ? "btn-dark" : "btn-outline-secondary"}`}
            onClick={()=>setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

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

          {/* 결제방법 */}
          <div className="row g-2 align-items-center mb-2">
            <div className="col-12 col-md-2"><span className="fw-semibold">결제방법</span></div>
            <div className="col-6 col-md-3">
              <select className="form-select" value={payMethod} onChange={(e)=>setPayMethod(e.target.value)}>
                {PAY_METHODS.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>

          {/* 버튼 */}
          <div className="mt-3 d-flex gap-2">
            <button type="button" className="btn btn-dark" onClick={fetchList} disabled={loading}>{loading ? "검색 중..." : "검색"}</button>
            <button type="button" className="btn btn-outline-secondary" onClick={reset} disabled={loading}>초기화</button>
          </div>
        </div>
      </div>

      {/* 상단 제어줄 */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-2 gap-2">
        <div className="small">
          전체 : <strong>{filtered.length}</strong>건 조회 &nbsp;|&nbsp;
          총결제금액 : <strong>{totalPayment.toLocaleString()}원</strong>
        </div>
        <div className="d-flex align-items-center gap-2">
          <select className="form-select form-select-sm" style={{width:110}} value={pageSize} onChange={(e)=>setPageSize(Number(e.target.value))}>
            {[30,50,100].map(n=><option key={n} value={n}>{n}줄 정렬</option>)}
          </select>
          <button className="btn btn-outline-primary btn-sm" onClick={restoreToReady} disabled={loading}>선택 배송준비로</button>
          <div className="vr d-none d-md-block" />
          <button className="btn btn-outline-dark btn-sm" onClick={()=>bulkRex("환불")} disabled={loading}>환불 표기</button>
          <button className="btn btn-outline-dark btn-sm" onClick={()=>bulkRex("교환")} disabled={loading}>교환 표기</button>
          <button className="btn btn-outline-dark btn-sm" onClick={()=>bulkRex(null)} disabled={loading}>표기 삭제</button>
        </div>
      </div>

      {/* 리스트 */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr className="text-center">
              <th style={{width:36}}>
                <input type="checkbox" onChange={toggleAll} checked={filtered.length>0 && filtered.length===checked.size} />
              </th>
              <th style={{width:160}}>주문일시</th>
              <th>주문번호</th>
              <th style={{width:70}}>이미지</th>
              <th>주문상품</th>
              <th style={{width:60}}>수량</th>
              <th style={{width:120}}>결제금액</th>
              <th style={{width:100}}>주문상태</th>
              <th style={{width:100}}>환불/교환</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} className="text-center text-muted py-4">검색 결과가 없습니다.</td></tr>
            ) : (
              filtered.slice(0, pageSize).map(o => {
                const id = o.phNo;
                const dateStr = o.phDate ? new Date(o.phDate).toLocaleString() : "";
                return (
                  <tr key={id}>
                    <td className="text-center">
                      <input type="checkbox" checked={checked.has(id)} onChange={()=>toggleOne(id)} />
                    </td>
                    <td className="text-center">{dateStr}</td>
                    <td className="text-primary fw-semibold">{o.phNo}</td>
                    <td className="text-center">
                      {o.productImage ? (
                        <img src={o.productImage} alt="" width={40} height={40} style={{objectFit:"cover"}}/>
                      ) : (
                        <div style={{width:40,height:40,background:"#eee"}} />
                      )}
                    </td>
                    <td>{o.productTitle || o.pProductid}</td>
                    <td className="text-center">{o.phCount}</td>
                    <td className="text-end">{Number(o.phPayment||0).toLocaleString()}</td>
                    <td className="text-center">{o.mpOrder || "-"}</td>
                    <td className="text-center">{o.phRefundOrExchange || "없음"}</td>
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