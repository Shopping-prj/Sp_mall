import { useState } from "react";

// 태그(<b>) 제거만 수행
const stripTags = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

const NaverSearchPage = () => {
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const onSearch = async (e) => {
    e.preventDefault();
    setError("");
    setItems([]);

    try {
      const res = await fetch(`/api/shop?query=${q}&display=10&sort=sim`);

      const ct = res.headers.get("content-type") || "";
      const txt = await res.text();

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}\n${txt.slice(0,200)}`);
      }
      if (!ct.includes("application/json")) {
        throw new Error(`JSON 아님: ${ct}\n${txt.slice(0,200)}`);
      }

      const data = JSON.parse(txt);
      setItems(data.items || []);
    } catch (err) {
      setError(String(err));
      console.error("API 호출 오류:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <form onSubmit={onSearch} style={{ marginBottom: 12 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="검색어"
          style={{ padding: 6, width: 260, marginRight: 8 }}
        />
        <button type="submit">검색</button>
      </form>

      {error && <pre style={{ color: "crimson" }}>{error}</pre>}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>이미지</th>
            <th>상품명</th>
            <th>최저가</th>
            <th>판매몰</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i} style={{ borderTop: "1px solid #ddd" }}>
              <td>
                <img src={it.image} alt="" width="50" height="70" />
              </td>
              <td>
                <a href={it.link} target="_blank" rel="noreferrer">
                  {stripTags(it.title)}
                </a>
              </td>
              <td>{it.lprice}</td>
              <td>{it.mallName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NaverSearchPage;
