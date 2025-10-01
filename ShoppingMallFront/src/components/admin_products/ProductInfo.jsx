import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_BASE = (process.env.REACT_APP_SPRING_IP || "http://localhost:8001").replace(/\/$/, "");
const PRODUCTS_URL = `${API_BASE}/api/admin/products`;
const REFRESH_URL  = `${API_BASE}/api/users/refresh`;

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

  // 공통 fetch: 액세스 토큰 + 401시 refresh 1회 재시도
  const apiFetch = async (url, options = {}) => {
    const accessToken  = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const merged = {
      cache: "no-store", // 캐시 회피
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    };

    let res = await fetch(url, merged);

    if (res.status === 401 && refreshToken) {
      try {
        const r = await fetch(REFRESH_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
      } catch {
        // 그대로 반환
      }
    }
    return res;
  };

  // product -> form 동기화
  useEffect(() => {
    if (!product) return;
    setForm({
      code:        product.p_productId ?? "",
      title:       product.p_title ?? "",
      link:        product.p_link ?? "",
      image:       product.p_image ?? "",
      lprice:      (product.p_lprice ?? "").toString(),
      hprice:      (product.p_hprice ?? "").toString(),
      mallName:    product.p_mallName ?? "",
      productType: product.p_productType ?? "",
      brand:       product.p_brand ?? "",
      maker:       product.p_maker ?? "",
      category1:   product.p_category1 ?? "",
      category2:   product.p_category2 ?? "",
      category3:   product.p_category3 ?? "",
      category4:   product.p_category4 ?? "",
    });
  }, [product]);

  // 상세 조회
  const fetchDetail = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // 캐시 버스터 추가
      const res = await apiFetch(`${PRODUCTS_URL}/${encodeURIComponent(id)}?_=${Date.now()}`, { method: "GET" });
      if (!res.ok) throw new Error(`조회 실패 (${res.status})`);
      const data = await res.json();
      setProduct(data);
      // 성공 알림은 유지
    } catch (e) {
      setAlert({ type: "danger", msg: e.message || "조회 중 오류" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "lprice") {
      setForm((p) => ({ ...p, [name]: value.replace(/\D/g, "") }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const save = async () => {
    if (!id) return;
    setLoading(true);
    setAlert(null);
    try {
      const payload = {
        p_productId:  form.code, // PK 변경이 허용되는지 백엔드 정책에 맞춰 사용
        p_title:      form.title,
        p_link:       form.link,
        p_image:      form.image,
        p_lprice:     form.lprice ? Number(form.lprice) : 0,
        p_hprice:     form.hprice ?? "",
        p_mallName:   form.mallName ?? "",
        p_productType:form.productType ?? "",
        p_brand:      form.brand ?? "",
        p_maker:      form.maker ?? "",
        p_category1:  form.category1 ?? "",
        p_category2:  form.category2 ?? "",
        p_category3:  form.category3 ?? "",
        p_category4:  form.category4 ?? "",
      };

      // 1) 서버 업데이트
      const res = await apiFetch(`${PRODUCTS_URL}/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(`수정 실패 (${res.status}) ${msg}`);
      }

      // 2) 성공 알림 유지
      setAlert({ type: "success", msg: "저장되었습니다." });
      setIsEdit(false);

      // 3) 로컬 즉시 반영(원복 느낌 방지)
      setProduct((prev) => ({
        ...(prev || {}),
        p_productId:  payload.p_productId,
        p_title:      payload.p_title,
        p_link:       payload.p_link,
        p_image:      payload.p_image,
        p_lprice:     payload.p_lprice,
        p_hprice:     payload.p_hprice,
        p_mallName:   payload.p_mallName,
        p_productType:payload.p_productType,
        p_brand:      payload.p_brand,
        p_maker:      payload.p_maker,
        p_category1:  payload.p_category1,
        p_category2:  payload.p_category2,
        p_category3:  payload.p_category3,
        p_category4:  payload.p_category4,
      }));

      // 4) 서버 최신값으로 한번 더 동기화(알림은 유지)
      await fetchDetail();

      // 5) 목록 새로고침 플래그 (목록 컴포넌트에서 감지)
      sessionStorage.setItem("PRODUCTS_SHOULD_REFRESH", "1");
    } catch (e) {
      setAlert({ type: "danger", msg: e.message || "수정 중 오류" });
    } finally {
      setLoading(false);
    }
  };

  const cancel = () => {
    setIsEdit(false);
    // product -> form 동기화는 useEffect에서 처리
  };

  if (!id) {
    return (
      <div className="container-fluid py-3">
        <h5 className="mb-3">상품 정보관리</h5>
        <div className="alert alert-warning">id가 없습니다. 목록에서 상품을 선택해주세요.</div>
        <button className="btn btn-outline-secondary" onClick={() => nav("/admin/product")}>
          목록
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0 fw-semibold">상품 정보관리</h4>
        <div className="d-flex gap-2">
          {!isEdit && (
            <button className="btn btn-primary" onClick={() => setIsEdit(true)}>
              수정
            </button>
          )}
          {isEdit && (
            <>
              <button className="btn btn-primary" onClick={save} disabled={loading}>
                {loading ? "저장 중..." : "저장"}
              </button>
              <button className="btn btn-outline-secondary" onClick={cancel} disabled={loading}>
                취소
              </button>
            </>
          )}
          <button className="btn btn-outline-secondary" onClick={() => nav("/admin/product")}>
            목록
          </button>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

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
