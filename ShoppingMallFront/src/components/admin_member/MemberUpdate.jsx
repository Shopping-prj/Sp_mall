import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_BASE =
  process.env.REACT_APP_SPRING_IP?.replace(/\/$/, "") || ""; // 프록시(/proxy) 쓰면 빈문자열도 OK

export default function MemberUpdate() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  // 검색 상태 (id 또는 email로 불러오기)
  const [searchType, setSearchType] = useState(sp.get("type") === "id" ? "id" : "email");
  const [searchValue, setSearchValue] = useState(sp.get("q") || "");

  // 로딩/알림
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // 불러온 회원 + 수정용 폼 상태
  const [member, setMember] = useState(null);
  const [form, setForm] = useState({
    m_no: "",
    m_email: "",
    m_name: "",
    m_social: "LOCAL", // ERD: 대문자 사용
    m_class: "USER",
    m_address: "",
    m_password: "",  // 비번 변경 시에만 채움
    m_password2: "",
  });
  const [errors, setErrors] = useState({});

  // member → form 동기화
  useEffect(() => {
    if (!member) return;
    setForm((p) => ({
      ...p,
      m_no: member.m_no ?? "",
      m_email: member.m_email ?? "",
      m_name: member.m_name ?? "",
      m_social: (member.m_social || "LOCAL"), // 서버 값이 대문자라고 가정
      m_class: member.m_class || "USER",
      m_address: member.m_address ?? "",
      m_password: "",
      m_password2: "",
    }));
  }, [member]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.m_no) e.m_no = "대상 회원을 먼저 불러와 주세요.";
    if (!form.m_email) e.m_email = "회원 이메일이 비어 있습니다.";

    if (form.m_password || form.m_password2) {
      if ((form.m_password || "").length < 8) e.m_password = "비밀번호는 8자 이상이어야 합니다.";
      if (form.m_password !== form.m_password2) e.m_password2 = "비밀번호가 일치하지 않습니다.";
    }

    if (!form.m_class) e.m_class = "회원등급을 선택하세요.";
    if (!form.m_social) e.m_social = "가입방식을 선택하세요.";
    if (!form.m_address) e.m_address = "배송지를 입력하세요.";
    return e;
  };

  // 회원 불러오기
  const fetchMember = async () => {
    const q = searchValue.trim();
    if (!q) {
      setAlert({ type: "warning", msg: "검색값을 입력하세요." });
      return;
    }
    setAlert(null);
    setLoading(true);
    try {
      let data;
      if (searchType === "id") {
        // by m_no (단건)
        const url = `${API_BASE}/api/admin/members/${encodeURIComponent(q)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`조회 실패 (${res.status})`);
        data = await res.json(); // 단건
      } else {
        // by email (목록) → 첫 번째 항목 채택
        const params = new URLSearchParams({ keywordType: "email", keyword: q });
        const url = `${API_BASE}/api/admin/members?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`조회 실패 (${res.status})`);
        const list = await res.json();
        if (!Array.isArray(list) || list.length === 0) {
          throw new Error("해당 이메일로 검색된 회원이 없습니다.");
        }
        data = list[0];
      }

      setMember(data);
      setAlert({ type: "success", msg: "회원 정보를 불러왔습니다." });
    } catch (err) {
      setMember(null);
      setAlert({ type: "danger", msg: err.message || "회원 조회 중 오류가 발생했습니다." });
    } finally {
      setLoading(false);
    }
  };

  // 저장(수정)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const eobj = validate();
    setErrors(eobj);
    if (Object.keys(eobj).length) return;

    setLoading(true);
    setAlert(null);
    try {
      // 비밀번호는 변경 시에만 보냄
      const payload = {
        m_email: form.m_email,
        m_name: form.m_name || null,
        m_social: form.m_social, // LOCAL/KAKAO/NAVER/GOOGLE
        m_class: form.m_class,   // USER/ADMIN
        m_address: form.m_address,
      };
      if (form.m_password) payload.m_password = form.m_password;

      const res = await fetch(`${API_BASE}/api/admin/members/${encodeURIComponent(form.m_no)}`, {
        method: "PUT", // 백엔드에 맞게 PUT 사용
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `수정 실패 (${res.status})`);
      }
      setAlert({ type: "success", msg: "회원 정보가 수정되었습니다." });
      // 필요 시 목록으로 이동
      // setTimeout(() => navigate("/admin/member"), 500);
    } catch (err) {
      setAlert({ type: "danger", msg: err.message || "수정 중 오류가 발생했습니다." });
    } finally {
      setLoading(false);
    }
  };

  const hasTarget = !!member;

  return (
    <div className="container-fluid py-3">
      {/* 헤더/브레드크럼 */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-1 fw-semibold">회원 정보수정</h4>
          <div className="text-muted small">HOME &gt; 회원관리 &gt; 회원 정보수정</div>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      {/* 검색 바 */}
      <div className="card mb-3">
        <div className="card-header fw-semibold">대상 회원 검색</div>
        <div className="card-body">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-2">
              <select className="form-select" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                <option value="email">이메일로</option>
                <option value="id">회원번호로</option>
              </select>
            </div>
            <div className="col-12 col-md-6">
              <input
                className="form-control"
                placeholder={searchType === "email" ? "example@domain.com" : "회원번호 (m_no)"}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4 d-flex gap-2">
              <button className="btn btn-dark" onClick={fetchMember} disabled={loading}>
                {loading ? "불러오는 중..." : "불러오기"}
              </button>
              <button className="btn btn-outline-secondary" onClick={() => navigate("/admin/member")}>
                목록
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 수정 폼 */}
      <form onSubmit={handleSubmit}>
        <div className="card mb-3">
          <div className="card-header fw-semibold">회원 기본정보</div>
          <div className="card-body">
            {/* 회원번호 */}
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">회원번호 (m_no)</label>
              <div className="col-sm-4">
                <input className="form-control" value={form.m_no} readOnly />
                {errors.m_no && <div className="text-danger small mt-1">{errors.m_no}</div>}
              </div>
            </div>

            {/* 이메일 (수정 불가 권장) */}
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">회원이메일 (m_email)</label>
              <div className="col-sm-6">
                <input className="form-control" value={form.m_email} readOnly />
                {errors.m_email && <div className="text-danger small mt-1">{errors.m_email}</div>}
              </div>
            </div>

            {/* 비밀번호 변경(선택) */}
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">비밀번호 변경</label>
              <div className="col-sm-4">
                <input
                  type="password"
                  name="m_password"
                  className={`form-control ${errors.m_password ? "is-invalid" : ""}`}
                  placeholder="새 비밀번호 (선택)"
                  value={form.m_password}
                  onChange={onChange}
                  disabled={!hasTarget}
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
                  disabled={!hasTarget}
                />
                {errors.m_password2 && <div className="invalid-feedback">{errors.m_password2}</div>}
              </div>
            </div>

            {/* 닉네임 */}
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">회원닉네임 (m_name)</label>
              <div className="col-sm-6">
                <input
                  name="m_name"
                  className="form-control"
                  value={form.m_name}
                  onChange={onChange}
                  placeholder="예) 홍길동"
                  disabled={!hasTarget}
                />
              </div>
            </div>

            {/* 가입방식 (ERD: 대문자) */}
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">가입방식 (m_social)</label>
              <div className="col-sm-10 d-flex gap-3 align-items-center">
                {["LOCAL", "KAKAO", "NAVER", "GOOGLE"].map((v) => (
                  <div className="form-check" key={v}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="m_social"
                      id={`social-${v}`}
                      value={v}
                      checked={form.m_social === v}
                      onChange={onChange}
                      disabled={!hasTarget}
                    />
                    <label className="form-check-label" htmlFor={`social-${v}`}>{v}</label>
                  </div>
                ))}
                {errors.m_social && <div className="text-danger small">{errors.m_social}</div>}
              </div>
            </div>

            {/* 회원등급 */}
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">회원등급 (m_class)</label>
              <div className="col-sm-10 d-flex gap-3 align-items-center">
                {["USER", "ADMIN"].map((v) => (
                  <div className="form-check" key={v}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="m_class"
                      id={`class-${v}`}
                      value={v}
                      checked={form.m_class === v}
                      onChange={onChange}
                      disabled={!hasTarget}
                    />
                    <label className="form-check-label" htmlFor={`class-${v}`}>{v}</label>
                  </div>
                ))}
                {errors.m_class && <div className="text-danger small">{errors.m_class}</div>}
              </div>
            </div>

            {/* 배송지 */}
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">배송지 (m_address)</label>
              <div className="col-sm-8">
                <input
                  name="m_address"
                  className={`form-control ${errors.m_address ? "is-invalid" : ""}`}
                  value={form.m_address}
                  onChange={onChange}
                  placeholder="주소를 입력하세요"
                  disabled={!hasTarget}
                />
                {errors.m_address && <div className="invalid-feedback">{errors.m_address}</div>}
              </div>
            </div>

            {/* 가입날짜는 서버 값 표시만 */}
            {member && (
              <div className="row mb-1">
                <label className="col-sm-2 col-form-label text-muted">가입날짜 (m_created)</label>
                <div className="col-sm-4">
                  <input className="form-control" value={member.m_created || ""} readOnly />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 액션 */}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={!hasTarget || loading}>
            {loading ? "저장 중..." : "저장"}
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/admin/member")}>
            목록
          </button>
        </div>
      </form>
    </div>
  );
}