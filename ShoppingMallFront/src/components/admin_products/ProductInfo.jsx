import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_BASE = (process.env.REACT_APP_SPRING_IP || "http://localhost:8001").replace(/\/$/, "");

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
    code: "",
    title: "",
    link: "",
    image: "",
    lprice: "",
    hprice: "",
    mallName: "",
    productType: "",
    brand: "",
    maker: "",
    category1: "",
    category2: "",
    category3: "",
    category4: "",
  });

  // 상세 조회
  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setAlert(null);
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE}/api/admin/products/${encodeURIComponent(id)}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!res.ok) throw new Error(`조회 실패 (${res.status})`);
        const data = await res.json();

        setProduct(data);
        setForm({
          code: data.p_productId ?? "",
          title: data.p_title ?? "",
          link: data.p_link ?? "",
          image: data.p_image ?? "",
          lprice: (data.p_lprice ?? "").toString(),
          hprice: data.p_hprice ?? "",
          mallName: data.p_mallName ?? "",
          productType: data.p_productType ?? "",
          brand: data.p_brand ?? "",
          maker: data.p_maker ?? "",
          category1: data.p_category1 ?? "",
          category2: data.p_category2 ?? "",
          category3: data.p_category3 ?? "",
          category4: data.p_category4 ?? "",
        });
      } catch (e) {
        setAlert({ type: "danger", msg: e.message });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // 입력 변경 핸들러
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "lprice") {
      setForm((p) => ({ ...p, [name]: value.replace(/\D/g, "") }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  // 저장하기
  const save = async () => {
    if (!id) return;
    setLoading(true);
    setAlert(null);
    try {
      const payload = {
        p_productId: form.code,
        p_title: form.title,
        p_link: form.link,
        p_image: form.image,
        p_lprice: form.lprice ? Number(form.lprice) : 0,
        p_hprice: form.hprice ?? "",
        p_mallName: form.mallName ?? "",
        p_productType: form.productType ?? "",
        p_brand: form.brand ?? "",
        p_maker: form.maker ?? "",
        p_category1: form.category1 ?? "",
        p_category2: form.category2 ?? "",
        p_category3: form.category3 ?? "",
        p_category4: form.category4 ?? "",
      };
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/api/admin/products/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`수정 실패 (${res.status})`);

      setAlert({ type: "success", msg: "저장되었습니다." });
      setIsEdit(false);

      // 다시 GET 호출해서 최신 데이터 반영
      const r2 = await fetch(`${API_BASE}/api/admin/products/${encodeURIComponent(id)}`);
      if (r2.ok) {
        const d2 = await r2.json();
        setProduct(d2);
      }
    } catch (e) {
      setAlert({ type: "danger", msg: e.message });
    } finally {
      setLoading(false);
    }
  };

  // 수정 취소 → 원본 데이터로 롤백
  const cancel = () => {
    setIsEdit(false);
    if (product) {
      setForm({
        code: product.p_productId ?? "",
        title: product.p_title ?? "",
        link: product.p_link ?? "",
        image: product.p_image ?? "",
        lprice: (product.p_lprice ?? "").toString(),
        hprice: product.p_hprice ?? "",
        mallName: product.p_mallName ?? "",
        productType: product.p_productType ?? "",
        brand: product.p_brand ?? "",
        maker: product.p_maker ?? "",
        category1: product.p_category1 ?? "",
        category2: product.p_category2 ?? "",
        category3: product.p_category3 ?? "",
        category4: product.p_category4 ?? "",
      });
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
              <button className="btn btn-outline-secondary" onClick={cancel}>취소</button>
            </>
          )}
          <button className="btn btn-outline-secondary" onClick={() => nav("/admin/product/all")}>목록</button>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      {/* ====== 폼 ====== */}
      <div className="card">
        <div className="card-header fw-semibold">기본정보</div>
        <div className="card-body">
          {/* 상품명 */}
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label">상품명</label>
            <div className="col-sm-6">
              <input name="title" className="form-control" value={form.title} onChange={onChange} disabled={!isEdit}/>
            </div>
          </div>

          {/* 상품코드 / 브랜드 */}
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label">상품코드</label>
            <div className="col-sm-3">
              <input name="code" className="form-control" value={form.code} onChange={onChange} disabled={!isEdit}/>
            </div>
            <label className="col-sm-2 col-form-label text-md-end">브랜드</label>
            <div className="col-sm-3">
              <input name="brand" className="form-control" value={form.brand} onChange={onChange} disabled={!isEdit}/>
            </div>
          </div>

          {/* 제조사 / 매장명 */}
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label">제조사</label>
            <div className="col-sm-3">
              <input name="maker" className="form-control" value={form.maker} onChange={onChange} disabled={!isEdit}/>
            </div>
            <label className="col-sm-2 col-form-label text-md-end">매장명</label>
            <div className="col-sm-3">
              <input name="mallName" className="form-control" value={form.mallName} onChange={onChange} disabled={!isEdit}/>
            </div>
          </div>

          {/* 제품타입 / 링크 */}
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label">제품타입</label>
            <div className="col-sm-3">
              <input name="productType" className="form-control" value={form.productType} onChange={onChange} disabled={!isEdit}/>
            </div>
            <label className="col-sm-2 col-form-label text-md-end">링크</label>
            <div className="col-sm-5">
              <input name="link" className="form-control" value={form.link} onChange={onChange} disabled={!isEdit}/>
            </div>
          </div>

          {/* 이미지 */}
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label">이미지 URL</label>
            <div className="col-sm-10">
              <input name="image" className="form-control" value={form.image} onChange={onChange} disabled={!isEdit}/>
            </div>
          </div>

          {/* 가격 */}
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label">판매가</label>
            <div className="col-sm-3">
              <input name="lprice" className="form-control" value={form.lprice} onChange={onChange} disabled={!isEdit}/>
            </div>
            <label className="col-sm-2 col-form-label text-md-end">시중가</label>
            <div className="col-sm-3">
              <input name="hprice" className="form-control" value={form.hprice} onChange={onChange} disabled={!isEdit}/>
            </div>
          </div>

          {/* 카테고리 */}
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label">카테고리</label>
            <div className="col-sm-2"><input name="category1" className="form-control" value={form.category1} onChange={onChange} disabled={!isEdit}/></div>
            <div className="col-sm-2"><input name="category2" className="form-control" value={form.category2} onChange={onChange} disabled={!isEdit}/></div>
            <div className="col-sm-2"><input name="category3" className="form-control" value={form.category3} onChange={onChange} disabled={!isEdit}/></div>
            <div className="col-sm-2"><input name="category4" className="form-control" value={form.category4} onChange={onChange} disabled={!isEdit}/></div>
          </div>

          {form.image && (
            <div className="mb-3 row">
              <div className="offset-sm-2 col-sm-10">
                <img src={form.image} alt="" style={{ maxHeight: 120, objectFit: "contain" }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
