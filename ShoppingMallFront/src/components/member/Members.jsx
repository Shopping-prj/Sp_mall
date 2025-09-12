// src/components/member/Members.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

/** ERD 필드명에 맞춘 더미데이터 (백엔드 붙이기 전 임시) */
const MOCK = [
  {
    m_id: 4,
    m_email: "submall@example.com",
    m_name: "가맹점홍길동",
    m_social: "local",                // 가입방식: local/kakao/naver 등
    m_class: "ADMIN",                 // USER | ADMIN
    m_created: "2024-12-16 06:14:39", // 가입날짜
    m_address: "서울특별시 강남구 테헤란로 123",
  },
  {
    m_id: 3,
    m_email: "test3@example.com",
    m_name: "세금환급",
    m_social: "kakao",
    m_class: "USER",
    m_created: "2020-10-04 18:05:42",
    m_address: "부산광역시 해운대구 센텀중앙로 55",
  },
  {
    m_id: 2,
    m_email: "test2@example.com",
    m_name: "두끗만",
    m_social: "local",
    m_class: "USER",
    m_created: "2020-10-04 18:05:04",
    m_address: "대구광역시 수성구 달구벌대로 23",
  },
  {
    m_id: 1,
    m_email: "test1@example.com",
    m_name: "한끝만",
    m_social: "naver",
    m_class: "USER",
    m_created: "2020-10-04 18:04:17",
    m_address: "인천광역시 연수구 송도과학로 88",
  },
];

const Members = () => {
  const [keywordType, setKeywordType] = useState("email"); // email | name
  const [keyword, setKeyword] = useState("");
  const [cls, setCls] = useState("ALL");                   // USER | ADMIN | ALL
  const [social, setSocial] = useState("ALL");             // local/kakao/naver/ALL
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => {
    return MOCK.filter((m) => {
      // 키워드
      const target =
        keywordType === "email" ? m.m_email : m.m_name ?? "";
      const passKeyword = keyword
        ? target.toLowerCase().includes(keyword.toLowerCase())
        : true;

      // 등급
      const passClass = cls === "ALL" ? true : m.m_class === cls;

      // 가입방식
      const passSocial = social === "ALL" ? true : m.m_social === social;

      // 날짜
      const passDate =
        from || to
          ? (() => {
              const ts = new Date(m.m_created.replace(" ", "T"));
              const f = from ? new Date(from + "T00:00:00") : null;
              const t = to ? new Date(to + "T23:59:59") : null;
              if (f && ts < f) return false;
              if (t && ts > t) return false;
              return true;
            })()
          : true;

      return passKeyword && passClass && passSocial && passDate;
    });
  }, [keywordType, keyword, cls, social, from, to]);

  const reset = () => {
    setKeywordType("email");
    setKeyword("");
    setCls("ALL");
    setSocial("ALL");
    setFrom("");
    setTo("");
  };

  return (
    <div className="container-fluid py-3">
      {/* 헤더/브레드크럼 + 우측 버튼 */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-1 fw-semibold">회원 정보관리</h4>
          <div className="text-muted small">HOME &gt; 회원관리 &gt; 회원 정보관리</div>
        </div>
        <Link to="/admin/member/add" className="btn btn-danger">+ 회원추가</Link>
      </div>

      {/* 검색 카드 */}
      <div className="card mb-3">
        <div className="card-header fw-semibold">기본검색</div>
        <div className="card-body">
          <div className="row g-3 align-items-center mb-2">
            <div className="col-12 col-md-2">
              <label className="col-form-label fw-semibold">검색어</label>
            </div>
            <div className="col-6 col-md-2">
              <select
                className="form-select"
                value={keywordType}
                onChange={(e) => setKeywordType(e.target.value)}
              >
                <option value="email">이메일</option>
                <option value="name">닉네임</option>
              </select>
            </div>
            <div className="col-6 col-md-5">
              <input
                className="form-control"
                placeholder="검색어"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>

          <div className="row g-3 align-items-center mb-2">
            <div className="col-12 col-md-2">
              <label className="col-form-label fw-semibold">회원등급</label>
            </div>
            <div className="col-12 col-md-10">
              <div className="d-flex flex-wrap gap-3">
                {["ALL", "USER", "ADMIN"].map((v) => (
                  <div className="form-check" key={v}>
                    <input
                      className="form-check-input"
                      type="radio"
                      id={`cls-${v}`}
                      name="cls"
                      checked={cls === v}
                      onChange={() => setCls(v)}
                    />
                    <label className="form-check-label" htmlFor={`cls-${v}`}>
                      {v === "ALL" ? "전체" : v}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="row g-3 align-items-center mb-2">
            <div className="col-12 col-md-2">
              <label className="col-form-label fw-semibold">가입방식</label>
            </div>
            <div className="col-12 col-md-10">
              <div className="d-flex flex-wrap gap-3">
                {["ALL", "local", "kakao", "naver"].map((v) => (
                  <div className="form-check" key={v}>
                    <input
                      className="form-check-input"
                      type="radio"
                      id={`social-${v}`}
                      name="social"
                      checked={social === v}
                      onChange={() => setSocial(v)}
                    />
                    <label className="form-check-label" htmlFor={`social-${v}`}>
                      {v === "ALL" ? "전체" : v}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-2">
              <label className="col-form-label fw-semibold">가입날짜</label>
            </div>
            <div className="col-6 col-md-3">
              <input type="date" className="form-control" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="col-6 col-md-3">
              <input type="date" className="form-control" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div className="col-12 col-md-4 d-flex gap-2">
              <button className="btn btn-dark">검색</button>
              <button type="button" className="btn btn-outline-secondary" onClick={reset}>초기화</button>
            </div>
          </div>
        </div>
      </div>

      {/* 상단 요약/액션 */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="small text-muted">총 회원수 : {filtered.length}명</div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm">엑셀저장</button>
        </div>
      </div>

      {/* 리스트 (ERD 컬럼만 표시 — 비밀번호는 표기하지 않음) */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr className="text-center">
              <th style={{width: 90}}>회원번호</th>
              <th>회원이메일</th>
              <th>회원닉네임</th>
              <th>가입방식</th>
              <th>회원등급</th>
              <th>가입날짜</th>
              <th>배송지</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">검색 결과가 없습니다.</td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.m_id}>
                  <td className="text-center">{m.m_id}</td>
                  <td>{m.m_email}</td>
                  <td>{m.m_name || "-"}</td>
                  <td className="text-center">{m.m_social}</td>
                  <td className="text-center">{m.m_class}</td>
                  <td className="text-center">{m.m_created}</td>
                  <td>{m.m_address}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Members