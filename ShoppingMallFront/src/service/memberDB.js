import axios from "axios";

// 로컬 로그인 요청
export const loginMember = async (m_email, m_password) => {
  const res = await axios({
    method: "post",
    url: `${process.env.REACT_APP_SPRING_IP}/api/users/login`,
    data: {
      m_email,   // Spring Security 기본 파라미터명
      m_password,
    },
    headers: { "Content-Type": "application/json" },
  });

  return res.data;
};
