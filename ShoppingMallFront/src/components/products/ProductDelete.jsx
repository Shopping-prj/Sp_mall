import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_BASE = (process.env.REACT_APP_API_BASE_URL || "").replace(/\/$/, "");

export default function ProductDelete() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  // 검색 상태
  const [searchType, setSearchType] = useState(sp.get("type") === "id" ? "id" : "code"); // id | code
  const [searchValue, setSearchValue] = useState(sp.get("q") || "");

  // 상태
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [product, setProduct] = useState(null);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    if (sp.get("q")) fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProduct = async () => {
    const q = searchValue.trim();
    if (!q) {
      setAlert({ type: "warning", msg: "검색값을 입력하세요." });
      return;
    }
    setLoading(true);
    setAlert(null);
    setProduct(null);
    try {
      let url = "";
      if (searchType === "id") {
        url = `${API_BASE}/api/admin/products/${encodeURIComponent(q)}`; // by id
      } else {
        url = `${API_BASE}/api/admin/products?code=${encodeURIComponent(q)}`; // by code
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error(`조회 실패 (${res.status})`);
      const data = await res.json(); // 단건 객체 기대
      setProduct(data);
      setConfirmText("");
      setAlert({ type: "success", msg: "상품 정보를 불러왔습니다." });
    } catch (err) {
      setAlert({ type: "danger", msg: err.message || "상품 조회 중 오류가 발생했습니다." });
    } finally {
      setLoading(false);
    }
  };

  const canDelete =
    !!product &&
    (confirmText.trim().toLowerCase() === (product?.name || "").toLowerCase() ||
     confirmText.trim().toLowerCase() === (product?.code || "").toLowerCase());

  const handleDelete = async () => {
    if (!product?.id) return;
    if (!canDelete) {
      setAlert({ type: "warning", msg: "확인 입력이 올바르지 않습니다." });
      return;
    }
    setLoading(true);
    setAlert(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/products/${encodeURIComponent(product.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `삭제 실패 (${res.status})`);
      }
      setAlert({ type: "success", msg: "상품이 삭제되었습니다." });
      setTimeout(() => navigate("/admin/product/all"), 500);
    } catch (err) {
      setAlert({ type: "danger", msg: err.message || "삭제 중 오류가 발생했습니다." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-3">
      {/* 헤더 */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-1 fw-semibold">상품 삭제</h4>
          <div className="text-muted small">HOME &gt; 상품관리 &gt; 상품 삭제</div>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/admin/product/all")}>
          목록
        </button>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      {/* 검색 카드 */}
      <div className="card mb-3">
        <div className="card-header fw-semibold">대상 상품 검색</div>
        <div className="card-body">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-2">
              <select className="form-select" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                <option value="code">상품코드로</option>
                <option value="id">상품 ID로</option>
              </select>
            </div>
            <div className="col-12 col-md-6">
              <input
                className="form-control"
                placeholder={searchType === "id" ? "상품 ID" : "상품코드"}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4 d-flex gap-2">
              <button className="btn btn-dark" onClick={fetchProduct} disabled={loading}>
                {loading ? "불러오는 중..." : "불러오기"}
              </button>
              <button className="btn btn-outline-secondary" onClick={() => navigate("/admin/product/all")}>
                목록
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 상품 요약 */}
      {product && (
        <div className="card mb-3">
          <div className="card-header fw-semibold">상품 정보</div>
          <div className="card-body">
            <div className="row mb-2">
              <div className="col-sm-2 text-muted">상품 ID</div>
              <div className="col-sm-4">{product.id}</div>
              <div className="col-sm-2 text-muted">상품코드</div>
              <div className="col-sm-4">{product.code || "-"}</div>
            </div>
            <div className="row mb-2">
              <div className="col-sm-2 text-muted">상품명</div>
              <div className="col-sm-10">{product.name}</div>
            </div>
            <div className="row mb-2">
              <div className="col-sm-2 text-muted">공급사</div>
              <div className="col-sm-4">{product.supplier || "-"}</div>
              <div className="col-sm-2 text-muted">브랜드</div>
              <div className="col-sm-4">{product.brand || "-"}</div>
            </div>
            <div className="row mb-2">
              <div className="col-sm-2 text-muted">카테고리</div>
              <div className="col-sm-10">{product.categoryPath || "-"}</div>
            </div>
            <div className="row">
              <div className="col-sm-2 text-muted">가격/재고</div>
              <div className="col-sm-10">
                {`판매가 ${Number(product.price||0).toLocaleString()} / 공급가 ${Number(product.cost||0).toLocaleString()} / 재고 ${product.stock ?? 0}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 경고 + 확인 입력 */}
      <div className="alert alert-warning" role="alert">
        <strong>주의:</strong> 삭제는 되돌릴 수 없습니다. 확인을 위해 아래 입력창에{" "}
        <code>{product?.name || product?.code || "상품명(또는 상품코드)"}</code> 을(를) 정확히 입력하세요.
      </div>

      <div className="d-flex gap-2">
        <input
          className="form-control"
          placeholder={product?.name || product?.code || "상품명 또는 상품코드를 입력해 확인"}
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          disabled={!product}
        />
        <button className="btn btn-danger" onClick={handleDelete} disabled={!canDelete || loading}>
          {loading ? "삭제 중..." : "상품 삭제"}
        </button>
      </div>
    </div>
  );
}