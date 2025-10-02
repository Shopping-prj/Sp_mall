import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE =
  (process.env.REACT_APP_SPRING_IP || "").replace(/\/$/, "");

const initial = {
  m_email: "",
  m_password: "",
  m_password2: "",
  m_name: "",
  m_social: "local", // local | kakao | naver | google ...
  m_class: "USER",   // USER | ADMIN
  m_address: "",
};

const MemberAdd = () => {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.m_email) e.m_email = "이메일을 입력하세요.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.m_email))
      e.m_email = "올바른 이메일 형식이 아닙니다.";

    if (!form.m_password) e.m_password = "비밀번호를 입력하세요.";
    else if (form.m_password.length < 5)
      e.m_password = "비밀번호는 5자 이상이어야 합니다.";

    if (form.m_password !== form.m_password2)
      e.m_password2 = "비밀번호가 일치하지 않습니다.";

    if (!form.m_address) e.m_address = "배송지를 입력하세요.";
    if (!form.m_class) e.m_class = "회원등급을 선택하세요.";
    if (!form.m_social) e.m_social = "가입방식을 선택하세요.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eobj = validate();
    setErrors(eobj);
    if (Object.keys(eobj).length) return;

    setSubmitting(true);
    setAlert(null);

    try {
      const resp = await fetch(`${API_BASE}/api/admin/members/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,   // ✅ 추가
        },
        body: JSON.stringify({
          m_email: form.m_email,
          m_password: form.m_password,
          m_name: form.m_name || null,
          m_social: form.m_social,
          m_class: form.m_class,
          m_address: form.m_address,
        }),
      });

      if (!resp.ok) {
        const msg = await resp.text();
        throw new Error(msg || "저장에 실패했습니다.");
      }

      setAlert({ type: "success", msg: "회원이 등록되었습니다." });
      setTimeout(() => navigate("/admin/member"), 600);
    } catch (err) {
      setAlert({ type: "danger", msg: err.message || "오류가 발생했습니다." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(initial);
    setErrors({});
    setAlert(null);
  };

  return (
    <div className="container-fluid py-3">
      {/* 헤더/브레드크럼 */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-1 fw-semibold">회원 등록</h4>
          <div className="text-muted small">HOME &gt; 회원관리 &gt; 회원 등록</div>
        </div>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* 기본정보 카드 */}
        <div className="card mb-3">
          <div className="card-header fw-semibold">기본정보</div>
          <div className="card-body">
            {/* 이메일 */}
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">
                회원이메일 <span className="text-danger">*</span>
              </label>
              <div className="col-sm-6">
                <input
                  type="email"
                  name="m_email"
                  className={`form-control ${errors.m_email ? "is-invalid" : ""}`}
                  placeholder="example@domain.com"
                  value={form.m_email}
                  onChange={onChange}
                />
                {errors.m_email && <div className="invalid-feedback">{errors.m_email}</div>}
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">
                비밀번호 <span className="text-danger">*</span>
              </label>
              <div className="col-sm-4">
                <input
                  type="password"
                  name="m_password"
                  className={`form-control ${errors.m_password ? "is-invalid" : ""}`}
                  placeholder="5자 이상"
                  value={form.m_password}
                  onChange={onChange}
                />
                {errors.m_password && <div className="invalid-feedback">{errors.m_password}</div>}
              </div>
              <div className="col-sm-4">
                <input
                  type="password"
                  name="m_password2"
                  className={`form-control ${errors.m_password2 ? "is-invalid" : ""}`}
                  placeholder="비밀번호 확인"
                  value={form.m_password2}
                  onChange={onChange}
                />
                {errors.m_password2 && <div className="invalid-feedback">{errors.m_password2}</div>}
              </div>
            </div>

            {/* 닉네임 */}
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">회원닉네임</label>
              <div className="col-sm-6">
                <input
                  type="text"
                  name="m_name"
                  className="form-control"
                  placeholder="예) 홍길동"
                  value={form.m_name}
                  onChange={onChange}
                />
              </div>
            </div>

            {/* 가입방식 */}
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">
                가입방식 <span className="text-danger">*</span>
              </label>
              <div className="col-sm-10" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                {["local", "kakao", "naver", "google"].map((v) => (
                  <label 
                    key={v}
                    style={{ display: "inline-flex", alignItems: "center", gap: "4px", cursor: "pointer" }}
                  >
                    <input
                      type="radio"
                      name="m_social"
                      value={v}
                      checked={form.m_social === v}
                      onChange={onChange}
                      style={{ margin: 0 }}
                    />
                    {v.toUpperCase()}
                  </label>
                ))}
                {errors.m_social && <div className="text-danger small">{errors.m_social}</div>}
              </div>
            </div>

            {/* 회원등급 */}
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">
                회원등급 <span className="text-danger">*</span>
              </label>
              <div className="col-sm-10" style={{ display: "flex", gap: "20px" }}>
                {["USER", "ADMIN"].map((v) => (
                  <label 
                    key={v}
                    style={{ display: "inline-flex", alignItems: "center", gap: "4px", cursor: "pointer" }}
                  >
                    <input
                      type="radio"
                      name="m_class"
                      value={v}
                      checked={form.m_class === v}
                      onChange={onChange}
                      style={{ margin: 0 }}
                    />
                    {v}
                  </label>
                ))}
                {errors.m_class && <div className="text-danger small">{errors.m_class}</div>}
              </div>
            </div>

            {/* 배송지 */}
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">
                배송지 <span className="text-danger">*</span>
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  name="m_address"
                  className={`form-control ${errors.m_address ? "is-invalid" : ""}`}
                  placeholder="주소를 입력하세요"
                  value={form.m_address}
                  onChange={onChange}
                />
                {errors.m_address && <div className="invalid-feedback">{errors.m_address}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "저장 중..." : "저장"}
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/admin/member")}>
            목록
          </button>
          <button type="button" className="btn btn-outline-danger ms-auto" onClick={handleReset}>
            초기화
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberAdd;
