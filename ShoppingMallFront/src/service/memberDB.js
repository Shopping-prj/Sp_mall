import api from "./axios";

/** 로그인 (기존 그대로) */
export const loginMember = async (m_email, m_password) => {
  const res = await api({
    method: "post",
    url: "/api/users/login",
    data: { m_email, m_password },
    headers: { "Content-Type": "application/json" },
  });
  return res.data; // accessToken, refreshToken, member, role 포함
};

/** 내 정보 조회 (토큰 기반) — MyPage/Member 진입 시 사용 */
export const getMyInfo = async () => {
  const res = await api({
    method: "get",
    url: "/api/users/me",
  });
  return res.data; // { m_email, m_name, m_address, m_class, ... }
};

/** 이름/주소 수정 (비밀번호 제외!)  */
export const updateMemberProfile = async ({ m_email, m_name, m_address }) => {
  // 서버: /api/mypage/update (Member 객체로 받음)
  const res = await api({
    method: "post",
    url: "/api/mypage/update",
    data: { m_email, m_name, m_address }, // 비번은 절대 보내지 않음
  });
  return res.data; // 1 (성공) / 0 (실패)
};

/** 비밀번호 변경 (전용 엔드포인트, 서버가 해시 저장) */
export const updateMyPassword = async (newPassword) => {
  // 서버는 text/plain으로 받도록 구현되어 있음
  const res = await api({
    method: "patch",
    url: "/api/users/me/password",
    data: newPassword,
    headers: { "Content-Type": "text/plain" },
  });
  return res.status; // 204 기대
};

// ✅ 비밀번호 검증 API
export const verifyPassword = async (password) => {
  const res = await api({
    method: "post",
    url: "/api/users/verify-password",
    data: { password },
    headers: { "Content-Type": "application/json" },
  });
  return res.status; // 200이면 성공
};

// ✅ 회원 탈퇴 요청 (Access Token 자동 포함됨)
/* export const memberSignOut = async (m_email) => {
  const res = await api.delete(`/api/users/delete/${encodeURIComponent(m_email)}`);
  return res.status; // 204면 성공
}; */

export const memberSignOut = async (m_email) => {
  if (!m_email) throw new Error("email이 비어 있습니다.");
  const res = await api({
    method: "delete",
    url: `/api/users/delete/${encodeURIComponent(m_email)}`,
    headers: { "Content-Type": "application/json" },
  });
  return res.status; // 200이면 성공
};

