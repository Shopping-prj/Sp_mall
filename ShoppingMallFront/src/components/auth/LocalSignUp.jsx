import { useState } from 'react';
import '../style/MainBoard.css';
import { useNavigate } from 'react-router-dom';
import '../style/Enroll.css';

const LocalSignUp = () => {
  const navigate = useNavigate();
  // 회원 한 명 정보
  const [member, setMember] = useState({
    id: '',
    passwd: '',
    name: '',
    email: '',
  });

  // 모든 회원 목록 (HashMap 비슷한 구조)
  const [memberList, setMemberList] = useState([]);

  // 입력 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember(prev => ({ ...prev, [name]: value }));
  };

const memberInsert = () => {
  // 기존 localStorage에 있는 회원 목록 가져오기
  const existingMembers = JSON.parse(localStorage.getItem("localUsers")) || [];

  // ID 중복 검사
  const isDuplicate = existingMembers.some((m) => m.id === member.id);
  if (isDuplicate) {
    alert("이미 사용 중인 ID입니다.");
    return;
  }

  // 새로운 회원 추가
  const updatedList = [...existingMembers, member];

  // localStorage에 저장
  localStorage.setItem("localUsers", JSON.stringify(updatedList));

  // 상태에도 반영 (선택사항, 즉시 UI 확인용)
  setMemberList(updatedList);

  console.log("📌 저장된 회원 목록:", updatedList);

  alert("회원가입 완료!");
  navigate('/login'); // 로그인 페이지로 이동
};

  // 폼 초기화
  const memberInit = () => {
    setMember({
      id: '',
      passwd: '',
      name: '',
      email: '',
    });
  };

  return (
    <>
      <h2 align="center">회원 가입 하기</h2>
      <hr />
      <section id="myinfo">
        <table>
          <tbody>
            <tr>
              <td>ID :</td>
              <td><input type="text" name="id" id="userid" value={member.id} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>Password :</td>
              <td><input type="password" name="passwd" value={member.passwd} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>이름 :</td>
              <td><input type="text" name="name" value={member.name} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>E-Mail :</td>
              <td><input type="email" name="email" value={member.email} onChange={handleChange} /></td>
            </tr>
          </tbody>
        </table>
        <p align="center">
          <button type="button" onClick={memberInsert}>회원 가입하기</button> &nbsp; &nbsp;
          <button type="reset" onClick={memberInit}>작성 양식 초기화</button>
        </p>
      </section>
    </>
  );
};

export default LocalSignUp;