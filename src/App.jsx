import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import ArticleDetail from "./pages/ArticleDetail/ArticleDetail";
import "./styles/App.css";

function App() {
  return (
    /* BrowserRouter enables navigation between different components without refreshing the page */
    <Router>
      <div className="App">
        {/* The Navbar remains static across all pages */}
        <Navbar />
        <main className="main-container">
          <Routes>
            {/* Route for the main news feed */}
            <Route path="/" element={<Home />} />
            {/* Route for the single article view using a dynamic parameter (:id) */}
            <Route path="/article/:id" element={<ArticleDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
