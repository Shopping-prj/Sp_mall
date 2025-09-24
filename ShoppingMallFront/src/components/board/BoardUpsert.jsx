import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BoardCommentForm from "./BoardCommentForm";
import BoardCommentList from "./BoardCommentList";

const API_BASE = (process.env.REACT_APP_API_BASE_URL || "").replace(/\/$/, "");

// 응답/파라미터 어떤 케이스가 와도 스네이크로 정규화
const normalizeToSnake = (src = {}) => ({
  b_no: src.b_no ?? src.bNo ?? src.id ?? null,
  b_email: src.b_email ?? src.bEmail ?? src.email ?? "",
  b_title: src.b_title ?? src.bTitle ?? src.title ?? "",
  b_content: src.b_content ?? src.bContent ?? src.content ?? "",
  b_date: src.b_date ?? src.bDate ?? src.date ?? null,
});

export default function BoardUpsert() {
  const nav = useNavigate();
  const params = useParams();
  const bno = params.b_no ?? params.id ?? params.bNo ?? null; // 어떤 이름이든 지원
  const isEdit = useMemo(() => Boolean(bno), [bno]);

  const [form, setForm] = useState({
    b_email: "",
    b_title: "",
    b_content: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // 수정 모드면 기존 데이터 프리필
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(`${API_BASE}/api/admin/boards/${bno}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.json();
        const data = normalizeToSnake(raw);
        setForm({
          b_email: data.b_email ?? "",
          b_title: data.b_title ?? "",
          b_content: data.b_content ?? "",
        });
      } catch (e) {
        console.error("[BoardUpsert] load error:", e);
        setErr("게시글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [isEdit, bno]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.b_email.trim()) return "작성자 이메일을 입력하세요.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.b_email))
      return "이메일 형식이 올바르지 않습니다.";
    if (!form.b_title.trim()) return "제목을 입력하세요.";
    if (!form.b_content.trim()) return "내용을 입력하세요.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) { setErr(v); return; }

    setSaving(true);
    setErr("");
    try {
      const url = isEdit
        ? `${API_BASE}/api/admin/boards/${bno}`
        : `${API_BASE}/api/admin/boards`;
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // b_email/b_title/b_content 그대로 전송
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      nav("/admin/board");
    } catch (e) {
      console.error("[BoardUpsert] save error:", e);
      setErr(isEdit ? "수정에 실패했습니다." : "등록에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="container py-3">
      <div className="alert alert-info">불러오는 중…</div>
    </div>
  );

  return (
    <div className="container" style={{ maxWidth: 860 }}>
      <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
        <h4 className="mb-0 fw-semibold">{isEdit ? "게시글 수정" : "게시글 작성"}</h4>
        <button className="btn btn-outline-secondary" onClick={() => nav("/admin/board")}>목록</button>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}

      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">작성자 이메일</label>
          <input
            type="email"
            className="form-control"
            name="b_email"
            value={form.b_email}
            onChange={onChange}
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">제목</label>
          <input
            className="form-control"
            name="b_title"
            value={form.b_title}
            onChange={onChange}
            placeholder="제목을 입력하세요"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">내용</label>
          <textarea
            className="form-control"
            name="b_content"
            rows={10}
            value={form.b_content}
            onChange={onChange}
            placeholder="내용을 입력하세요"
          />
          </div>
          
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={() => nav("/admin/board")}>
            취소
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? (isEdit ? "수정 중…" : "등록 중…") : (isEdit ? "수정하기" : "등록하기")}
          </button>
        </div>
      </form>
      {isEdit && (
      <>
        <hr className="my-4" />
        <BoardCommentForm b_no={Number(bno)} onAdded={() => {/* 목록 컴포넌트에 ref나 key로 리로드 */}} />
        <BoardCommentList key={bno} b_no={Number(bno)} />
      </>
    )}
    </div>
  );
}
