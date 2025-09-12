import React, { useMemo, useState } from "react";

const PAY_METHODS = ["전체","무통장","가상계좌","계좌이체","휴대폰","신용카드","PG간편결제","KAKAOPAY"];
const EXTRA_OPTS = [
  { key:"taxInvoice",   label:"세금계산서" },
  { key:"cashReceipt",  label:"현금영수증" },
  { key:"shippingMemo", label:"배송메세지" },
  { key:"adminMemo",    label:"관리자메모" },
  { key:"pointOrder",   label:"포인트주문" },
  { key:"coupon",       label:"쿠폰할인" },
  { key:"escrow",       label:"에스크로" },
];

// 데모용 데이터 (status = "입금대기" 만)
const SEED = [
  {
    id: 101, orderNo: "250910110001", orderAt: "2025-09-10 11:00",
    thumb: "https://via.placeholder.com/40x40.png?text=O",
    name: "테스트 니트 가디건", qty: 1, amount: 59_000, shipFee: 3_000,
    seller: "본사", buyer: "홍길동(test1)", receiver: "홍길동",
    payMethod: "무통장", franchise: "본사",
    taxInvoice:false, cashReceipt:true, shippingMemo:true, adminMemo:false, pointOrder:false, coupon:false, escrow:false,
  },
  {
    id: 102, orderNo: "250910103355", orderAt: "2025-09-10 10:33",
    thumb: "https://via.placeholder.com/40x40.png?text=O",
    name: "플랫 카라 골지 니트 (GBSKN045P)", qty: 2, amount: 70_000, shipFee: 0,
    seller: "본사", buyer: "두끝만(test2)", receiver: "두끝만",
    payMethod: "가상계좌", franchise: "본사",
    taxInvoice:true, cashReceipt:false, shippingMemo:false, adminMemo:false, pointOrder:false, coupon:true, escrow:false,
  },
  {
    id: 103, orderNo: "250909184512", orderAt: "2025-09-09 18:45",
    thumb: "https://via.placeholder.com/40x40.png?text=O",
    name: "스몰 체리 롱슬리브 티셔츠", qty: 1, amount: 89_000, shipFee: 0,
    seller: "본사", buyer: "관리자(admin)", receiver: "관리자",
    payMethod: "무통장", franchise: "본사",
    taxInvoice:false, cashReceipt:false, shippingMemo:false, adminMemo:false, pointOrder:false, coupon:false, escrow:false,
  },
];

export default function OrderWaiting() {
  // 테이블 행 상태 (입금확정/취소 시 클라이언트에서 제거)
  const [rows, setRows] = useState(SEED);

  // 검색 상태
  const [kwType, setKwType] = useState("주문번호"); // 주문번호 | 주문자 | 수령자 | 상품명
  const [kw, setKw] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [payMethod, setPayMethod] = useState("전체");
  const [extras, setExtras] = useState({
    taxInvoice:false, cashReceipt:false, shippingMemo:false,
    adminMemo:false, pointOrder:false, coupon:false, escrow:false
  });

  const [pageSize, setPageSize] = useState(30);
  const [checked, setChecked] = useState(new Set());
  const [alert, setAlert] = useState(null);

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
      // 기간
      if (from || to) {
        const ts = new Date(o.orderAt.replace(" ","T"));
        if (from && ts < new Date(from+"T00:00:00")) return false;
        if (to && ts > new Date(to+"T23:59:59")) return false;
      }
      // 결제수단
      if (payMethod !== "전체" && o.payMethod !== payMethod) return false;
      // 기타선택(체크된 항목만 필터)
      for (const k of Object.keys(extras)) {
        if (extras[k] && !o[k]) return false;
      }
      return true;
    });
  }, [rows, kw, kwType, from, to, payMethod, extras]);

  const totalAmount = useMemo(
    () => filtered.reduce((s,o)=> s + (Number(o.amount||0) + Number(o.shipFee||0)), 0),
    [filtered]
  );

  const reset = () => {
    setKwType("주문번호"); setKw("");
    setFrom(""); setTo(""); setPayMethod("전체");
    setExtras({taxInvoice:false,cashReceipt:false,shippingMemo:false,adminMemo:false,pointOrder:false,coupon:false,escrow:false});
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

  // 일괄 입금확정 (데모: 선택행 제거)
  const confirmPaid = async () => {
    if (checked.size === 0) {
      setAlert({ type:"warning", msg:"선택된 주문이 없습니다." });
      return;
    }
    // TODO: 실제 API 호출(PUT /orders/{id}/paid 등) 후 성공 시 제거
    setRows(prev => prev.filter(o => !checked.has(o.id)));
    setChecked(new Set());
    setAlert({ type:"success", msg:"선택한 주문을 입금확정 처리했습니다." });
  };

  // 일괄 취소 (데모: 선택행 제거)
  const cancelOrders = async () => {
    if (checked.size === 0) {
      setAlert({ type:"warning", msg:"선택된 주문이 없습니다." });
      return;
    }
    // TODO: 실제 API 호출(PUT /orders/{id}/cancel 등)
    setRows(prev => prev.filter(o => !checked.has(o.id)));
    setChecked(new Set());
    setAlert({ type:"success", msg:"선택한 주문을 취소 처리했습니다." });
  };

  return (
    <div className="container-fluid py-3">
      <h4 className="fw-semibold mb-1">입금대기</h4>
      <div className="text-muted small mb-3">HOME &gt; 주문관리 &gt; 입금대기</div>

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

          {/* 기간검색 */}
          <div className="row g-2 align-items-center mb-2">
            <div className="col-12 col-md-2"><span className="fw-semibold">기간검색</span></div>
            <div className="col-6 col-md-2">
              <select className="form-select" disabled><option>주문일</option></select>
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

          {/* 결제방법 */}
          <div className="row g-3 align-items-center mb-2">
            <div className="col-12 col-md-2"><span className="fw-semibold">결제방법</span></div>
            <div className="col">
              <div className="d-flex flex-wrap gap-3">
                {PAY_METHODS.map(v=>(
                  <label className="form-check" key={v}>
                    <input className="form-check-input" type="radio" name="pay" checked={payMethod===v} onChange={()=>setPayMethod(v)} /> <span className="ms-1">{v}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 기타선택 */}
          <div className="row g-3 align-items-center mb-2">
            <div className="col-12 col-md-2"><span className="fw-semibold">기타선택</span></div>
            <div className="col d-flex flex-wrap gap-3">
              {EXTRA_OPTS.map(o=>(
                <label className="form-check" key={o.key}>
                  <input
                    className="form-check-input" type="checkbox"
                    checked={extras[o.key]} onChange={(e)=>setExtras(prev=>({...prev,[o.key]:e.target.checked}))}
                  /> <span className="ms-1">{o.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 버튼 */}
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
          총주문액 : <strong>{totalAmount.toLocaleString()}원</strong>
        </div>
        <div className="d-flex align-items-center gap-2">
          <select className="form-select form-select-sm" style={{width:110}} value={pageSize} onChange={(e)=>setPageSize(Number(e.target.value))}>
            {[30,50,100].map(n=><option key={n} value={n}>{n}줄 정렬</option>)}
          </select>
          <button className="btn btn-outline-primary btn-sm" onClick={confirmPaid}>선택 입금확정</button>
          <button className="btn btn-outline-danger btn-sm" onClick={cancelOrders}>선택 취소</button>
          <button className="btn btn-outline-secondary btn-sm">선택 엑셀저장</button>
          <button className="btn btn-outline-secondary btn-sm">주문서 출력</button>
        </div>
      </div>

      {/* 리스트 */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr className="text-center">
              <th style={{width:36}}><input type="checkbox" onChange={toggleAll} checked={filtered.length>0 && filtered.length===checked.size} /></th>
              <th style={{width:70}}>번호</th>
              <th style={{width:140}}>주문일시</th>
              <th>주문번호</th>
              <th style={{width:70}}>이미지</th>
              <th>주문상품</th>
              <th style={{width:60}}>수량</th>
              <th style={{width:110}}>상품금액</th>
              <th style={{width:80}}>배송비</th>
              <th>판매자</th>
              <th>주문자</th>
              <th>수령자</th>
              <th style={{width:120}}>총주문액</th>
              <th style={{width:100}}>결제방법</th>
              <th style={{width:80}}>가맹점</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={15} className="text-center text-muted py-4">입금대기 주문이 없습니다.</td></tr>
            ) : (
              filtered.slice(0, pageSize).map(o=>(
                <tr key={o.id}>
                  <td className="text-center">
                    <input type="checkbox" checked={checked.has(o.id)} onChange={()=>toggleOne(o.id)} />
                  </td>
                  <td className="text-center">{o.id}</td>
                  <td className="text-center">{o.orderAt}</td>
                  <td className="text-primary fw-semibold">{o.orderNo}</td>
                  <td className="text-center">
                    <img src={o.thumb} alt="" width={40} height={40} style={{objectFit:"cover"}}/>
                  </td>
                  <td>{o.name}</td>
                  <td className="text-center">{o.qty}</td>
                  <td className="text-end">{Number(o.amount||0).toLocaleString()}</td>
                  <td className="text-end">{Number(o.shipFee||0).toLocaleString()}</td>
                  <td>{o.seller}</td>
                  <td>{o.buyer}</td>
                  <td>{o.receiver}</td>
                  <td className="text-end">{(Number(o.amount||0)+Number(o.shipFee||0)).toLocaleString()}</td>
                  <td className="text-center">{o.payMethod}</td>
                  <td className="text-center">{o.franchise}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}