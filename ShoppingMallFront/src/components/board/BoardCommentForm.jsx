import React, { useState } from "react";
const API_BASE = (process.env.REACT_APP_API_BASE_URL || "").replace(/\/$/, "");

export default function BoardCommentForm({ b_no, onAdded }) {
  const [form, setForm] = useState({ bc_email: "", bc_comment: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.bc_email.trim() || !form.bc_comment.trim()) {
      setErr("이메일/내용을 입력하세요.");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, b_no }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setForm({ bc_email: "", bc_comment: "" });
      onAdded?.(); // 목록 새로고침
    } catch (e) {
      console.error(e);
      setErr("댓글 등록에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-3">
      {err && <div className="alert alert-danger">{err}</div>}
      <div className="row g-2">
        <div className="col-12 col-md-3">
          <input
            className="form-control"
            name="bc_email"
            placeholder="you@example.com"
            value={form.bc_email}
            onChange={onChange}
          />
        </div>
        <div className="col-12 col-md-7">
          <input
            className="form-control"
            name="bc_comment"
            placeholder="댓글 내용을 입력하세요"
            value={form.bc_comment}
            onChange={onChange}
          />
        </div>
        <div className="col-12 col-md-2 d-grid">
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "등록 중…" : "댓글 등록"}
          </button>
        </div>
      </div>
    </form>
  );
}
