import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = (process.env.REACT_APP_API_BASE_URL || "").replace(/\/$/, "");

export default function BoardList() {
  const nav = useNavigate();
  const [rows, setRows] = useState([]);
  const [checked, setChecked] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/boards`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setErr("목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const allChecked = useMemo(
    () => rows.length > 0 && rows.every((b) => checked.has(b.b_no)),
    [rows, checked]
  );

  const toggleAll = (e) => {
    if (e.target.checked) setChecked(new Set(rows.map((b) => b.b_no)));
    else setChecked(new Set());
  };
  const toggleOne = (id) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const removeOne = async (id) => {
    await fetch(`${API_BASE}/api/admin/boards/${id}`, { method: "DELETE" });
    setRows((prev) => prev.filter((b) => b.b_no !== id));
    setChecked((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
  };

  const removeSelected = async () => {
    if (checked.size === 0) return;
    await Promise.all(
      Array.from(checked).map((id) =>
        fetch(`${API_BASE}/api/admin/boards/${id}`, { method: "DELETE" })
      )
    );
    setRows((prev) => prev.filter((b) => !checked.has(b.b_no)));
    setChecked(new Set());
  };

  const fmt = (v) => {
    if (!v) return "";
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? v : d.toLocaleString("ko-KR");
  };

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className="mb-0 fw-semibold">게시판 관리</h4>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={removeSelected}
          >
            선택삭제
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => nav("/admin/board/new")}
          >
            + 추가하기
          </button>
        </div>
      </div>

      {loading && <div className="alert alert-info">불러오는 중…</div>}
      {err && <div className="alert alert-danger">{err}</div>}

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr className="text-center">
              <th style={{ width: 36 }}>
                <input
                  type="checkbox"
                  onChange={toggleAll}
                  checked={allChecked}
                />
              </th>
              <th style={{ width: 80 }}>번호</th>
              <th>제목</th>
              <th style={{ width: 240 }}>작성자 메일</th>
              <th style={{ width: 200 }}>등록일</th>
              <th style={{ width: 120 }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">
                  자료가 없습니다.
                </td>
              </tr>
            ) : (
              rows.map((b) => (
                <tr key={b.b_no}>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={checked.has(b.b_no)}
                      onChange={() => toggleOne(b.b_no)}
                    />
                  </td>
                  <td className="text-center">{b.b_no}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-link p-0 text-start"
                      onClick={() => nav(`/admin/board/${b.b_no}/edit`)}
                    >
                      {b.b_title || "(제목 없음)"}
                    </button>
                  </td>
                  <td className="text-center">{b.b_email}</td>
                  <td className="text-center">{fmt(b.b_date)}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => nav(`/admin/board/${b.b_no}/edit`)}
                      >
                        수정
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeOne(b.b_no)}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
