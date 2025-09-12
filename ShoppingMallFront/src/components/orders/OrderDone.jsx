import React, { useMemo, useState } from "react";

const PAY_METHODS = ["전체","무통장","가상계좌","계좌이체","휴대폰","신용카드","PG간편결제","KAKAOPAY"];
const COURIERS = ["CJ대한통운","우체국택배","롯데택배","한진택배","로젠택배","기타"];
const EXTRA_OPTS = [
  { key:"taxInvoice",   label:"세금계산서" },
  { key:"cashReceipt",  label:"현금영수증" },
  { key:"shippingMemo", label:"배송메세지" },
  { key:"adminMemo",    label:"관리자메모" },
  { key:"pointOrder",   label:"포인트주문" },
  { key:"coupon",       label:"쿠폰할인" },
  { key:"escrow",       label:"에스크로" },
];
const CONFIRM = ["전체","구매확정","구매미확정"];

// 송장조회 링크(데모)
const trackingUrl = (courier, invoice) => {
  if (!invoice) return "#";
  const n = encodeURIComponent(invoice);
  if (courier.includes("CJ")) return `https://tracker.delivery/#/kr.cjlogistics/${n}`;
  if (courier.includes("우체국")) return `https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm?sid1=${n}`;
  if (courier.includes("롯데")) return `https://www.lotteglogis.com/home/reservation/tracking/linkView?InvNo=${n}`;
  if (courier.includes("한진")) return `https://www.hanjin.co.kr/kor/CMS/DeliveryMgr/WaybillResult.do?mCode=MN038&wblnum=${n}`;
  if (courier.includes("로젠")) return `https://www.ilogen.com/m/personal/trace/${n}`;
  return "#";
};

// 데모 데이터(status = 배송완료)
const SEED = [
  {
    id: 401, orderNo: "250910170001", orderAt: "2025-09-10 14:00", shippedAt: "2025-09-10 15:20",
    deliveredAt: "2025-09-11 10:05", confirm: false,
    thumb: "https://via.placeholder.com/40x40.png?text=O",
    name: "테스트 니트 가디건", qty: 1, amount: 59_000, shipFee: 3_000,
    seller: "본사", buyer: "홍길동(test1)", receiver: "홍길동",
    payMethod: "무통장", franchise: "본사",
    courier: "CJ대한통운", invoiceNo: "612345678901",
    taxInvoice:false, cashReceipt:true, shippingMemo:true, adminMemo:false, pointOrder:false, coupon:false, escrow:false,
  },
  {
    id: 402, orderNo: "250910163355", orderAt: "2025-09-10 13:33", shippedAt: "2025-09-10 16:00",
    deliveredAt: "2025-09-12 09:40", confirm: true,
    thumb: "https://via.placeholder.com/40x40.png?text=O",
    name: "플랫 카라 골지 니트 (GBSKN045P)", qty: 2, amount: 70_000, shipFee: 0,
    seller: "본사", buyer: "두끝만(test2)", receiver: "두끝만",
    payMethod: "가상계좌", franchise: "본사",
    courier: "로젠택배", invoiceNo: "123456789012",
    taxInvoice:true, cashReceipt:false, shippingMemo:false, adminMemo:false, pointOrder:false, coupon:true, escrow:false,
  },
  {
    id: 403, orderNo: "250909184512", orderAt: "2025-09-09 18:45", shippedAt: "2025-09-10 09:10",
    deliveredAt: "2025-09-11 18:20", confirm: false,
    thumb: "https://via.placeholder.com/40x40.png?text=O",
    name: "스몰 체리 롱슬리브 티셔츠", qty: 1, amount: 89_000, shipFee: 0,
    seller: "본사", buyer: "관리자(admin)", receiver: "관리자",
    payMethod: "신용카드", franchise: "본사",
    courier: "우체국택배", invoiceNo: "1234567890123",
    taxInvoice:false, cashReceipt:false, shippingMemo:false, adminMemo:false, pointOrder:false, coupon:false, escrow:false,
  },
];

export default function OrderDone() {
  const [rows, setRows] = useState(SEED);

  // 검색 상태
  const [kwType, setKwType] = useState("주문번호"); // 주문번호 | 주문자 | 수령자 | 상품명
  const [kw, setKw] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [payMethod, setPayMethod] = useState("전체");
  const [courierFilter, setCourierFilter] = useState("전체");
  const [confirmFilter, setConfirmFilter] = useState("전체");
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
      // 기간(배송완료일 기준)
      if (from || to) {
        const ts = new Date((o.deliveredAt || o.shippedAt || o.orderAt).replace(" ","T"));
        if (from && ts < new Date(from+"T00:00:00")) return false;
        if (to && ts > new Date(to+"T23:59:59")) return false;
      }
      // 결제/택배사
      if (payMethod !== "전체" && o.payMethod !== payMethod) return false;
      if (courierFilter !== "전체" && o.courier !== courierFilter) return false;
      // 구매확정
      if (confirmFilter !== "전체") {
        const want = confirmFilter === "구매확정";
        if (o.confirm !== want) return false;
      }
      // 기타선택(체크된 항목만 필터)
      for (const k of Object.keys(extras)) {
        if (extras[k] && !o[k]) return false;
      }
      return true;
    });
  }, [rows, kw, kwType, from, to, payMethod, courierFilter, confirmFilter, extras]);

  const totalAmount = useMemo(
    () => filtered.reduce((s,o)=> s + (Number(o.amount||0) + Number(o.shipFee||0)), 0),
    [filtered]
  );

  const reset = () => {
    setKwType("주문번호"); setKw("");
    setFrom(""); setTo(""); setPayMethod("전체"); setCourierFilter("전체"); setConfirmFilter("전체");
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

  // 경과일 (배송완료 ~ 오늘)
  const daysSince = (deliveredAt) => {
    const s = new Date(deliveredAt.replace(" ","T"));
    const diff = Math.floor((Date.now() - s.getTime()) / (1000*60*60*24));
    return `${diff}일`;
  };

  // 선택 구매확정
  const markConfirmed = () => {
    if (checked.size === 0) {
      setAlert({ type:"warning", msg:"선택된 주문이 없습니다." });
      return;
    }
    setRows(prev => prev.map(r => checked.has(r.id) ? { ...r, confirm: true } : r));
    setChecked(new Set());
    setAlert({ type:"success", msg:"선택한 주문을 구매확정 처리했습니다." });
  };

  // 선택 반품/환불 접수 (데모: 목록에서 제거)
  const markReturn = () => {
    if (checked.size === 0) {
      setAlert({ type:"warning", msg:"선택된 주문이 없습니다." });
      return;
    }
    setRows(prev => prev.filter(o => !checked.has(o.id)));
    setChecked(new Set());
    setAlert({ type:"success", msg:"선택한 주문을 반품/환불 접수로 이동했습니다." });
  };

  const exportExcel = () => {
    if (checked.size === 0) {
      setAlert({ type:"warning", msg:"선택된 주문이 없습니다." });
      return;
    }
    setAlert({ type:"info", msg:"엑셀 저장은 백엔드 연동 후 구현하세요." });
  };

  return (
    <div className="container-fluid py-3">
      <h4 className="fw-semibold mb-1">배송완료</h4>
      <div className="text-muted small mb-3">HOME &gt; 주문관리 &gt; 배송완료</div>

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

          {/* 기간검색(배송완료일) */}
          <div className="row g-2 align-items-center mb-2">
            <div className="col-12 col-md-2"><span className="fw-semibold">기간검색</span></div>
            <div className="col-6 col-md-2">
              <select className="form-select" disabled><option>배송완료일</option></select>
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

          {/* 결제/택배사/구매확정 */}
          <div className="row g-2 align-items-center mb-2">
            <div className="col-12 col-md-2"><span className="fw-semibold">결제방법</span></div>
            <div className="col-6 col-md-3">
              <select className="form-select" value={payMethod} onChange={(e)=>setPayMethod(e.target.value)}>
                {PAY_METHODS.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>

            <div className="col-12 col-md-2 text-md-end"><span className="fw-semibold">택배사</span></div>
            <div className="col-6 col-md-3">
              <select className="form-select" value={courierFilter} onChange={(e)=>setCourierFilter(e.target.value)}>
                <option>전체</option>
                {COURIERS.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>

          <div className="row g-3 align-items-center mb-2">
            <div className="col-12 col-md-2"><span className="fw-semibold">구매확정</span></div>
            <div className="col">
              <div className="d-flex flex-wrap gap-3">
                {CONFIRM.map(v=>(
                  <label className="form-check" key={v}>
                    <input className="form-check-input" type="radio" name="confirm" checked={confirmFilter===v} onChange={()=>setConfirmFilter(v)} /> <span className="ms-1">{v}</span>
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
          <button className="btn btn-outline-primary btn-sm" onClick={markConfirmed}>선택 구매확정</button>
          <button className="btn btn-outline-secondary btn-sm" onClick={exportExcel}>선택 엑셀저장</button>
          <button className="btn btn-outline-danger btn-sm" onClick={markReturn}>선택 반품/환불 접수</button>
        </div>
      </div>

      {/* 리스트 */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr className="text-center">
              <th style={{width:36}}><input type="checkbox" onChange={toggleAll} checked={filtered.length>0 && filtered.length===checked.size} /></th>
              <th style={{width:70}}>번호</th>
              <th style={{width:140}}>배송완료일</th>
              <th>주문번호</th>
              <th style={{width:70}}>이미지</th>
              <th>주문상품</th>
              <th style={{width:60}}>수량</th>
              <th style={{width:110}}>상품금액</th>
              <th style={{width:80}}>배송비</th>
              <th>판매자</th>
              <th>주문자</th>
              <th>수령자</th>
              <th style={{width:130}}>택배사</th>
              <th style={{width:160}}>송장번호</th>
              <th style={{width:80}}>경과</th>
              <th style={{width:90}}>구매확정</th>
              <th style={{width:120}}>총주문액</th>
              <th style={{width:100}}>결제방법</th>
              <th style={{width:80}}>가맹점</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={19} className="text-center text-muted py-4">배송완료 주문이 없습니다.</td></tr>
            ) : (
              filtered.slice(0, pageSize).map(o=>(
                <tr key={o.id}>
                  <td className="text-center">
                    <input type="checkbox" checked={checked.has(o.id)} onChange={()=>toggleOne(o.id)} />
                  </td>
                  <td className="text-center">{o.id}</td>
                  <td className="text-center">{o.deliveredAt}</td>
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
                  <td className="text-center">{o.courier}</td>
                  <td className="text-center">
                    {o.invoiceNo ? (
                      <a href={trackingUrl(o.courier, o.invoiceNo)} target="_blank" rel="noreferrer" className="text-decoration-none">
                        {o.invoiceNo}
                      </a>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td className="text-center">{o.deliveredAt ? daysSince(o.deliveredAt) : "-"}</td>
                  <td className="text-center">
                    {o.confirm ? <span className="badge text-bg-success">예</span> : <span className="badge text-bg-secondary">아니오</span>}
                  </td>
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
