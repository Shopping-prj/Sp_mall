import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const STORAGE_KEY = "admin_qna";
const CATEGORIES = ["회원", "주문/결제", "배송", "취소/교환/반품", "상품", "기타"];

const loadQnas = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const saveQnas = (list) => localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

export default function NoticeDetail() {
  const nav = useNavigate();
  const { id } = useParams(); // "new"면 새 글
  const isNew = id === "new" || !id;

  const [form, setForm] = useState({
    id: Date.now(),
    category: "회원",
    title: "",
    content: "",
    writer: "관리자",
    secret: false,
    answer: "",
    createdAt: new Date().toISOString().slice(0,16).replace("T"," "),
  });

  useEffect(() => {
    if (!isNew) {
      const found = loadQnas().find((q) => String(q.id) === String(id));
      if (found) setForm(found);
    }
  }, [id, isNew]);

  const update = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const onSave = () => {
    const list = loadQnas();
    if (isNew) {
      saveQnas([{ ...form }, ...list]);
    } else {
      const idx = list.findIndex((q) => String(q.id) === String(form.id));
      if (idx >= 0) { list[idx] = form; saveQnas(list); }
    }
    nav("/admin/qna");
  };

  const onDelete = () => {
    if (isNew) { nav("/admin/qna"); return; }
    const left = loadQnas().filter((q) => String(q.id) !== String(form.id));
    saveQnas(left);
    nav("/admin/qna");
  };

  return (
    <div className="container py-3">
      <h4 className="fw-semibold mb-3">{isNew ? "QnA 추가" : "QnA 수정"}</h4>

      <div className="card">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">분류</label>
              <select className="form-select" value={form.category} onChange={(e)=>update("category", e.target.value)}>
                {CATEGORIES.map((c)=> <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-md-9">
              <label className="form-label">제목</label>
              <input className="form-control" value={form.title} onChange={(e)=>update("title", e.target.value)} />
            </div>

            <div className="col-12">
              <label className="form-label">내용</label>
              <textarea className="form-control" rows={7} value={form.content} onChange={(e)=>update("content", e.target.value)} />
            </div>

            <div className="col-md-4">
              <label className="form-label">작성자</label>
              <input className="form-control" value={form.writer} onChange={(e)=>update("writer", e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label">등록일</label>
              <input className="form-control" value={form.createdAt} onChange={(e)=>update("createdAt", e.target.value)} />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="secret" checked={form.secret} onChange={(e)=>update("secret", e.target.checked)} />
                <label className="form-check-label" htmlFor="secret">비밀글</label>
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">답변(관리자)</label>
              <textarea className="form-control" rows={6} value={form.answer} onChange={(e)=>update("answer", e.target.value)} placeholder="답변 내용을 입력하세요." />
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-between">
          <div className="d-flex gap-2">
            {!isNew && <button className="btn btn-outline-danger" onClick={onDelete}>삭제</button>}
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-secondary" onClick={()=>nav("/admin/qna")}>취소</button>
            <button className="btn btn-primary" onClick={onSave}>저장</button>
          </div>
        </div>
      </div>
    </div>
  );
}
