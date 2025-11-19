import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import OAuthCallback from "./pages/OAuthCallback";
import Signup from "./pages/Signup";
import FindAccount from "./pages/FindAccount";
import AdminPage from "./pages/AdminPage";
import DiseaseResultPage from "./pages/DiseaseResultPage";
import SearchResultPage from "./pages/SearchResultPage";
import MyPage from "./pages/Mypage";
import Terms from "./pages/static/Terms";
import Privacy from "./pages/static/Privacy";
import Partners from "./pages/static/Partners";
import About from "./pages/service/About";
import Notice from "./pages/service/Notice";
import Event from "./pages/service/Event";
import FAQ from "./pages/support/FAQ";
import CustomerService from "./pages/support/CustomerService";
import Inquiry from "./pages/support/Inquiry";
import Profile from "./components/sections/MyPage/Profile";
import MyReview from "./components/sections/MyPage/MyReview";
import DeleteAccount from "./components/sections/MyPage/DeleteAccount";

// 페이지 전환 시 스크롤을 맨 위로 리셋하는 컴포넌트
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/find-account" element={<FindAccount />} />
        <Route path="/find-id" element={<FindAccount />} />
        <Route path="/find-pass" element={<FindAccount />} />
        <Route path="/admin-dashboard" element={<AdminPage />} />
        <Route path="/admin/members" element={<AdminPage />} />
        <Route path="/admin/notice" element={<AdminPage />} />
        <Route path="/disease-result" element={<DiseaseResultPage />} />
        <Route path="/search-result" element={<SearchResultPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/about" element={<About />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/event" element={<Event />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/customer-service" element={<CustomerService />} />
        <Route path="/inquiry" element={<Inquiry />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/profile" element={<Profile />} />
        <Route path="/mypage/reviews" element={<MyReview />} />
        <Route path="/mypage/delete" element={<DeleteAccount />} />
      </Routes>
    </Router>
  );
}

export default App;
