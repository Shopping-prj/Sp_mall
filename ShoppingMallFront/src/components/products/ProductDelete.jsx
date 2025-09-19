import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const API_BASE = (process.env.REACT_APP_API_BASE_URL || "").replace(/\/$/, "");

export default function ProductDelete() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  // 검색 상태: 상품 ID만 지원
  const [searchValue, setSearchValue] = useState(sp.get("q") || "");

  // 상태
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [product, setProduct] = useState(null);
  const [confirmText, setConfirmText] = useState("");

  // 모달 상태
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (sp.get("q")) fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProduct = async () => {
    const q = searchValue.trim();
    if (!q) {
      setAlert({ type: "warning", msg: "상품 ID를 입력하세요." });
      return;
    }
    setLoading(true);
    setAlert(null);
    setProduct(null);
    try {
      const url = `${API_BASE}/api/admin/products/${encodeURIComponent(q)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`조회 실패 (${res.status})`);
      const data = await res.json(); // AdminProduct 객체 기대
      setProduct(data);
      setConfirmText("");
      setAlert({ type: "success", msg: "상품 정보를 불러왔습니다." });
    } catch (err) {
      setAlert({
        type: "danger",
        msg: err.message || "상품 조회 중 오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  const canDelete =
    !!product &&
    (confirmText.trim().toLowerCase() ===
      (product?.p_title || "").toLowerCase() ||
      confirmText.trim().toLowerCase() ===
        (product?.p_productId || "").toLowerCase());

  const handleDelete = async () => {
    if (!product?.p_productId) return;
    if (!canDelete) {
      setAlert({ type: "warning", msg: "확인 입력이 올바르지 않습니다." });
      return;
    }
    setLoading(true);
    setAlert(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/products/${encodeURIComponent(
          product.p_productId
        )}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `삭제 실패 (${res.status})`);
      }
      // ✅ 성공 시 모달 오픈
      setShowModal(true);
    } catch (err) {
      setAlert({
        type: "danger",
        msg: err.message || "삭제 중 오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/admin/product"); // 확인 클릭 시 이동
  };

  return (
    <div className="container-fluid py-3">
      {/* 헤더 */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-1 fw-semibold">상품 삭제</h4>
          <div className="text-muted small">HOME &gt; 상품관리 &gt; 상품 삭제</div>
        </div>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/admin/product")}
        >
          목록
        </button>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      {/* 검색 카드 */}
      <div className="card mb-3">
        <div className="card-header fw-semibold">대상 상품 검색</div>
        <div className="card-body">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-6">
              <input
                className="form-control"
                placeholder="상품 ID"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-6 d-flex gap-2">
              <button
                className="btn btn-dark"
                onClick={fetchProduct}
                disabled={loading}
              >
                {loading ? "불러오는 중..." : "불러오기"}
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate("/admin/product")}
              >
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
              <div className="col-sm-4">{product.p_productId}</div>
              <div className="col-sm-2 text-muted">상품명</div>
              <div className="col-sm-4">{product.p_title}</div>
            </div>
            <div className="row mb-2">
              <div className="col-sm-2 text-muted">브랜드</div>
              <div className="col-sm-4">{product.p_brand || "-"}</div>
              <div className="col-sm-2 text-muted">공급사</div>
              <div className="col-sm-4">{product.p_maker || "-"}</div>
            </div>
            <div className="row mb-2">
              <div className="col-sm-2 text-muted">카테고리</div>
              <div className="col-sm-10">
                {[product.p_category1, product.p_category2, product.p_category3, product.p_category4]
                  .filter(Boolean)
                  .join(" > ") || "-"}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-2 text-muted">가격</div>
              <div className="col-sm-10">
                {`판매가 ${Number(product.p_lprice || 0).toLocaleString()} / 시중가 ${
                  product.p_hprice || "-"
                }`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 경고 + 확인 입력 */}
      <div className="alert alert-warning" role="alert">
        <strong>주의:</strong> 삭제는 되돌릴 수 없습니다. 확인을 위해 아래 입력창에{" "}
        <code>{product?.p_title || product?.p_productId || "상품명 또는 상품ID"}</code>{" "}
        을(를) 정확히 입력하세요.
      </div>

      <div className="d-flex gap-2">
        <input
          className="form-control"
          placeholder={product?.p_title || product?.p_productId || "상품명 또는 상품ID 입력"}
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          disabled={!product}
        />
        <button
          className="btn btn-danger text-nowrap"
          style={{ height: "calc(2.375rem + 2px)" }} // input 기본 높이
          onClick={handleDelete}
          disabled={!canDelete || loading}
        >
          {loading ? "삭제 중..." : "상품 삭제"}
        </button>
      </div>

      {/* ✅ 삭제 완료 모달 */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>삭제 완료</Modal.Title>
        </Modal.Header>
        <Modal.Body>상품이 성공적으로 삭제되었습니다.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleModalClose}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
