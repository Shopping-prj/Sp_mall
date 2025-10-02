import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ▶ API base (프록시 사용 시 "/proxy")
//   예) REACT_APP_SPRING_IP=http://localhost:8080
const API_BASE    = (process.env.REACT_APP_SPRING_IP || "/proxy").replace(/\/$/, "");
const PRODUCTS_URL = `${API_BASE}/api/admin/products`;
const REFRESH_URL  = `${API_BASE}/api/users/refresh`;

const PAGE_SIZE = 20; // ✅ 한 페이지 20개

export default function Products() {
  const nav = useNavigate();

  // 검색 상태
  const [kwType, setKwType] = useState("상품명"); // 상품명 | 상품코드 | 공급사
  const [kw, setKw]         = useState("");
  const [cat1, setCat1]     = useState("");      // 1뎁스 카테고리 (셀렉트 한 개)

  // 데이터/상태
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert]     = useState(null); // {type,msg}
  const [debugMsg, setDebugMsg] = useState(""); // JSON이 아니면 본문 일부 표시

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);

  // 진행 중 요청 취소용
  const abortRef = useRef(null);

  // 공통 fetch (Authorization + 401 → refresh 재시도)
  const apiFetch = async (url, options = {}) => {
    const accessToken  = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    // 이전 요청 중이면 취소
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const merged = {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Pragma": "no-cache",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        ...(options.headers || {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    };

    let res = await fetch(url, merged);

    // 401이면 refresh 시도
    if (res.status === 401 && refreshToken) {
      try {
        const r = await fetch(REFRESH_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
        if (r.ok) {
          const { accessToken: newToken } = await r.json();
          if (newToken) localStorage.setItem("accessToken", newToken);

          const retry = {
            ...merged,
            headers: { ...merged.headers, Authorization: `Bearer ${newToken}` },
          };
          res = await fetch(url, retry);
        }
      } catch (e) {
        // refresh 실패 시 그대로 내려가서 에러 처리
      }
    }
    return res;
  };

  // JSON 안전 파서 (HTML 등 오면 본문 일부를 debug에 노출)
  const parseJsonStrict = async (res) => {
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (!ct.includes("application/json")) {
      const text = await res.text();
      setDebugMsg(`응답 Content-Type: ${ct}\n상태: ${res.status}\n본문 일부:\n${text.slice(0, 400)}...`);
      throw new Error(`API ${res.status} (JSON 아님)`);
    }
    return res.json();
  };

  const fetchProducts = async () => {
    setLoading(true);
    setAlert(null);
    setDebugMsg("");
    try {
      // 캐시 버스터
      const url = `${PRODUCTS_URL}?_=${Date.now()}`;
      const res = await apiFetch(url, { method: "GET" });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        setDebugMsg(`상태: ${res.status}\n본문 일부:\n${body.slice(0, 400)}...`);
        throw new Error(`조회 실패 (${res.status})`);
      }

      const data = await parseJsonStrict(res);

      // 백엔드 → 프론트 매핑
      const mapped = (data || []).map((p, i) => {
        const id    = p.p_productId ?? p.productId ?? p.id ?? i + 1;
        const code  = p.p_productId ?? p.code ?? id;
        const name  = p.p_title ?? p.name ?? "";
        const img   = p.p_image ?? p.imageUrl ?? "";
        const supp  = p.p_maker ?? p.supplier ?? "—";
        const cat   = [p.p_category1, p.p_category2, p.p_category3, p.p_category4]
          .filter(Boolean).join(" > ") || p.category || "";
        const price = Number(p.p_lprice ?? p.price ?? 0);

        return { id, code, name, img, supp, cat, price };
      });

      setRows(mapped);
      setAlert({ type: "success", msg: `총 ${mapped.length}건` });
      setCurrentPage(1); // 새로 불러오면 1페이지로
    } catch (e) {
      console.error(e);
      setRows([]);
      setAlert({ type: "danger", msg: e.message || "목록을 불러오지 못했습니다." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 상세 저장 후 돌아왔을 때 강제 새로고침 플래그 대응
    if (sessionStorage.getItem("PRODUCTS_SHOULD_REFRESH") === "1") {
      sessionStorage.removeItem("PRODUCTS_SHOULD_REFRESH");
      fetchProducts();
    } else {
      fetchProducts();
    }
    // 언마운트 시 진행중 요청 취소
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 필터 + 페이지네이션
  const filtered = useMemo(() => {
    const t = kw.trim().toLowerCase();
    return rows.filter((r) => {
      const byKw =
        !t ||
        (kwType === "상품명"   && (r.name || "").toLowerCase().includes(t)) ||
        (kwType === "상품코드" && String(r.code ?? "").toLowerCase().includes(t)) ||
        (kwType === "공급사"   && (r.supp || "").toLowerCase().includes(t));
      const byCat = !cat1 || (r.cat || "").includes(cat1);
      return byKw && byCat;
    });
  }, [rows, kwType, kw, cat1]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageStart  = (currentPage - 1) * PAGE_SIZE;
  const pageRows   = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  // 검색/필터 바뀌면 1페이지로
  useEffect(() => { setCurrentPage(1); }, [kwType, kw, cat1]);

  // 페이지 버튼 묶음
  const pageWindow = 7;
  let startPage = Math.max(1, currentPage - Math.floor(pageWindow / 2));
  let endPage   = Math.min(totalPages, startPage + pageWindow - 1);
  startPage     = Math.max(1, endPage - pageWindow + 1);
  const pages = [];
  for (let p = startPage; p <= endPage; p++) pages.push(p);

  return (
    <div className="container-fluid py-3 prod-page">
      {/* 강제 스타일 */}
      <style>{`
        .prod-page .search-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
        .prod-page .input-tall{height:52px}
        .prod-page .btn-tall{height:52px;padding:0 16px;line-height:50px}
        .prod-page .select-tall{height:52px}
        .prod-page .search-input{width:300px;max-width:48vw}
        .prod-page table{table-layout:fixed}
        .prod-page th,.prod-page td{vertical-align:middle;white-space:nowrap}
        .prod-page thead th{text-align:center}
        .prod-page .col-no{width:70px}
        .prod-page .col-img{width:80px}
        .prod-page .col-code{width:140px}
        .prod-page .col-supp{width:160px}
        .prod-page .col-name{width:auto;white-space:normal}
        .prod-page .col-cat{width:320px;white-space:normal}
        .prod-page .col-price{width:120px}
        .prod-page .col-act{width:90px}
        .prod-page .debug-box{white-space:pre-wrap;background:#f8f9fa;border:1px dashed #ced4da;border-radius:6px;padding:10px}
      `}</style>

      <h5 className="fw-bold mb-3">전체 상품관리</h5>

      {/* 검색 카드 */}
      <div className="card mb-3">
        <div className="card-header fw-semibold">기본검색</div>
        <div className="card-body">
          {/* 1줄: 검색어 */}
          <div className="search-row mb-2">
            <select
              className="form-select select-tall"
              style={{ width: 110 }}
              value={kwType}
              onChange={(e) => setKwType(e.target.value)}
              disabled={loading}
            >
              <option>상품명</option>
              <option>상품코드</option>
              <option>공급사</option>
            </select>

            <input
              className="form-control input-tall search-input"
              placeholder="검색어 입력"
              value={kw}
              onChange={(e) => setKw(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") fetchProducts(); }}
              disabled={loading}
            />

            <button type="button" className="btn btn-dark btn-tall" onClick={fetchProducts} disabled={loading}>
              {loading ? "검색 중..." : "검색"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-tall"
              onClick={() => { setKw(""); setKwType("상품명"); setCat1(""); setCurrentPage(1); }}
              disabled={loading}
            >
              초기화
            </button>
          </div>

          {/* 2줄: 카테고리 (상품명 아래) */}
          <div className="search-row">
            <select
              className="form-select select-tall"
              style={{ width: 220 }}
              value={cat1}
              onChange={(e) => setCat1(e.target.value)}
              disabled={loading}
            >
              <option value="">= 카테고리 선택 =</option>
              <option>패션의류</option>
              <option>패션잡화</option>
              <option>화장품/미용</option>
              <option>식품</option>
              <option>출산/육아</option>
              <option>생활/건강</option>
              <option>디지털/가전</option>
              <option>가구/인테리어</option>
              <option>스포츠/레저</option>
              <option>기타</option>
            </select>
          </div>
        </div>
      </div>

      {/* 로딩/알림/디버그 */}
      {loading && <div className="alert alert-info">불러오는 중…</div>}
      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}
      {debugMsg && (
        <div className="debug-box mb-3">
          <strong>디버그:</strong>
          <br />
          {debugMsg}
        </div>
      )}

      {/* 리스트 */}
      <div className="card">
        <div className="card-body p-0">
          <table className="table table-bordered table-hover align-middle text-start mb-0">
            <thead className="table-light">
              <tr>
                <th className="col-no">번호</th>
                <th className="col-img">이미지</th>
                <th className="col-code">상품코드</th>
                <th className="col-supp">공급사</th>
                <th className="col-name">상품명</th>
                <th className="col-cat">카테고리</th>
                <th className="col-price">판매가</th>
                <th className="col-act">관리</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-4">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                pageRows.map((p, idx) => (
                  <tr key={p.id}>
                    <td className="text-center">{pageStart + idx + 1}</td>
                    <td className="text-center">
                      {p.img ? (
                        <img
                          src={p.img}
                          alt=""
                          width={48}
                          height={48}
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div className="text-muted small">이미지없음</div>
                      )}
                    </td>
                    <td>{p.code}</td>
                    <td>{p.supp}</td>
                    <td className="text-truncate" style={{ maxWidth: 460 }}>{p.name}</td>
                    <td className="text-truncate" style={{ maxWidth: 380 }}>{p.cat}</td>
                    <td className="text-end">{Number(p.price || 0).toLocaleString()}원</td>
                    <td className="text-center">
                      <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => nav(`/admin/product/info?id=${encodeURIComponent(p.id)}`)}
                      >
                        수정
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 하단 페이지네이션 */}
        <div className="card-footer d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="small text-muted">
            전체 {filtered.length.toLocaleString()}건 · 페이지 {currentPage}/{totalPages}
          </div>
          <nav aria-label="Product pagination">
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(1)}>처음</button>
              </li>
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>이전</button>
              </li>

              {pages.map((p) => (
                <li key={p} className={`page-item ${currentPage === p ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p)}>{p}</button>
                </li>
              ))}

              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>다음</button>
              </li>
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(totalPages)}>끝</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
