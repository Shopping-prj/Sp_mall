import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const PAY_METHODS = ["전체","무통장","가상계좌","계좌이체","휴대폰","신용카드", "KAKAOPAY"];
const STATUSES = ["전체","입금대기","입금완료","배송준비","배송중","배송완료","취소","환불","반품","교환"];
const CONFIRM = ["전체","구매확정","구매미확정"];
const EXTRA_OPTS = [
  { key:"taxInvoice",   label:"세금계산서" },
  { key:"cashReceipt",  label:"현금영수증" },
  { key:"shippingMemo", label:"배송메세지" },
  { key:"adminMemo",    label:"관리자메모" },
  { key:"pointOrder",   label:"포인트주문" },
  { key:"coupon",       label:"쿠폰할인" },
  { key:"escrow",       label:"에스크로" },
];

// 데모 데이터(백엔드 붙이기 전 임시)
const MOCK = [
  {
    id: 8, orderNo: "25090411260805", orderAt: "2025-09-04 11:26", isTest:true,
    thumb: "https://via.placeholder.com/40x40.png?text=O",
    name: "테스트 상품3", qty: 1, amount: 0, shipFee: 0,
    status: "취소", seller: "본사", buyer: "관리자(admin)", receiver: "관리자",
    payMethod: "포인트", franchise: "본사",
    confirm: false,
    taxInvoice: false, cashReceipt:false, shippingMemo:false, adminMemo:false, pointOrder:true, coupon:false, escrow:false,
  },
  {
    id: 7, orderNo: "25072214510065", orderAt: "2025-07-22 14:52", isTest:true,
    thumb: "https://via.placeholder.com/40x40.png?text=O",
    name: "테스트 플랫 카라 골지 니트 (GBSKN045P)", qty: 1, amount: 35000, shipFee: 0,
    status: "취소", seller: "본사", buyer: "관리자(admin)", receiver: "관리자",
    payMethod: "무통장", franchise: "본사",
    confirm: false,
    taxInvoice: false, cashReceipt:false, shippingMemo:false, adminMemo:false, pointOrder:false, coupon:false, escrow:false,
  },
  {
    id: 6, orderNo: "25032009550290", orderAt: "2025-03-20 09:55", isTest:false,
    thumb: "https://via.placeholder.com/40x40.png?text=O",
    name: "테스트 상품 스몰 체리 롱 슬리브 티셔츠", qty: 1, amount: 89000, shipFee: 0,
    status: "취소", seller: "본사", buyer: "한끝만(test1)", receiver: "한끝만",
    payMethod: "무통장", franchise: "본사",
    confirm: false,
    taxInvoice: false, cashReceipt:false, shippingMemo:false, adminMemo:false, pointOrder:false, coupon:false, escrow:false,
  },
  {
    id: 5, orderNo: "25032009234920", orderAt: "2025-03-20 09:23", isTest:false,
    thumb: "https://via.placeholder.com/40x40.png?text=O",
    name: "테스트 플랫 카라 골지 니트 (GBSKN045P)", qty: 1, amount: 35000, shipFee: 0,
    status: "취소", seller: "본사", buyer: "두끝만(test2)", receiver: "두끝만",
    payMethod: "무통장", franchise: "본사",
    confirm: false,
    taxInvoice: false, cashReceipt:false, shippingMemo:false, adminMemo:false, pointOrder:false, coupon:false, escrow:false,
  },
  {
    id: 4, orderNo: "25031113403850", orderAt: "2025-03-11 13:40", isTest:false,
    thumb: "https://via.placeholder.com/40x40.png?text=O",
    name: "테스트 블라우스 프린팅 클래..", qty: 1, amount: 615600, shipFee: 0,
    status: "주문완료", seller: "본사", buyer: "가맹점몰(submall)", receiver: "가맹점몰",
    payMethod: "무통장", franchise: "본사",
    confirm: false,
    taxInvoice: false, cashReceipt:false, shippingMemo:false, adminMemo:false, pointOrder:false, coupon:false, escrow:false,
  },
  {
    id: 3, orderNo: "25010716241290", orderAt: "2025-01-07 16:25", isTest:false,
    thumb: "https://via.placeholder.com/40x40.png?text=O",
    name: "테스트 상품 스몰 체리 롱 슬리브 티셔츠", qty: 1, amount: 89000, shipFee: 0,
    status: "주문완료", seller: "본사", buyer: "관리자", receiver: "관리자",
    payMethod: "무통장", franchise: "본사",
    confirm: true,
    taxInvoice: false, cashReceipt:false, shippingMemo:false, adminMemo:false, pointOrder:false, coupon:false, escrow:false,
  },
];

export default function OrdersPage() {
  const [sp] = useSearchParams();

  // 검색 상태
  const [kwType, setKwType] = useState("주문번호"); // 주문번호 | 주문자 | 수령자 | 상품명
  const [kw, setKw] = useState("");

  const [dateType, setDateType] = useState("주문일"); // 주문일/결제일 등
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [payMethod, setPayMethod] = useState("전체");
  const [status, setStatus] = useState("전체");
  const [confirm, setConfirm] = useState("전체");
  const [extras, setExtras] = useState({
    taxInvoice:false, cashReceipt:false, shippingMemo:false,
    adminMemo:false, pointOrder:false, coupon:false, escrow:false
  });

  const [pageSize, setPageSize] = useState(30);
  const [checked, setChecked] = useState(new Set());

  // URL ?status=shipping 같은 쿼리로 들어오면 초기값 맞춤(선택)
  useEffect(() => {
    const st = sp.get("status");
    if (!st) return;
    const map = {
      waiting:"입금대기", paid:"입금완료", ready:"배송준비", shipping:"배송중",
      done:"배송완료", cancel:"취소", refund:"환불", return:"반품", exchange:"교환"
    };
    if (map[st]) setStatus(map[st]);
  }, [sp]);

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
    return MOCK.filter(o => {
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
        const base = o.orderAt; // dateType에 따라 바꿀 수 있음(결제일 등)
        const ts = new Date(base.replace(" ","T"));
        if (from && ts < new Date(from+"T00:00:00")) return false;
        if (to && ts > new Date(to+"T23:59:59")) return false;
      }
      // 결제수단
      if (payMethod !== "전체" && o.payMethod !== payMethod) return false;
      // 주문상태
      if (status !== "전체" && o.status !== status) return false;
      // 구매확정
      if (confirm !== "전체") {
        const want = confirm === "구매확정";
        if (o.confirm !== want) return false;
      }
      // 기타선택(체크된 항목만 필터 적용)
      for (const k of Object.keys(extras)) {
        if (extras[k] && !o[k]) return false;
      }
      return true;
    });
  }, [kw, kwType, from, to, payMethod, status, confirm, extras]);

  const totalAmount = useMemo(
    () => filtered.reduce((s,o)=> s + (Number(o.amount||0) + Number(o.shipFee||0)), 0),
    [filtered]
  );

  const reset = () => {
    setKwType("주문번호"); setKw("");
    setDateType("주문일"); setFrom(""); setTo("");
    setPayMethod("전체"); setStatus("전체"); setConfirm("전체");
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

  return (
    <div className="container-fluid py-3">
      <h4 className="fw-semibold mb-3">주문리스트(전체)</h4>

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
              <select className="form-select" value={dateType} onChange={(e)=>setDateType(e.target.value)}>
                <option>주문일</option>
                <option>결제일</option>
              </select>
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

          {/* 주문상태 */}
          <div className="row g-3 align-items-center mb-2">
            <div className="col-12 col-md-2"><span className="fw-semibold">주문상태</span></div>
            <div className="col">
              <div className="d-flex flex-wrap gap-3">
                {STATUSES.map(v=>(
                  <label className="form-check" key={v}>
                    <input className="form-check-input" type="radio" name="status" checked={status===v} onChange={()=>setStatus(v)} /> <span className="ms-1">{v}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 구매확정 */}
          <div className="row g-3 align-items-center mb-2">
            <div className="col-12 col-md-2"><span className="fw-semibold">구매확정</span></div>
            <div className="col">
              <div className="d-flex flex-wrap gap-3">
                {CONFIRM.map(v=>(
                  <label className="form-check" key={v}>
                    <input className="form-check-input" type="radio" name="confirm" checked={confirm===v} onChange={()=>setConfirm(v)} /> <span className="ms-1">{v}</span>
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
          <button className="btn btn-outline-secondary btn-sm">주문서출력</button>
          <button className="btn btn-outline-secondary btn-sm">선택 엑셀저장</button>
          <button className="btn btn-outline-secondary btn-sm">검색결과 엑셀저장</button>
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
              <th style={{width:90}}>주문상태</th>
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
              <tr><td colSpan={16} className="text-center text-muted py-4">검색 결과가 없습니다.</td></tr>
            ) : (
              filtered.slice(0, pageSize).map(o=>(
                <tr key={o.id}>
                  <td className="text-center">
                    <input type="checkbox" checked={checked.has(o.id)} onChange={()=>toggleOne(o.id)} />
                  </td>
                  <td className="text-center">{o.id}</td>
                  <td className="text-center">
                    <div>{o.orderAt}</div>
                    {o.isTest && <div className="text-danger small fw-semibold">테스트</div>}
                  </td>
                  <td className="text-primary fw-semibold">{o.orderNo}</td>
                  <td className="text-center">
                    <img src={o.thumb} alt="" width={40} height={40} style={{objectFit:"cover"}}/>
                  </td>
                  <td>{o.name}</td>
                  <td className="text-center">{o.qty}</td>
                  <td className="text-end">{Number(o.amount||0).toLocaleString()}</td>
                  <td className="text-end">{Number(o.shipFee||0).toLocaleString()}</td>
                  <td className="text-center">{o.status}</td>
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