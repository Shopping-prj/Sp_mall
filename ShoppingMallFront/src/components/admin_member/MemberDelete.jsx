import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_BASE =
  process.env.REACT_APP_SPRING_IP?.replace(/\/$/, "") || ""; // CRA 프록시면 빈 문자열도 OK

export default function MemberDelete() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  // 검색 상태 (정확조회: id or email)
  const [searchType, setSearchType] = useState(
    sp.get("type") === "id" ? "id" : "email"
  );
  const [searchValue, setSearchValue] = useState(sp.get("q") || "");

  // 로딩/알림
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // 대상 회원 & 확인 입력
  const [member, setMember] = useState(null);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    if (sp.get("q")) fetchMember();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMember = async () => {
    const q = searchValue.trim();
    if (!q) {
      setAlert({ type: "warning", msg: "검색값을 입력하세요." });
      return;
    }

    setLoading(true);
    setAlert(null);
    setMember(null);

    try {
      let url = "";
      if (searchType === "id") {
        // 회원번호(m_no)로 정확 매칭
        url = `${API_BASE}/api/admin/members/${encodeURIComponent(q)}`;
      } else {
        // 이메일 정확 매칭 전용 엔드포인트
        url = `${API_BASE}/api/admin/members/by-email?email=${encodeURIComponent(
          q
        )}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`조회 실패 (${res.status})`);
      const data = await res.json(); // 단건 객체 기대
      setMember(data);
      setConfirmText("");
      setAlert({ type: "success", msg: "회원 정보를 불러왔습니다." });
    } catch (err) {
      setAlert({
        type: "danger",
        msg: err.message || "회원 조회 중 오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  const canDelete =
    !!member &&
    confirmText.trim().toLowerCase() ===
      (member?.m_email || "").toLowerCase();

  const handleDelete = async () => {
    if (!member?.m_no) return;
    if (!canDelete) {
      setAlert({ type: "warning", msg: "확인 입력이 올바르지 않습니다." });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const res = await fetch(
        `${API_BASE}/api/admin/members/${encodeURIComponent(member.m_no)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `삭제 실패 (${res.status})`);
      }
      setAlert({ type: "success", msg: "회원이 삭제되었습니다." });
      setTimeout(() => navigate("/admin/member"), 500);
    } catch (err) {
      setAlert({
        type: "danger",
        msg: err.message || "삭제 중 오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-3">
      {/* 헤더/브레드크럼 */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-1 fw-semibold">회원 삭제</h4>
          <div className="text-muted small">
            HOME &gt; 회원관리 &gt; 회원 삭제
          </div>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      {/* 대상 회원 검색 */}
      <div className="card mb-3">
        <div className="card-header fw-semibold">대상 회원 검색</div>
        <div className="card-body">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-2">
              <select
                className="form-select"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="email">이메일로 (정확 일치)</option>
                <option value="id">회원번호로 (정확 일치)</option>
              </select>
            </div>
            <div className="col-12 col-md-6">
              <input
                className="form-control"
                placeholder={
                  searchType === "email"
                    ? "example@domain.com"
                    : "회원번호 (m_no)"
                }
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4 d-flex gap-2">
              <button className="btn btn-dark" onClick={fetchMember} disabled={loading}>
                {loading ? "불러오는 중..." : "불러오기"}
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate("/admin/member")}
              >
                목록
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 대상 회원 요약 */}
      {member && (
        <div className="card mb-3">
          <div className="card-header fw-semibold">회원 정보</div>
          <div className="card-body">
            <div className="row mb-2">
              <div className="col-sm-2 text-muted">회원번호 (m_no)</div>
              <div className="col-sm-4">{member.m_no}</div>
              <div className="col-sm-2 text-muted">가입날짜 (m_created)</div>
              <div className="col-sm-4">{member.m_created || "-"}</div>
            </div>
            <div className="row mb-2">
              <div className="col-sm-2 text-muted">회원이메일 (m_email)</div>
              <div className="col-sm-4">{member.m_email}</div>
              <div className="col-sm-2 text-muted">회원닉네임 (m_name)</div>
              <div className="col-sm-4">{member.m_name || "-"}</div>
            </div>
            <div className="row mb-2">
              <div className="col-sm-2 text-muted">가입방식 (m_social)</div>
              <div className="col-sm-4">{member.m_social || "-"}</div>
              <div className="col-sm-2 text-muted">회원등급 (m_class)</div>
              <div className="col-sm-4">{member.m_class || "-"}</div>
            </div>
            <div className="row">
              <div className="col-sm-2 text-muted">배송지 (m_address)</div>
              <div className="col-sm-10">{member.m_address || "-"}</div>
            </div>
          </div>
        </div>
      )}

      {/* 위험 경고 + 확인 입력 */}
      <div className="alert alert-warning d-flex align-items-center" role="alert">
        <div>
          <strong>주의:</strong> 삭제는 되돌릴 수 없습니다. 확인을 위해 아래 입력창에{" "}
          <code className="mx-1">{member?.m_email || "회원 이메일"}</code>
          을(를) 정확히 입력하세요.
        </div>
      </div>

      <div className="d-flex gap-2 mb-2">
        <input
          className="form-control"
          placeholder={member?.m_email || "회원 이메일을 입력해 확인"}
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          disabled={!member}
        />
        <button
          className="btn btn-danger"
          onClick={handleDelete}
          disabled={!canDelete || loading}
        >
          {loading ? "삭제 중..." : "회원 삭제"}
        </button>
      </div>
    </div>
  );
}