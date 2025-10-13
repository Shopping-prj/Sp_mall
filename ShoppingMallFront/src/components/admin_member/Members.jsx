import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = (process.env.REACT_APP_SPRING_IP || "/proxy").replace(/\/$/, "");

export default function Members() {
  const [keywordType, setKeywordType] = useState("email"); // email | name
  const [keyword, setKeyword] = useState("");
  const [cls, setCls] = useState("ALL");                   // USER | ADMIN | ALL
  const [social, setSocial] = useState("ALL");             // LOCAL | KAKAO | NAVER | GOOGLE | ALL
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [rows, setRows] = useState([]);    
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchMembers = async () => {
    setLoading(true);
    setAlert(null);
    try {
      const q = new URLSearchParams();
      if (keyword)     q.set("keyword", keyword.trim());
      if (keywordType) q.set("keywordType", keywordType);
      if (cls !== "ALL")     q.set("cls", cls);
      if (social !== "ALL")  q.set("social", social);
      if (from) q.set("from", from);
      if (to)   q.set("to", to);

      const url = `${API_BASE}/api/admin/members${q.toString() ? `?${q}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`조회 실패 (${res.status})`);
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
      setAlert(
        !Array.isArray(data) || data.length === 0
          ? { type: "warning", msg: "검색 결과가 없습니다." }
          : { type: "success", msg: `총 ${data.length}명 조회되었습니다.` }
      );
    } catch (e) {
      setAlert({ type: "danger", msg: e.message || "조회 중 오류가 발생했습니다." });
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setKeywordType("email");
    setKeyword("");
    setCls("ALL");
    setSocial("ALL");
    setFrom("");
    setTo("");
    setRows([]);
    setAlert(null);
  };

  const total = useMemo(() => rows.length, [rows]);

  const fmtDateTime = (v) => {
    if (!v) return "-";
    try {
      const d = typeof v === "string" ? new Date(v.replace(" ", "T")) : new Date(v);
      if (isNaN(d)) return v;
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    } catch { return String(v); }
  };

  const downloadCsv = () => {
    if (!rows.length) return;
    const header = ["m_no","m_email","m_name","m_social","m_class","m_created","m_address"];
    const escape = (s) => {
      const v = s == null ? "" : String(s);
      return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
    };
    const body = rows
      .map(r => header.map(h => escape(h === "m_created" ? fmtDateTime(r[h]) : r[h])).join(","))
      .join("\n");
    const csv = header.join(",") + "\n" + body;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `members_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="container-fluid py-3">
      {/* 헤더 */}
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
          {/* 검색어 */}
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

          {/* 회원등급 */}
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

          {/* 가입방식 */}
          <div className="row g-3 align-items-center mb-2">
            <div className="col-12 col-md-2">
              <label className="col-form-label fw-semibold">가입방식</label>
            </div>
            <div className="col-12 col-md-10">
              <div className="d-flex flex-wrap gap-3">
                {["ALL", "LOCAL", "KAKAO", "NAVER", "GOOGLE"].map((v) => (
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

          {/* 가입날짜 */}
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
              <button className="btn btn-dark" onClick={fetchMembers} disabled={loading}>
                {loading ? "검색 중..." : "검색"}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={reset}>초기화</button>
            </div>
          </div>
        </div>
      </div>

      {/* 상단 요약 */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="small text-muted">총 회원수 : {total}명</div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={downloadCsv} disabled={!rows.length}>
            엑셀저장
          </button>
        </div>
      </div>

      {/* 리스트 */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr className="text-center">
              <th style={{width: 110}}>회원번호</th>
              <th>회원이메일</th>
              <th>회원닉네임</th>
              <th>가입방식</th>
              <th>회원등급</th>
              <th>가입날짜</th>
              <th>주소</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">검색 결과가 없습니다.</td>
              </tr>
            ) : (
              rows.map((m) => (
                <tr key={m.m_no}>
                  <td className="text-center">{m.m_no}</td>
                  <td>{m.m_email}</td>
                  <td>{m.m_name || "-"}</td>
                  <td className="text-center">{m.m_social}</td>
                  <td className="text-center">{m.m_class}</td>
                  <td className="text-center">{fmtDateTime(m.m_created)}</td>
                  <td>{m.m_address}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {alert && <div className={`alert alert-${alert.type} mt-2`}>{alert.msg}</div>}
    </div>
  );
}