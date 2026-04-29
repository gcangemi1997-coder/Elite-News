import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import ArticleDetail from "./pages/ArticleDetail/ArticleDetail";
import "./styles/App.css";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        {/* The Navbar remains static across all pages */}
        <Navbar />
        <main className="main-container">
          <Routes>
            {/* Route for the main news feed */}
            <Route path="/" element={<Home />} />
            {/* Route for the single article view using a dynamic parameter (:title) */}
            <Route path="/article/:title" element={<ArticleDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
