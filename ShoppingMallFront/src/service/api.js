// 공통 API 래퍼: BASE + 인증헤더 자동
const API_BASE = (process.env.REACT_APP_API_BASE_URL || "/proxy").replace(/\/$/, "");

async function getAuthToken() {
  // 1) 로컬 JWT 사용하는 경우
  const token = localStorage.getItem("accessToken");
  if (token) return token;

  // 2) Firebase 사용하는 경우 (있으면)
  try {
    const { getAuth } = await import("firebase/auth");
    const user = getAuth().currentUser;
    if (user) return await user.getIdToken(); // Firebase ID token
  } catch (_) {}

  return null;
}

export async function api(path, { method = "GET", headers = {}, body, credentials } = {}) {
  const token = await getAuthToken();
  const finalHeaders = { "Content-Type": "application/json", ...headers };
  if (token) finalHeaders["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
    // 쿠키 세션 쓴다면 'include' 로, JWT만 쓴다면 기본값 둬도 됨.
    credentials: credentials ?? (token ? "include" : "same-origin"),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${text}`.trim());
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}