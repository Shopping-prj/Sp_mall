import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoticeRow from "./NoticeRow";

const STORAGE_KEY = "admin_qna";
const CATEGORIES = ["전체", "회원", "주문/결제", "배송", "취소/교환/반품", "상품", "기타"];
const FIELDS = ["제목", "내용", "작성자"];

const loadQnas = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const saveQnas = (list) => localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

export default function NoticeList() {
  const nav = useNavigate();
  const [qnas, setQnas] = useState([]);
  const [checked, setChecked] = useState(new Set());

  // 검색 상태
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("전체");
  const [field, setField] = useState("제목");

  useEffect(() => { setQnas(loadQnas()); }, []);

  const filtered = useMemo(() => {
    return qnas.filter((q) => {
      if (category !== "전체" && q.category !== category) return false;
      if (keyword.trim()) {
        const t = keyword.toLowerCase();
        const hay =
          field === "제목" ? q.title :
          field === "내용" ? q.content :
          field === "작성자" ? q.writer : "";
        if (!(hay || "").toLowerCase().includes(t)) return false;
      }
      return true;
    });
  }, [qnas, keyword, category, field]);

  const toggleAll = (e) => {
    if (e.target.checked) setChecked(new Set(filtered.map((q) => q.id)));
    else setChecked(new Set());
  };
  const toggleOne = (id) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const reset = () => {
    setKeyword("");
    setCategory("전체");
    setField("제목");
  };

  const removeSelected = () => {
    if (checked.size === 0) return;
    const left = qnas.filter((q) => !checked.has(q.id));
    setQnas(left);
    saveQnas(left);
    setChecked(new Set());
  };

  const removeOne = (id) => {
    const left = qnas.filter((q) => q.id !== id);
    setQnas(left);
    saveQnas(left);
    setChecked((prev) => {
      const n = new Set(prev); n.delete(id); return n;
    });
  };

  return (
    <div className="container-fluid py-3">
      <h4 className="fw-semibold mb-3">FAQ / QnA 관리</h4>

      {/* 검색 영역 */}
      <div className="card mb-3">
        <div className="card-header fw-semibold">기본검색</div>
        <div className="card-body">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-2"><span className="fw-semibold">검색어</span></div>
            <div className="col-6 col-md-2">
              <select className="form-select" value={category} onChange={(e)=>setCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-2">
              <select className="form-select" value={field} onChange={(e)=>setField(e.target.value)}>
                {FIELDS.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-4">
              <input className="form-control" placeholder="검색어 입력" value={keyword} onChange={(e)=>setKeyword(e.target.value)} />
            </div>
            <div className="col-12 col-md-2 d-flex gap-2">
              <button className="btn btn-dark w-100">검색</button>
              <button className="btn btn-outline-secondary w-100" onClick={reset}>초기화</button>
            </div>
          </div>
        </div>
      </div>

      {/* 헤더/버튼 줄 */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="small">전체 : <strong>{filtered.length}</strong> 건 조회</div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-danger btn-sm" onClick={removeSelected}>선택삭제</button>
          <button className="btn btn-primary btn-sm" onClick={()=>nav("/admin/qna/new")}>+ 추가하기</button>
        </div>
      </div>

      {/* 리스트 */}
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr className="text-center">
              <th style={{width:36}}>
                <input type="checkbox"
                  onChange={toggleAll}
                  checked={filtered.length>0 && filtered.length===checked.size}/>
              </th>
              <th style={{width:80}}>번호</th>
              <th style={{width:160}}>분류</th>
              <th>제목</th>
              <th style={{width:160}}>등록일</th>
              <th style={{width:120}}>관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-muted py-4">자료가 없습니다.</td></tr>
            ) : filtered.map((q, idx) => (
              <NoticeRow
                key={q.id}
                index={idx + 1}
                item={q}
                checked={checked.has(q.id)}
                onToggle={()=>toggleOne(q.id)}
                onEdit={()=>nav(`/admin/qna/${q.id}`)}
                onDelete={()=>removeOne(q.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* 하단 버튼 */}
      <div className="d-flex justify-content-between align-items-center mt-2">
        <button className="btn btn-outline-danger btn-sm" onClick={removeSelected}>선택삭제</button>
        <button className="btn btn-primary btn-sm" onClick={()=>nav("/admin/qna/new")}>+ 추가하기</button>
      </div>
    </div>
  );
}
