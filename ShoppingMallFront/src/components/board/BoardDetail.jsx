// BoardDetail.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BoardDetail({ b_no }) {
  const [board, setBoard] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get(`/api/board/${b_no}`).then((res) => setBoard(res.data));
    axios.get(`/api/comment/board/${b_no}`).then((res) => setComments(res.data));
  }, [b_no]);

  return (
    <>
    <div>
      {board && (
        <>
          <h2>{board.b_title}</h2>
          <p>{board.b_content}</p>
          <p>작성자: {board.b_email} | {new Date(board.b_date).toLocaleString()}</p>
        </>
      )}

      <h3>댓글</h3>
      <ul>
        {comments.map((c) => (
          <li key={c.bc_no}>
            {c.bc_comment} ({c.bc_email})
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}