import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = (process.env.REACT_APP_API_BASE_URL || "").replace(/\/$/, "");

const initial = {
  name: "", code: "", supplier: "", brand: "",
  categoryPath: "", region: "전체", display: "진열",
  stock: "", msrp: "", cost: "", price: "", point: "",
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
    if (!form.price) e.price = "판매가를 입력하세요.";
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const eobj = validate(); setErrors(eobj);
    if (Object.keys(eobj).length) return;

    setLoading(true); setAlert(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          stock: Number(form.stock || 0),
          msrp: Number(form.msrp || 0),
          cost: Number(form.cost || 0),
          price: Number(form.price || 0),
          point: Number(form.point || 0),
        }),
      });
      if (!res.ok) throw new Error(`등록 실패 (${res.status})`);
      setAlert({ type: "success", msg: "등록되었습니다." });
      setTimeout(() => nav("/admin/product/all"), 400);
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
        <button className="btn btn-outline-secondary" onClick={() => nav("/admin/product/all")}>목록</button>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      <form onSubmit={submit}>
        <div className="card">
          <div className="card-header fw-semibold">기본정보</div>
          <div className="card-body">
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">상품명 *</label>
              <div className="col-sm-6">
                <input name="name" className={`form-control ${errors.name?"is-invalid":""}`} value={form.name} onChange={onChange}/>
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">상품코드 *</label>
              <div className="col-sm-3">
                <input name="code" className={`form-control ${errors.code?"is-invalid":""}`} value={form.code} onChange={onChange}/>
                {errors.code && <div className="invalid-feedback">{errors.code}</div>}
              </div>
              <label className="col-sm-2 col-form-label text-md-end">공급사</label>
              <div className="col-sm-3">
                <input name="supplier" className="form-control" value={form.supplier} onChange={onChange}/>
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">브랜드</label>
              <div className="col-sm-3">
                <input name="brand" className="form-control" value={form.brand} onChange={onChange}/>
              </div>
              <label className="col-sm-2 col-form-label text-md-end">카테고리</label>
              <div className="col-sm-5">
                <input name="categoryPath" className="form-control" placeholder="예) 패션의류/잡화 > 티셔츠" value={form.categoryPath} onChange={onChange}/>
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">지역</label>
              <div className="col-sm-3">
                <select name="region" className="form-select" value={form.region} onChange={onChange}>
                  {["전체","전국","서울/경기","강원","충청","전라","경상","제주"].map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              <label className="col-sm-2 col-form-label text-md-end">상태</label>
              <div className="col-sm-3">
                <select name="display" className="form-select" value={form.display} onChange={onChange}>
                  {["진열","품절","단종","중지"].map(v=><option key={v}>{v}</option>)}
                </select>
              </div>
            </div>

            <div className="row">
              <label className="col-sm-2 col-form-label">재고</label>
              <div className="col-sm-2">
                <input name="stock" className="form-control" value={form.stock} onChange={onChange}/>
              </div>
              <label className="col-sm-2 col-form-label text-md-end">시중가</label>
              <div className="col-sm-2">
                <input name="msrp" className="form-control" value={form.msrp} onChange={onChange}/>
              </div>
              <label className="col-sm-2 col-form-label text-md-end">공급가</label>
              <div className="col-sm-2">
                <input name="cost" className="form-control" value={form.cost} onChange={onChange}/>
              </div>
            </div>

            <div className="row mt-3">
              <label className="col-sm-2 col-form-label">판매가 *</label>
              <div className="col-sm-2">
                <input name="price" className={`form-control ${errors.price?"is-invalid":""}`} value={form.price} onChange={onChange}/>
                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
              </div>
              <label className="col-sm-2 col-form-label text-md-end">포인트</label>
              <div className="col-sm-2">
                <input name="point" className="form-control" value={form.point} onChange={onChange}/>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "저장 중..." : "저장"}</button>
          <button className="btn btn-outline-secondary" type="button" onClick={() => nav("/admin/product/all")}>목록</button>
          <button className="btn btn-outline-danger ms-auto" type="button" onClick={() => { setForm(initial); setErrors({}); setAlert(null); }}>초기화</button>
        </div>
      </form>
    </div>
  );
}