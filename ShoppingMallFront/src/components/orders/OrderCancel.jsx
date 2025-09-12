import React, { useMemo, useState } from "react";

const TYPES   = ["전체", "취소", "반품", "교환", "환불"];
const STAGES  = ["전체", "요청", "진행중", "완료"];
const PAY     = ["전체","무통장","가상계좌","계좌이체","휴대폰","신용카드","PG간편결제","KAKAOPAY"];
const COURIER = ["CJ대한통운","우체국택배","롯데택배","한진택배","로젠택배","기타"];

// 데모 데이터(취소/반품/교환/환불)
const SEED = [
  {
    id: 501, type: "취소", stage: "요청",
    orderNo: "250910180001", orderAt: "2025-09-10 12:30", requestAt: "2025-09-10 12:35",
    name: "테스트 니트 가디건", qty: 1, amount: 59_000, shipFee: 3_000, refund: 62_000,
    reason: "단순변심", buyer: "홍길동", receiver: "홍길동",
    seller: "본사", payMethod: "무통장", franchise: "본사",
  },
  {
    id: 502, type: "반품", stage: "진행중",
    orderNo: "250910163355", orderAt: "2025-09-09 10:20", requestAt: "2025-09-12 09:10",
    name: "플랫 카라 골지 니트", qty: 1, amount: 35_000, shipFee: 0, refund: 35_000,
    reason: "불량/하자", buyer: "두끝만", receiver: "두끝만",
    seller: "본사", payMethod: "가상계좌", franchise: "본사",
    courier: "CJ대한통운", invoiceNo: "612345678901",
  },
  {
    id: 503, type: "교환", stage: "요청",
    orderNo: "250909184512", orderAt: "2025-09-08 18:45", requestAt: "2025-09-11 15:00",
    name: "롱슬리브 티셔츠", qty: 1, amount: 89_000, shipFee: 0, refund: 0,
    reason: "사이즈교환", buyer: "관리자", receiver: "관리자",
    seller: "본사", payMethod: "신용카드", franchise: "본사",
    courier: "로젠택배", invoiceNo: "123456789012",
  },
  {
    id: 504, type: "환불", stage: "완료",
    orderNo: "250901010101", orderAt: "2025-09-01 10:10", requestAt: "2025-09-02 09:30",
    name: "블라우스", qty: 1, amount: 615_600, shipFee: 0, refund: 615_600,
    reason: "품절", buyer: "가맹점몰", receiver: "가맹점몰",
    seller: "본사", payMethod: "무통장", franchise: "본사",
  },
];

export default function OrderCancel() {
  const [rows, setRows] = useState(SEED);

  // 검색 상태
  const [kwType, setKwType] = useState("주문번호"); // 주문번호 | 주문자 | 수령자 | 상품명
  const [kw, setKw] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [typeFilter, setTypeFilter] = useState("전체");     // 취소/반품/교환/환불
  const [stageFilter, setStageFilter] = useState("전체");    // 요청/진행중/완료
  const [payFilter, setPayFilter] = useState("전체");
  const [courierFilter, setCourierFilter] = useState("전체");

  // 뷰 상태
  const [pageSize, setPageSize] = useState(30);
  const [checked, setChecked] = useState(new Set());
  const [alert, setAlert] = useState(null);

  const daysSince = (dateStr) => {
    if (!dateStr) return "-";
    const s = new Date(dateStr.replace(" ", "T"));
    const diff = Math.floor((Date.now() - s.getTime()) / (1000 * 60 * 60 * 24));
    return `${diff}일`;
  };

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

  const setRowField = (id, field, value) =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

  const filtered = useMemo(() => {
    return rows.filter(o => {
      // 키워드
      if (kw.trim()) {
        const t = kw.toLowerCase();
        const target =
          kwType === "주문번호" ? o.orderNo :
          kwType === "주문자"   ? o.buyer :
          kwType === "수령자"   ? o.receiver :
          kwType === "상품명"   ? o.name : "";
        if (!(target || "").toLowerCase().includes(t)) return false;
      }
      // 기간(요청일 기준)
      if (from || to) {
        const ts = new Date((o.requestAt || o.orderAt).replace(" ","T"));
        if (from && ts < new Date(from+"T00:00:00")) return false;
        if (to && ts > new Date(to+"T23:59:59")) return false;
      }
      // 유형/처리상태/결제/택배사
      if (typeFilter !== "전체" && o.type !== typeFilter) return false;
      if (stageFilter !== "전체" && o.stage !== stageFilter) return false;
      if (payFilter !== "전체" && o.payMethod !== payFilter) return false;
      if (courierFilter !== "전체" && (o.courier || "기타") !== courierFilter) return false;
      return true;
    });
  }, [rows, kw, kwType, from, to, typeFilter, stageFilter, payFilter, courierFilter]);

  const totalRefund = useMemo(
    () => filtered.reduce((s,o)=> s + Number(o.refund||0), 0),
    [filtered]
  );

  const reset = () => {
    setKwType("주문번호"); setKw("");
    setFrom(""); setTo("");
    setTypeFilter("전체"); setStageFilter("전체");
    setPayFilter("전체"); setCourierFilter("전체");
    setChecked(new Set());
  };

  const toggleAll = (e) => {
    if (e.target.checked) setChecked(new Set(filtered.map(o=>o.id)));
    else setChecked(new Set());
  };
  const toggleOne = (id) => {
    setChecked(prev=>{
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ---- 일괄 처리(데모: 로컬 상태만 갱신) ----
  const markProcessing = () => {
    if (checked.size === 0) return setAlert({type:"warning", msg:"선택된 주문이 없습니다."});
    setRows(prev => prev.map(r => checked.has(r.id) ? { ...r, stage: "진행중" } : r));
    setChecked(new Set());
    setAlert({type:"success", msg:"선택한 주문을 진행중으로 변경했습니다."});
  };

  const markRefundDone = () => {
    if (checked.size === 0) return setAlert({type:"warning", msg:"선택된 주문이 없습니다."});
    // 취소/반품/환불 건을 환불 완료 처리
    setRows(prev => prev.map(r => checked.has(r.id) ? { ...r, type:"환불", stage:"완료" } : r));
    setChecked(new Set());
    setAlert({type:"success", msg:"선택한 주문을 환불 완료 처리했습니다."});
  };

  const markExchangeReship = () => {
    if (checked.size === 0) return setAlert({type:"warning", msg:"선택된 주문이 없습니다."});
    const missing = rows.filter(r => checked.has(r.id) && r.type==="교환" && !r.invoiceNo);
    if (missing.length > 0) return setAlert({type:"warning", msg:"교환 재배송에 필요한 송장번호가 비어 있습니다."});
    setRows(prev => prev.map(r =>
      checked.has(r.id) && r.type==="교환" ? { ...r, stage:"완료" } : r
    ));
    setChecked(new Set());
    setAlert({type:"success", msg:"선택한 교환건을 재배송 완료 처리했습니다."});
  };

  const cancelRequests = () => {
    if (checked.size === 0) return setAlert({type:"warning", msg:"선택된 주문이 없습니다."});
    setRows(prev => prev.filter(r => !checked.has(r.id)));
    setChecked(new Set());
    setAlert({type:"success", msg:"선택한 요청을 취소(목록에서 제거)했습니다."});
  };

  const exportExcel = () => {
    if (checked.size === 0) return setAlert({type:"warning", msg:"선택된 주문이 없습니다."});
    setAlert({type:"info", msg:"엑셀 저장은 백엔드 연동 후 구현하세요."});
  };
  // ------------------------------------------

  return (
    <div className="container-fluid py-3">
      <h4 className="fw-semibold mb-1">취소 / 교환 / 반품</h4>
      <div className="text-muted small mb-3">HOME &gt; 주문관리 &gt; 취소/교환/반품</div>

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
                <option>주문번호</option>
                <option>주문자</option>
                <option>수령자</option>
                <option>상품명</option>
              </select>
            </div>
            <div className="col-6 col-md-6">
              <input className="form-control" placeholder="검색어 입력" value={kw} onChange={(e)=>setKw(e.target.value)} />
            </div>
          </div>

          {/* 기간검색(요청일) */}
          <div className="row g-2 align-items-center mb-2">
            <div className="col-12 col-md-2"><span className="fw-semibold">기간검색</span></div>
            <div className="col-6 col-md-2">
              <select className="form-select" disabled><option>요청일</option></select>
            </div>
            <div className="col-6 col-md-2">
              <input type="date" className="form-control" value={from} onChange={(e)=>setFrom(e.target.value)} />
            </div>
            <div className="col-6 col-md-2">
              <input type="date" className="form-control" value={to} onChange={(e)=>setTo(e.target.value)} />
            </div>
            <div className="col-12 col-md-4 d-flex flex-wrap gap-2">
              {["오늘","어제","일주일","지난달","1개월","3개월","전체"].map(lbl=>(
                <button key={lbl} className="btn btn-outline-secondary btn-sm" type="button" onClick={()=>quickDate(lbl)}>{lbl}</button>
              ))}
            </div>
          </div>

          {/* 유형/처리상태/결제/택배사 */}
          <div className="row g-2 align-items-center mb-2">
            <div className="col-12 col-md-2"><span className="fw-semibold">유형</span></div>
            <div className="col-6 col-md-3">
              <select className="form-select" value={typeFilter} onChange={(e)=>setTypeFilter(e.target.value)}>
                {TYPES.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>

            <div className="col-12 col-md-2 text-md-end"><span className="fw-semibold">처리상태</span></div>
            <div className="col-6 col-md-3">
              <select className="form-select" value={stageFilter} onChange={(e)=>setStageFilter(e.target.value)}>
                {STAGES.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>

          <div className="row g-2 align-items-center mb-2">
            <div className="col-12 col-md-2"><span className="fw-semibold">결제방법</span></div>
            <div className="col-6 col-md-3">
              <select className="form-select" value={payFilter} onChange={(e)=>setPayFilter(e.target.value)}>
                {PAY.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>

            <div className="col-12 col-md-2 text-md-end"><span className="fw-semibold">택배사</span></div>
            <div className="col-6 col-md-3">
              <select className="form-select" value={courierFilter} onChange={(e)=>setCourierFilter(e.target.value)}>
                <option>전체</option>
                {COURIER.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-3 d-flex gap-2">
            <button type="button" className="btn btn-dark">검색</button>
            <button type="button" className="btn btn-outline-secondary" onClick={reset}>초기화</button>
          </div>
        </div>
      </div>

      {/* 상단 제어줄 */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-2 gap-2">
        <div className="small">
          전체 : <strong>{filtered.length}</strong>건 조회 &nbsp;|&nbsp;
          환불(예정) 합계 : <strong>{totalRefund.toLocaleString()}원</strong>
        </div>
        <div className="d-flex align-items-center gap-2">
          <select className="form-select form-select-sm" style={{width:110}} value={pageSize} onChange={(e)=>setPageSize(Number(e.target.value))}>
            {[30,50,100].map(n=><option key={n} value={n}>{n}줄 정렬</option>)}
          </select>
          <button className="btn btn-outline-secondary btn-sm" onClick={markProcessing}>선택 진행중</button>
          <button className="btn btn-outline-primary btn-sm" onClick={markExchangeReship}>선택 교환 재배송완료</button>
          <button className="btn btn-outline-success btn-sm" onClick={markRefundDone}>선택 환불완료</button>
          <button className="btn btn-outline-danger btn-sm" onClick={cancelRequests}>선택 접수취소</button>
          <button className="btn btn-outline-secondary btn-sm" onClick={exportExcel}>선택 엑셀저장</button>
        </div>
      </div>

      {/* 리스트 */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr className="text-center">
              <th style={{width:36}}><input type="checkbox" onChange={toggleAll} checked={filtered.length>0 && filtered.length===checked.size} /></th>
              <th style={{width:70}}>번호</th>
              <th style={{width:90}}>유형</th>
              <th style={{width:90}}>처리상태</th>
              <th style={{width:140}}>요청일</th>
              <th style={{width:70}}>경과</th>
              <th>주문번호</th>
              <th>주문상품</th>
              <th style={{width:60}}>수량</th>
              <th style={{width:110}}>상품금액</th>
              <th style={{width:90}}>환불액</th>
              <th>주문자</th>
              <th>수령자</th>
              <th style={{width:130}}>택배사(교환/반품)</th>
              <th style={{width:160}}>송장번호</th>
              <th style={{width:100}}>결제방법</th>
              <th style={{width:80}}>가맹점</th>
              <th style={{width:180}}>사유/메모</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={18} className="text-center text-muted py-4">처리 대상이 없습니다.</td></tr>
            ) : (
              filtered.slice(0, pageSize).map(o=>(
                <tr key={o.id}>
                  <td className="text-center">
                    <input type="checkbox" checked={checked.has(o.id)} onChange={()=>toggleOne(o.id)} />
                  </td>
                  <td className="text-center">{o.id}</td>
                  <td className="text-center">
                    <span className={`badge ${o.type==="교환" ? "text-bg-info" : o.type==="반품" ? "text-bg-warning" : o.type==="환불" ? "text-bg-success" : "text-bg-secondary"}`}>
                      {o.type}
                    </span>
                  </td>
                  <td className="text-center">
                    <select className="form-select form-select-sm" value={o.stage} onChange={(e)=>setRowField(o.id,"stage",e.target.value)}>
                      {STAGES.filter(s=>s!=="전체").map(s=><option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="text-center">{o.requestAt}</td>
                  <td className="text-center">{daysSince(o.requestAt)}</td>
                  <td className="text-primary fw-semibold">{o.orderNo}</td>
                  <td>{o.name}</td>
                  <td className="text-center">{o.qty}</td>
                  <td className="text-end">{Number(o.amount||0).toLocaleString()}</td>
                  <td className="text-end">{Number(o.refund||0).toLocaleString()}</td>
                  <td>{o.buyer}</td>
                  <td>{o.receiver}</td>
                  <td>
                    {(o.type==="교환" || o.type==="반품") ? (
                      <select className="form-select form-select-sm" value={o.courier || "CJ대한통운"} onChange={(e)=>setRowField(o.id,"courier",e.target.value)}>
                        {COURIER.map(c => <option key={c}>{c}</option>)}
                      </select>
                    ) : <span className="text-muted">-</span>}
                  </td>
                  <td>
                    {(o.type==="교환" || o.type==="반품") ? (
                      <input
                        className="form-control form-control-sm"
                        placeholder="송장번호"
                        value={o.invoiceNo || ""}
                        onChange={(e)=>setRowField(o.id,"invoiceNo", e.target.value.replace(/[^\d-]/g,""))}
                      />
                    ) : <span className="text-muted">-</span>}
                  </td>
                  <td className="text-center">{o.payMethod}</td>
                  <td className="text-center">{o.franchise}</td>
                  <td>
                    <input
                      className="form-control form-control-sm"
                      value={o.reason || ""}
                      onChange={(e)=>setRowField(o.id,"reason",e.target.value)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
