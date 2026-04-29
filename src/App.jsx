import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import ArticleDetail from "./pages/ArticleDetail/ArticleDetail";
import "./styles/App.css";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="App">
        <Navbar />
        <main className="main-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:uri" element={<ArticleDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
