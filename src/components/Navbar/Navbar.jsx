import React from "react";
import { useNews } from "../../context/NewsContext";
import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  // Consuming category controls and current active category from context
  const { changeCategory, category: activeCategory } = useNews();
  const navigate = useNavigate();

  const categories = ["home", "world", "politics", "science", "technology"];

  /**
   * Handles navigation and category switching.
   * Ensures the user is redirected to the Home page when a new category is picked.
   */
  const handleCategoryClick = (cat) => {
    changeCategory(cat);
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      <button
        type="button"
        className={styles.logoButton}
        onClick={() => handleCategoryClick("home")}
      >
        <span className={styles.logo}>Elite News</span>
      </button>

      <ul className={styles.navLinks}>
        {categories.map((cat) => (
          <li key={cat} className={styles.navItem}>
            {/* Visual Feedback:
                Adds an 'active' class if the button matches the current category in state.
            */}
            <button
              className={`${styles.link} ${activeCategory === cat ? styles.active : ""}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat.toUpperCase()}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
