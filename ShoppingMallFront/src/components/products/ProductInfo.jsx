import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_BASE = (process.env.REACT_APP_API_BASE_URL || "").replace(/\/$/, "");

export default function ProductInfo() {
  const [sp] = useSearchParams();
  const id = sp.get("id");
  const startEdit = sp.get("edit") === "1";
  const nav = useNavigate();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isEdit, setIsEdit] = useState(startEdit);

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    name: "", code: "", supplier: "", brand: "",
    categoryPath: "", region: "전체", display: "진열",
    stock: 0, msrp: 0, cost: 0, price: 0, point: 0,
  });

  // 상세 조회
  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setAlert(null);
      try {
        const res = await fetch(`${API_BASE}/api/admin/products/${id}`);
        if (!res.ok) throw new Error(`조회 실패 (${res.status})`);
        const data = await res.json();
        setProduct(data);
        setForm({
          name: data.name ?? "",
          code: data.code ?? "",
          supplier: data.supplier ?? "",
          brand: data.brand ?? "",
          categoryPath: data.categoryPath ?? "",
          region: data.region ?? "전체",
          display: data.display ?? "진열",
          stock: data.stock ?? 0,
          msrp: data.msrp ?? 0,
          cost: data.cost ?? 0,
          price: data.price ?? 0,
          point: data.point ?? 0,
        });
      } catch (e) {
        setAlert({ type: "danger", msg: e.message });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name.match(/stock|msrp|cost|price|point/) ? value.replace(/\D/g, "") : value }));
  };

  const save = async () => {
    setLoading(true);
    setAlert(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
        method: "PUT",
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
      if (!res.ok) throw new Error(`수정 실패 (${res.status})`);
      setAlert({ type: "success", msg: "저장되었습니다." });
      setIsEdit(false);
      // 상세 재조회
      const data = await res.json().catch(() => null);
      if (data) setProduct(data);
    } catch (e) {
      setAlert({ type: "danger", msg: e.message });
    } finally {
      setLoading(false);
    }
  };

  if (!id) {
    return (
      <div className="container-fluid py-3">
        <h5 className="mb-3">상품 정보관리</h5>
        <div className="alert alert-warning">id가 없습니다. 목록에서 상품을 선택해주세요.</div>
        <button className="btn btn-outline-secondary" onClick={() => nav("/admin/product/all")}>목록</button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0 fw-semibold">상품 정보관리</h4>
        <div className="d-flex gap-2">
          {!isEdit && <button className="btn btn-primary" onClick={() => setIsEdit(true)}>수정</button>}
          {isEdit && (
            <>
              <button className="btn btn-primary" onClick={save} disabled={loading}>
                {loading ? "저장 중..." : "저장"}
              </button>
              <button className="btn btn-outline-secondary" onClick={() => { setIsEdit(false); setForm({
                name: product?.name ?? "",
                code: product?.code ?? "",
                supplier: product?.supplier ?? "",
                brand: product?.brand ?? "",
                categoryPath: product?.categoryPath ?? "",
                region: product?.region ?? "전체",
                display: product?.display ?? "진열",
                stock: product?.stock ?? 0,
                msrp: product?.msrp ?? 0,
                cost: product?.cost ?? 0,
                price: product?.price ?? 0,
                point: product?.point ?? 0,
              });}}>취소</button>
            </>
          )}
          <button className="btn btn-outline-secondary" onClick={() => nav("/admin/product/all")}>목록</button>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      <div className="card">
        <div className="card-header fw-semibold">기본정보</div>
        <div className="card-body">
          {/* 행 1 */}
          <div className="row mb-3">
            <label className="col-sm-2 col-form-label">상품명</label>
            <div className="col-sm-6">
              <input name="name" className="form-control" value={form.name} onChange={onChange} disabled={!isEdit}/>
            </div>
          </div>

          {/* 행 2 */}
          <div className="row mb-3">
            <label className="col-sm-2 col-form-label">상품코드</label>
            <div className="col-sm-3">
              <input name="code" className="form-control" value={form.code} onChange={onChange} disabled={!isEdit}/>
            </div>
            <label className="col-sm-2 col-form-label text-md-end">공급사</label>
            <div className="col-sm-3">
              <input name="supplier" className="form-control" value={form.supplier} onChange={onChange} disabled={!isEdit}/>
            </div>
          </div>

          {/* 행 3 */}
          <div className="row mb-3">
            <label className="col-sm-2 col-form-label">브랜드</label>
            <div className="col-sm-3">
              <input name="brand" className="form-control" value={form.brand} onChange={onChange} disabled={!isEdit}/>
            </div>
            <label className="col-sm-2 col-form-label text-md-end">카테고리</label>
            <div className="col-sm-5">
              <input name="categoryPath" className="form-control" placeholder="예) 패션의류/잡화 > 티셔츠"
                     value={form.categoryPath} onChange={onChange} disabled={!isEdit}/>
            </div>
          </div>

          {/* 행 4 */}
          <div className="row mb-3">
            <label className="col-sm-2 col-form-label">지역</label>
            <div className="col-sm-3">
              <select name="region" className="form-select" value={form.region} onChange={onChange} disabled={!isEdit}>
                {["전체","전국","서울/경기","강원","충청","전라","경상","제주"].map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <label className="col-sm-2 col-form-label text-md-end">상태</label>
            <div className="col-sm-3">
              <select name="display" className="form-select" value={form.display} onChange={onChange} disabled={!isEdit}>
                {["진열","품절","단종","중지"].map(v=><option key={v}>{v}</option>)}
              </select>
            </div>
          </div>

          {/* 행 5 */}
          <div className="row mb-3">
            <label className="col-sm-2 col-form-label">재고</label>
            <div className="col-sm-2">
              <input name="stock" className="form-control" value={form.stock} onChange={onChange} disabled={!isEdit}/>
            </div>
            <label className="col-sm-2 col-form-label text-md-end">시중가</label>
            <div className="col-sm-2">
              <input name="msrp" className="form-control" value={form.msrp} onChange={onChange} disabled={!isEdit}/>
            </div>
            <label className="col-sm-2 col-form-label text-md-end">공급가</label>
            <div className="col-sm-2">
              <input name="cost" className="form-control" value={form.cost} onChange={onChange} disabled={!isEdit}/>
            </div>
          </div>

          {/* 행 6 */}
          <div className="row">
            <label className="col-sm-2 col-form-label">판매가</label>
            <div className="col-sm-2">
              <input name="price" className="form-control" value={form.price} onChange={onChange} disabled={!isEdit}/>
            </div>
            <label className="col-sm-2 col-form-label text-md-end">포인트</label>
            <div className="col-sm-2">
              <input name="point" className="form-control" value={form.point} onChange={onChange} disabled={!isEdit}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}