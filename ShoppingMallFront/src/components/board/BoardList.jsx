import React, { useEffect, useState } from "react";
import axios from "axios";

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [b_title, setBTitle] = useState("");
  const [b_content, setBContent] = useState("");
  const [b_writer, setBWriter] = useState("");

  const BASE_URL = `${process.env.REACT_APP_SPRING_IP}/api/boards`;

  // 게시판 목록 가져오기
  const fetchBoards = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setBoards(res.data);
    } catch (error) {
      console.error("게시판 조회 실패", error);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  // 단건 조회
  const handleSelect = async (b_no) => {
    try {
      const res = await axios.get(`${BASE_URL}/${b_no}`);
      setSelectedBoard(res.data);
      setBTitle(res.data.b_title);
      setBContent(res.data.b_content);
      setBWriter(res.data.b_writer);
    } catch (error) {
      console.error("상세 조회 실패", error);
    }
  };

  // 삭제
  const handleDelete = async (b_no) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`${BASE_URL}/${b_no}`);
      alert("삭제 완료!");
      fetchBoards();
    } catch (error) {
      console.error("게시글 삭제 실패", error);
    }
  };

  // 수정
  const handleUpdate = async () => {
    if (!selectedBoard) return;
    try {
      await axios.put(`${BASE_URL}/${selectedBoard.b_no}`, {
        b_title,
        b_content,
        b_writer,
      });
      alert("수정 완료!");
      setSelectedBoard(null);
      fetchBoards();
    } catch (error) {
      console.error("게시글 수정 실패", error);
    }
  };

  const handleClose = () => {
    setSelectedBoard(null);
  };

  return (
    <div className="container mt-4">
      <h3>게시판</h3>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {boards.map((board) => (
            <tr key={board.b_no}>
              <td>{board.b_no}</td>
              <td>
                <span
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={() => handleSelect(board.b_no)}
                >
                  {board.b_title}
                </span>
              </td>
              <td>{board.b_writer}</td>
              <td>{board.b_created}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(board.b_no)}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedBoard && (
        <div className="card mt-4">
          <div className="card-body">
            <h5>게시글 수정</h5>
            <div className="mb-2">
              <label>작성자</label>
              <input
                type="text"
                className="form-control"
                value={b_writer}
                onChange={(e) => setBWriter(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label>제목</label>
              <input
                type="text"
                className="form-control"
                value={b_title}
                onChange={(e) => setBTitle(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label>내용</label>
              <textarea
                className="form-control"
                value={b_content}
                onChange={(e) => setBContent(e.target.value)}
              />
            </div>
            <button className="btn btn-success me-2" onClick={handleUpdate}>
              저장
            </button>
            <button className="btn btn-secondary" onClick={handleClose}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardList;