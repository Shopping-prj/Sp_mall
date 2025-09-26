import React, { useEffect, useState } from "react";
const API_BASE = (process.env.REACT_APP_SPRING_IP || "").replace(/\/$/, "");

export default function BoardCommentList({ b_no }) {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/comments/board/${b_no}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setErr("댓글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [b_no]);

  const removeOne = async (bc_no) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    await fetch(`${API_BASE}/api/admin/comments/${bc_no}`, { method: "DELETE" });
    setRows((prev) => prev.filter((c) => c.bc_no !== bc_no));
  };

  if (loading) return <div className="mt-3 alert alert-info">댓글 불러오는 중…</div>;

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">댓글 ({rows.length})</h5>
      </div>
      {err && <div className="alert alert-danger">{err}</div>}
      {rows.length === 0 ? (
        <div className="text-muted">등록된 댓글이 없습니다.</div>
      ) : (
        <ul className="list-group">
          {rows.map((c) => (
            <li key={c.bc_no} className="list-group-item">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="fw-semibold">{c.bc_email}</div>
                  <div className="text-break">{c.bc_comment}</div>
                  <div className="text-muted small">{c.bc_date}</div>
                </div>
                <div>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => removeOne(c.bc_no)}>
                    삭제
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
