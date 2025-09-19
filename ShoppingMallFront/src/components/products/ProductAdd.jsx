import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = (process.env.REACT_APP_API_BASE_URL || "/proxy").replace(/\/$/, "");

const initial = {
  name: "",
  code: "",
  supplier: "",
  brand: "",
  link: "",               // 제품 링크
  categoryPath: "",       // 예) 패션의류/잡화 > 티셔츠
  region: "전체",
  display: "진열",
  stock: "",
  msrp: "",
  cost: "",
  price: "",
  point: "",
};

export default function ProductAdd() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const nav = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    const numeric = /stock|msrp|cost|price|point/.test(name);
    setForm((p) => ({ ...p, [name]: numeric ? value.replace(/\D/g, "") : value }));
  };

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "상품명을 입력하세요.";
    if (!form.code) e.code = "상품코드를 입력하세요.";
    if (!form.link) e.link = "제품링크를 입력하세요.";
    if (!form.price) e.price = "판매가를 입력하세요.";
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const eobj = validate();
    setErrors(eobj);
    if (Object.keys(eobj).length) return;

    setLoading(true);
    setAlert(null);

    try {
      // 카테고리 분해 (예: "패션의류/잡화 > 티셔츠")
      const cats = (form.categoryPath || "")
        .split(">")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        // DB INSERT 컬럼 기준 매핑
        p_productId: form.code,                 // NOT NULL
        p_title: form.name,
        p_link: form.link,                      // NOT NULL
        p_image: "",                            // 필요 시 파일 업로드 연동
        p_lprice: Number(form.price || 0),      // NOT NULL
        p_hprice: Number(form.msrp || 0),
        p_mallName: "",                         // 필요 시 사용
        p_productType: "",
        p_brand: form.brand || "",
        p_maker: form.supplier || "",
        p_category1: cats[0] || "기타",         // NOT NULL → 기본값 보장
        p_category2: cats[1] || "",
        p_category3: cats[2] || "",
        p_category4: cats[3] || "",
      };

      const res = await fetch(`${API_BASE}/api/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`등록 실패 (${res.status})`);

      setAlert({ type: "success", msg: "등록되었습니다." });
      setTimeout(() => nav("/admin/product"), 400);
    } catch (e) {
      setAlert({ type: "danger", msg: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0 fw-semibold">상품 등록</h4>
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => nav("/admin/product")}
        >
          목록
        </button>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      <form onSubmit={submit}>
        <div className="card">
          <div className="card-header fw-semibold">기본정보</div>
          <div className="card-body">
            {/* 상품명 */}
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">상품명 *</label>
              <div className="col-sm-6">
                <input
                  name="name"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  value={form.name}
                  onChange={onChange}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
            </div>

            {/* 코드/공급사 */}
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">상품코드 *</label>
              <div className="col-sm-3">
                <input
                  name="code"
                  className={`form-control ${errors.code ? "is-invalid" : ""}`}
                  value={form.code}
                  onChange={onChange}
                />
                {errors.code && <div className="invalid-feedback">{errors.code}</div>}
              </div>
              <label className="col-sm-2 col-form-label text-md-end">공급사</label>
              <div className="col-sm-3">
                <input
                  name="supplier"
                  className="form-control"
                  value={form.supplier}
                  onChange={onChange}
                />
              </div>
            </div>

            {/* 제품 링크 */}
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">제품링크 *</label>
              <div className="col-sm-6">
                <input
                  name="link"
                  className={`form-control ${errors.link ? "is-invalid" : ""}`}
                  placeholder="예) https://example.com/product/123"
                  value={form.link}
                  onChange={onChange}
                />
                {errors.link && <div className="invalid-feedback">{errors.link}</div>}
              </div>
            </div>

            {/* 브랜드/카테고리 경로 */}
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">브랜드</label>
              <div className="col-sm-3">
                <input
                  name="brand"
                  className="form-control"
                  value={form.brand}
                  onChange={onChange}
                />
              </div>
              <label className="col-sm-2 col-form-label text-md-end">카테고리</label>
              <div className="col-sm-5">
                <input
                  name="categoryPath"
                  className="form-control"
                  placeholder="예) 패션의류/잡화 > 티셔츠"
                  value={form.categoryPath}
                  onChange={onChange}
                />
              </div>
            </div>

            {/* 지역/상태 */}
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">지역</label>
              <div className="col-sm-3">
                <select name="region" className="form-select" value={form.region} onChange={onChange}>
                  {["전체", "전국", "서울/경기", "강원", "충청", "전라", "경상", "제주"].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <label className="col-sm-2 col-form-label text-md-end">상태</label>
              <div className="col-sm-3">
                <select name="display" className="form-select" value={form.display} onChange={onChange}>
                  {["진열", "품절", "단종", "중지"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 수치 입력들 */}
            <div className="row">
              <label className="col-sm-2 col-form-label">재고</label>
              <div className="col-sm-2">
                <input name="stock" className="form-control" value={form.stock} onChange={onChange} />
              </div>
              <label className="col-sm-2 col-form-label text-md-end">시중가</label>
              <div className="col-sm-2">
                <input name="msrp" className="form-control" value={form.msrp} onChange={onChange} />
              </div>
              <label className="col-sm-2 col-form-label text-md-end">공급가</label>
              <div className="col-sm-2">
                <input name="cost" className="form-control" value={form.cost} onChange={onChange} />
              </div>
            </div>

            <div className="row mt-3">
              <label className="col-sm-2 col-form-label">판매가 *</label>
              <div className="col-sm-2">
                <input
                  name="price"
                  className={`form-control ${errors.price ? "is-invalid" : ""}`}
                  value={form.price}
                  onChange={onChange}
                />
                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
              </div>
              <label className="col-sm-2 col-form-label text-md-end">포인트</label>
              <div className="col-sm-2">
                <input name="point" className="form-control" value={form.point} onChange={onChange} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "저장 중..." : "저장"}
          </button>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => nav("/admin/product")}
          >
            목록
          </button>
          <button
            className="btn btn-outline-danger ms-auto"
            type="button"
            onClick={() => {
              setForm(initial);
              setErrors({});
              setAlert(null);
            }}
          >
            초기화
          </button>
        </div>
      </form>
    </div>
  );
}