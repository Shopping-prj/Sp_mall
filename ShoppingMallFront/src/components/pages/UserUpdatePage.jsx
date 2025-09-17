import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../include/Header";

const UserUpdatePage = ({ email }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    m_id: "",
    m_email: "",
    m_password: "",
    m_name: "",
    m_social: "",
    m_class: "",
    m_created: ""
  });
  const [emailLocal, setEmailLocal] = useState(""); // @ 앞부분
  const [emailDomain, setEmailDomain] = useState(""); // @ 뒤부분
  const [loading, setLoading] = useState(false); // 수정 요청 로딩 상태

  // 회원정보 불러오기
  const fetchUserInfo = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/member/detail", {
        params: { email }
      });
      setFormData(res.data);
      if (res.data.m_email.includes("@")) {
        const [local, domain] = res.data.m_email.split("@");
        setEmailLocal(local);
        setEmailDomain(domain);
      } else {
        setEmailLocal(res.data.m_email);
      }
    } catch (err) {
      //console.error("회원 정보 조회 실패", err);
      //alert("회원 정보 불러오기 중 오류 발생");
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [email]);

  // 입력값 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 이메일 local/도메인 변경
  const handleEmailLocalChange = (e) => {
    const local = e.target.value;
    setEmailLocal(local);
    setFormData(prev => ({ ...prev, m_email: local + (emailDomain ? "@" + emailDomain : "") }));
  };

  const handleEmailDomainChange = (e) => {
    const domain = e.target.value;
    setEmailDomain(domain);
    setFormData(prev => ({ ...prev, m_email: emailLocal + (domain ? "@" + domain : "") }));
  };

  // 수정 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 로딩 시작
    try {
      const res = await axios.post("http://localhost:8000/api/member/update", formData);

      if (res.status === 200) {
        alert("회원정보가 성공적으로 수정되었습니다.");
        navigate("/mypage"); // 수정 후 마이페이지 이동
      } else {
        alert("회원정보 수정 실패: 서버 오류");
        console.error("서버 응답:", res);
      }
    } catch (err) {
      console.error("회원정보 수정 실패", err);
      if (err.response) {
        alert(`수정 실패: ${err.response.data.message || err.response.statusText}`);
      } else {
        alert("수정 실패: 서버에 연결할 수 없습니다.");
      }
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <>
      <Header />
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label>아이디</label>
          <input type="id" className="form-control" name="m_id" value={formData.m_id} readOnly />
        </div>

        <div className="mb-3">
          <label>이메일</label>
          <div className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="아이디"
              value={emailLocal}
              onChange={handleEmailLocalChange}
            />
            <span className="me-2">@</span>
            <select className="form-select" value={emailDomain} onChange={handleEmailDomainChange}>
              <option value="">직접입력</option>
              <option value="naver.com">naver.com</option>
              <option value="gmail.com">gmail.com</option>
              <option value="hanmail.net">hanmail.net</option>
              <option value="daum.net">daum.net</option>
            </select>
            {emailDomain === "" && (
              <input
                type="text"
                className="form-control ms-2"
                placeholder="직접 입력"
                value={emailDomain}
                onChange={handleEmailDomainChange}
              />
            )}
          </div>
        </div>

        <div className="mb-3">
          <label>비밀번호</label>
          <input type="password" className="form-control" name="m_password" value={formData.m_password || ""} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>닉네임</label>
          <input type="text" className="form-control" name="m_name" value={formData.m_name || ""} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>가입방식</label>
          <input type="text" className="form-control" name="m_social" value={formData.m_social || ""} readOnly />
        </div>

        <div className="mb-3">
          <label>회원등급</label>
          <input type="text" className="form-control bg-light text-muted" name="m_class" value={formData.m_class || ""} readOnly />
        </div>

        <div className="mb-3">
          <label>가입날짜</label>
          <input type="text" className="form-control" name="m_created" value={formData.m_created || ""} readOnly />
        </div>

        <button type="submit" className="btn btn-gradient-green me-2" disabled={loading}>
          {loading ? "수정 중..." : "회원정보 수정"}
        </button>
        <button type="button" className="btn btn-gradient-green" onClick={() => navigate("/mypage")}>
          이전으로
        </button>
      </form>
    </>
  );
};

export default UserUpdatePage;