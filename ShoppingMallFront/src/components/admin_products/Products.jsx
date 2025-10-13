import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = (process.env.REACT_APP_SPRING_IP || "/proxy").replace(/\/$/, "") + "/api/admin/products";

export default function ProductsPage() {
  const nav = useNavigate();

  // 서버 데이터
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // 검색 상태
  const [kwType, setKwType] = useState("상품명"); // 상품명 | 상품코드 | 공급사
  const [kw, setKw] = useState("");

  const [cat1, setCat1] = useState("");
  const [cat2, setCat2] = useState("");
  const [cat3, setCat3] = useState("");
  const [cat4, setCat4] = useState("");
  const [cat5, setCat5] = useState("");

  const [dateType, setDateType] = useState("최근수정일");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [brand, setBrand] = useState("전체");
  const [region, setRegion] = useState("전체");

  const [stockMin, setStockMin] = useState("");
  const [stockMax, setStockMax] = useState("");

  const [priceKind, setPriceKind] = useState("price"); // price|cost|msrp
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const [display, setDisplay] = useState("전체"); // 전체|진열|품절|단종|중지
  const [requiredOpt, setRequiredOpt] = useState("전체"); // 전체|사용|미사용
  const [extraOpt, setExtraOpt] = useState("전체"); // 전체|사용|미사용

  const [pageSize, setPageSize] = useState(30);
  const [checked, setChecked] = useState(new Set());
  const token = localStorage.getItem("accessToken");


  // 🔹 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const goPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
  };

  // 1) 서버 호출 + 매핑
  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(API_URL, { 
          method: "GET", 
          headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
          }, 
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // 백엔드 -> 프론트 테이블 필드 매핑
        const mapped = (data || []).map((p, i) => ({
          id: p.p_productId,                                // PK
          thumb: p.p_image || "https://via.placeholder.com/48x48.png?text=P",
          code: p.p_productId,                               // 코드로 동일 사용
          supplier: p.p_maker || "—",                        // 없으면 대시
          name: p.p_title || "",
          categoryPath: [p.p_category1, p.p_category2, p.p_category3, p.p_category4]
            .filter(Boolean).join(" > "),
          brand: p.p_brand || "—",
          region: "전체",                                    // 백엔드에 없으므로 기본값
          createdAt: "",                                     // 백엔드에 없으면 공란
          firstListedAt: "",
          display: "진열",
          stock: Number(p.stock ?? 0),                       // 백엔드에 없다면 0
          msrp: Number(p.p_hprice ?? 0),                     // 시중가: high price 가정
          cost: 0,                                           // 공급가 정보 없으면 0
          price: Number(p.p_lprice ?? 0),                    // 판매가: low price 가정
          point: 0,                                          // 포인트 정보 없으면 0
          _order: i,                                         // 정렬 보조
        }));
        setRows(mapped);
        
      } catch (e) {
        console.error(e);
        setErr("상품 목록을 불러오지 못했습니다.");

      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  // 브랜드 셀렉트 옵션 (서버 데이터 기반)
  const brandsFromData = useMemo(() => {
    return ["전체", ...Array.from(new Set(rows.map(p => p.brand).filter(Boolean)))];
  }, [rows]);

  const regions = ["전체", "전국", "서울/경기", "강원", "충청", "전라", "경상", "제주"];
  const priceTypes = [
    { key: "price", label: "판매가격" },
    { key: "cost", label: "공급가" },
    { key: "msrp", label: "시중가" },
  ];

  // 2) 필터
  const filtered = useMemo(() => {
    const byKeyword = (p) => {
      if (!kw.trim()) return true;
      const t = kw.toLowerCase();
      if (kwType === "상품명") return (p.name || "").toLowerCase().includes(t);
      if (kwType === "상품코드") return (p.code || "").toLowerCase().includes(t);
      if (kwType === "공급사") return (p.supplier || "").toLowerCase().includes(t);
      return true;
    };
    const byCategory = (p) => {
      const path = p.categoryPath || "";
      const segs = [cat1, cat2, cat3, cat4, cat5].filter(Boolean);
      if (!segs.length) return true;
      return segs.every(s => path.includes(s));
    };
    const byDate = (p) => {
      if (!from && !to) return true;
      const base = dateType.includes("등록") ? p.firstListedAt : p.createdAt;
      if (!base) return false;
      const ts = new Date(base);
      if (from && ts < new Date(from + "T00:00:00")) return false;
      if (to && ts > new Date(to + "T23:59:59")) return false;
      return true;
    };
    const byBrand = (p) => (brand === "전체" ? true : p.brand === brand);
    const byRegion = (p) => (region === "전체" ? true : p.region === region);
    const byStock = (p) => {
      const n = Number.isFinite(p.stock) ? p.stock : 0;
      if (stockMin !== "" && n < Number(stockMin)) return false;
      if (stockMax !== "" && n > Number(stockMax)) return false;
      return true;
    };
    const byPrice = (p) => {
      const val = p[priceKind] ?? 0;
      if (priceMin !== "" && val < Number(priceMin)) return false;
      if (priceMax !== "" && val > Number(priceMax)) return false;
      return true;
    };
    const byDisplay = (p) => (display === "전체" ? true : (p.display || "").includes(display));
    const byReqOpt = (p) => (requiredOpt === "전체" ? true : requiredOpt === "사용" ? p.requiredOption : !p.requiredOption);
    const byExtraOpt = (p) => (extraOpt === "전체" ? true : extraOpt === "사용" ? p.extraOption : !p.extraOption);

    return rows
      .filter(p =>
        byKeyword(p) &&
        byCategory(p) &&
        byDate(p) &&
        byBrand(p) &&
        byRegion(p) &&
        byStock(p) &&
        byPrice(p) &&
        byDisplay(p) &&
        byReqOpt(p) &&
        byExtraOpt(p)
      );
  }, [
    rows,
    kwType, kw, cat1, cat2, cat3, cat4, cat5,
    dateType, from, to, brand, region,
    stockMin, stockMax, priceKind, priceMin, priceMax,
    display, requiredOpt, extraOpt
  ]);

  // 🔹 총 페이지/현재 페이지 슬라이스
  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / pageSize)), [filtered.length, pageSize]);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageRows = filtered.slice(start, end);

  // 🔹 페이지 관련 리셋 (검색/필터/페이지크기 바뀌면 1페이지로)
  useEffect(() => { setCurrentPage(1); }, [pageSize]);
  useEffect(() => {
    setCurrentPage(1);
  }, [
    kw, kwType, cat1, cat2, cat3, cat4, cat5,
    brand, region, stockMin, stockMax,
    priceKind, priceMin, priceMax,
    display, requiredOpt, extraOpt, from, to, dateType
  ]);

  const reset = () => {
    setKw(""); setKwType("상품명");
    setCat1(""); setCat2(""); setCat3(""); setCat4(""); setCat5("");
    setDateType("최근수정일"); setFrom(""); setTo("");
    setBrand("전체"); setRegion("전체");
    setStockMin(""); setStockMax("");
    setPriceKind("price"); setPriceMin(""); setPriceMax("");
    setDisplay("전체"); setRequiredOpt("전체"); setExtraOpt("전체");
    setChecked(new Set());
    setCurrentPage(1);
  };

  const quickDate = (range) => {
    const today = new Date();
    const fmt = (d) => d.toISOString().slice(0, 10);
    if (range === "오늘") { setFrom(fmt(today)); setTo(fmt(today)); return; }
    if (range === "어제") { const y = new Date(today); y.setDate(y.getDate() - 1); setFrom(fmt(y)); setTo(fmt(today)); return; }
    if (range === "일주일") { const s = new Date(today); s.setDate(s.getDate() - 7); setFrom(fmt(s)); setTo(fmt(today)); return; }
    if (range === "지난달") { const s = new Date(today.getFullYear(), today.getMonth() - 1, 1); const e = new Date(today.getFullYear(), today.getMonth(), 0); setFrom(fmt(s)); setTo(fmt(e)); return; }
    if (range === "1개월") { const s = new Date(today); s.setMonth(s.getMonth() - 1); setFrom(fmt(s)); setTo(fmt(today)); return; }
    if (range === "3개월") { const s = new Date(today); s.setMonth(s.getMonth() - 3); setFrom(fmt(s)); setTo(fmt(today)); return; }
    if (range === "전체") { setFrom(""); setTo(""); return; }
  };

  // ✅ 현재 페이지 기준 전체선택
  const toggleAll = (e) => {
    if (e.target.checked) setChecked(new Set(pageRows.map(p => p.id)));
    else setChecked(new Set());
  };
  const allChecked = pageRows.length > 0 && pageRows.every(p => checked.has(p.id));

  const toggleOne = (id) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const brandsOptions = brandsFromData;

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0 fw-semibold">전체 상품관리</h4>
        <Link className="btn btn-danger" to="/admin/product/add">+ 상품등록</Link>
      </div>

      {/* 로딩/에러 */}
      {loading && <div className="alert alert-info">불러오는 중…</div>}
      {err && <div className="alert alert-danger">{err}</div>}

      {/* 기본검색 */}
      <div className="card mb-3">
        <div className="card-header fw-semibold">기본검색</div>
        <div className="card-body">
          {/* 검색어 */}
          <div className="row g-2 align-items-center mb-2">
            <div className="col-12 col-md-2"><span className="fw-semibold">검색어</span></div>
            <div className="col-6 col-md-2">
              <select className="form-select" value={kwType} onChange={(e)=>setKwType(e.target.value)}>
                <option>상품명</option><option>상품코드</option><option>공급사</option>
              </select>
            </div>
            <div className="col-6 col-md-6">
              <input className="form-control" value={kw} onChange={(e)=>setKw(e.target.value)} placeholder="검색어 입력" />
            </div>
          </div>

          {/* 카테고리 */}
          <div className="row g-2 align-items-center mb-2">
            <div className="col-12 col-md-2"><span className="fw-semibold">카테고리</span></div>
            <div className="col">
              <div className="d-flex flex-wrap gap-2">
                <select className="form-select" value={cat1} onChange={(e)=>{setCat1(e.target.value); setCat2(""); setCat3(""); setCat4(""); setCat5("");}} style={{maxWidth:180}}>
                  <option value="">= 카테고리선택 =</option>
                  <option>가전/디지털/컴퓨터</option>
                </select>
                {/* <select className="form-select" value={cat2} onChange={(e)=>{setCat2(e.target.value); setCat3(""); setCat4(""); setCat5("");}} style={{maxWidth:180}}>
                  <option value="">= 카테고리선택 =</option>
                  <option>노트북/PC</option>
                  <option>티셔츠</option>
                  <option>티 외 1건</option>
                </select> */}
                {/* <select className="form-select" value={cat3} onChange={(e)=>setCat3(e.target.value)} style={{maxWidth:180}}>
                  <option value="">= 카테고리선택 =</option>
                </select>
                <select className="form-select" value={cat4} onChange={(e)=>setCat4(e.target.value)} style={{maxWidth:180}}>
                  <option value="">= 카테고리선택 =</option>
                </select>
                <select className="form-select" value={cat5} onChange={(e)=>setCat5(e.target.value)} style={{maxWidth:180}}>
                  <option value="">= 카테고리선택 =</option>
                </select> */}
              </div>
            </div>
          </div>

          {/* 기간/브랜드/지역 */}
          <div className="row g-2 align-items-center mb-2">
            <div className="col-12 col-md-2"><span className="fw-semibold">기간검색</span></div>
            <div className="col-12 col-md-2">
              <select className="form-select" value={dateType} onChange={(e)=>setDateType(e.target.value)}>
                <option>최근수정일</option>
                <option>최초등록일</option>
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
                <button key={lbl} type="button" className="btn btn-outline-secondary btn-sm" onClick={()=>quickDate(lbl)}>{lbl}</button>
              ))}
            </div>
          </div>

          <div className="row g-2 align-items-center mb-2">
            <div className="col-12 col-md-2"><span className="fw-semibold">브랜드</span></div>
            <div className="col-12 col-md-2">
              <select className="form-select" value={brand} onChange={(e)=>setBrand(e.target.value)}>
                {brandsFromData.map(b=><option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-2 text-md-end"><span className="fw-semibold">배송가능 지역</span></div>
            <div className="col-12 col-md-2">
              <select className="form-select" value={region} onChange={(e)=>setRegion(e.target.value)}>
                {regions.map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* 재고/가격/옵션 */}
          <div className="row g-2 align-items-center mb-2">
            <div className="col-12 col-md-2"><span className="fw-semibold">상품재고</span></div>
            <div className="col-12 col-md-4 d-flex align-items-center gap-2">
              <span className="text-muted small">재고수량</span>
              <input className="form-control" style={{maxWidth:120}} placeholder="개 이상~" value={stockMin} onChange={(e)=>setStockMin(e.target.value.replace(/\D/g,''))}/>
              <input className="form-control" style={{maxWidth:120}} placeholder="개 이하" value={stockMax} onChange={(e)=>setStockMax(e.target.value.replace(/\D/g,''))}/>
            </div>

            <div className="col-12 col-md-2 text-md-end"><span className="fw-semibold">상품가격</span></div>
            <div className="col-12 col-md-4 d-flex align-items-center gap-2">
              <select className="form-select" style={{maxWidth:140}} value={priceKind} onChange={(e)=>setPriceKind(e.target.value)}>
                {priceTypes.map(t=><option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
              <input className="form-control" style={{maxWidth:140}} placeholder="원 이상~" value={priceMin} onChange={(e)=>setPriceMin(e.target.value.replace(/\D/g,''))}/>
              <input className="form-control" style={{maxWidth:140}} placeholder="원 이하" value={priceMax} onChange={(e)=>setPriceMax(e.target.value.replace(/\D/g,''))}/>
            </div>
          </div>

          <div className="row g-2 align-items-center mb-2">
            <div className="col-12 col-md-2"><span className="fw-semibold">판매여부</span></div>
            <div className="col-12 col-md-4 d-flex gap-3">
              {["전체","진열","품절","단종","중지"].map(v=>(
                <label className="form-check" key={v}>
                  <input className="form-check-input" type="radio" name="display" checked={display===v} onChange={()=>setDisplay(v)}/> <span className="ms-1">{v}</span>
                </label>
              ))}
            </div>

            <div className="col-12 col-md-2 text-md-end"><span className="fw-semibold">필수옵션</span></div>
            <div className="col-12 col-md-4 d-flex gap-3">
              {["전체","사용","미사용"].map(v=>(
                <label className="form-check" key={v}>
                  <input className="form-check-input" type="radio" name="reqopt" checked={requiredOpt===v} onChange={()=>setRequiredOpt(v)}/> <span className="ms-1">{v}</span>
                </label>
              ))}
              <span className="ms-3 fw-semibold">추가옵션</span>
              {["전체","사용","미사용"].map(v=>(
                <label className="form-check" key={"ex-"+v}>
                  <input className="form-check-input" type="radio" name="exopt" checked={extraOpt===v} onChange={()=>setExtraOpt(v)}/> <span className="ms-1">{v}</span>
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
        <div className="small text-muted">전체 : {filtered.length}건 / 페이지 {currentPage} / {totalPages}</div>
        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select form-select-sm"
            style={{width: 110}}
            value={pageSize}
            onChange={(e)=>setPageSize(Number(e.target.value))}
          >
            {[30,50,100].map(n=><option key={n}>{n}</option>)}
          </select>
          <button className="btn btn-outline-secondary btn-sm">선택삭제</button>
          <button className="btn btn-outline-secondary btn-sm">선택상태수정</button>
          <button className="btn btn-outline-secondary btn-sm">선택상품복사</button>
          <button className="btn btn-outline-secondary btn-sm">엑셀업로드</button>
        </div>
      </div>

      {/* 리스트 */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr className="text-center">
              <th style={{width: 36}}>
                <input type="checkbox" onChange={toggleAll} checked={allChecked}/>
              </th>
              <th style={{width: 70}}>번호</th>
              <th style={{width: 80}}>이미지</th>
              <th>상품코드<br/><span className="text-muted small">업체코드</span></th>
              <th>공급사명</th>
              <th>상품명</th>
              <th>카테고리</th>
              <th style={{width: 110}}>최초등록일</th>
              <th style={{width: 70}}>진열</th>
              <th style={{width: 90}}>시중가</th>
              <th style={{width: 90}}>공급가</th>
              <th style={{width: 90}}>판매가</th>
              <th style={{width: 80}}>포인트</th>
              <th style={{width: 80}}>재고</th>
              <th style={{width: 90}}>관리</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr><td colSpan={15} className="text-center text-muted py-4">검색 결과가 없습니다.</td></tr>
            ) : (
              pageRows.map((p) => (
                <tr key={p.id}>
                  <td className="text-center">
                    <input type="checkbox" checked={checked.has(p.id)} onChange={()=>toggleOne(p.id)} />
                  </td>
                  <td className="text-center">{p.id}</td>
                  <td className="text-center">
                    <img src={p.thumb} alt="" width={48} height={48} style={{objectFit:"cover"}}/>
                  </td>
                  <td>
                    <div>{p.code}</div>
                    <div className="text-success small">{p.supplier}</div>
                  </td>
                  <td>{p.supplier}</td>
                  <td>
                    <Link to={`/admin/product/info?id=${p.id}`} className="text-decoration-none">{p.name}</Link>
                  </td>
                  <td className="text-muted small">{p.categoryPath}</td>
                  <td className="text-center">{p.firstListedAt}</td>
                  <td className="text-center">{p.display}</td>
                  <td className="text-end">{p.msrp.toLocaleString?.() ?? p.msrp}</td>
                  <td className="text-end">{p.cost.toLocaleString?.() ?? p.cost}</td>
                  <td className="text-end">{p.price.toLocaleString?.() ?? p.price}</td>
                  <td className="text-end">{p.point.toLocaleString?.() ?? p.point}</td>
                  <td className="text-end">{p.stock}</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-secondary"
                      onClick={()=>nav(`/admin/product/update?id=${p.id}`)}>수정</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 페이지네이션 버튼 */}
      <div className="d-flex justify-content-center my-3">
        <nav aria-label="Product pagination">
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => goPage(currentPage - 1)}>이전</button>
            </li>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              // 페이지가 많아지면 주변만 보이게 자르고 싶으면 여기서 로직 확장 가능
              return (
                <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                  <button className="page-link" onClick={() => goPage(page)}>{page}</button>
                </li>
              );
            })}

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => goPage(currentPage + 1)}>다음</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}