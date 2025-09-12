import { Route, Routes } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import MemoPage from "./components/pages/MemoPage";
import MemoDetail from "./components/memo/MemoDetail";
import CalendarMain from "./components/pages/CalendarMain";
import NaverSearchPage from "./components/pages/NaverSearchPage";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cal" element={<CalendarMain />} />
        <Route path="/naverSearch" element={<NaverSearchPage />} />
        <Route path="/memo" element={<MemoPage />} />
        <Route path="/memo/detail/:m_no" element={<MemoDetail />} />
      </Routes>
    </>
  );
}
export default App