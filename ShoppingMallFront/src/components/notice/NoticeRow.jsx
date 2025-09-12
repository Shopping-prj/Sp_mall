import React from "react";

export default function NoticeRow({ index, item, checked, onToggle, onEdit, onDelete }) {
  return (
    <tr>
      <td className="text-center">
        <input type="checkbox" checked={checked} onChange={onToggle} />
      </td>
      <td className="text-center">{index}</td>
      <td className="text-center">{item.category}</td>
      <td>
        <button className="btn btn-link p-0 text-decoration-none" onClick={onEdit}>
          {item.title}
        </button>
        {item.secret && <span className="badge text-bg-secondary ms-2">비밀글</span>}
        {item.answer && <span className="badge text-bg-success ms-2">답변완료</span>}
      </td>
      <td className="text-center">{item.createdAt}</td>
      <td className="text-center">
        <div className="btn-group btn-group-sm">
          <button className="btn btn-outline-primary" onClick={onEdit}>수정</button>
          <button className="btn btn-outline-danger" onClick={onDelete}>삭제</button>
        </div>
      </td>
    </tr>
  );
}
