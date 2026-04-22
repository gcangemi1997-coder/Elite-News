import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ArticleDetail.module.css";

const ArticleDetail = () => {
  // Hooks to access the current routing state and trigger navigation
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Data Extraction:
   * We retrieve the 'article' object passed through the Link's state.
   * If the user reloads the page, location.state becomes null,
   * so we provide an empty object as a fallback to prevent immediate crashes.
   */
  const { article } = location.state || {};

  /**
   * Defensive Rendering (Point 2 of the review):
   * If the article data is missing (e.g., after a page refresh),
   * we display a user-friendly error box instead of a blank page.
   */
  if (!article) {
    return (
      <div
        className={styles.container}
        style={{ textAlign: "center", marginTop: "100px" }}
      >
        <div
          style={{
            border: "3px solid black",
            padding: "30px",
            boxShadow: "10px 10px 0px black",
            display: "inline-block",
            backgroundColor: "white",
          }}
        >
          <h2
            className={styles.title}
            style={{ fontSize: "2rem", marginBottom: "10px" }}
          >
            DATAS NOT FOUND
          </h2>
          <p style={{ fontWeight: "bold", marginBottom: "20px" }}>
            Page has been reloaded or the article is no longer in memory.
          </p>
          <button className={styles.backButton} onClick={() => navigate("/")}>
            ← BACK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Navigation: navigate(-1) takes the user back to the previous history entry */}
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        ← BACK TO HOME
      </button>

      <div className={styles.imageWrapper}>
        <img
          src={
            article.multimedia?.[0]?.url ||
            "https://via.placeholder.com/800x400?text=No+Image"
          }
          alt=""
          className={styles.mainImage}
        />
      </div>

      <h1 className={styles.title}>{article.title}</h1>
      <p className={styles.abstract}>{article.abstract}</p>

      <div className={styles.meta}>
        <p style={{ textAlign: "right" }}>
          <strong>Autore:</strong> {article.byline}
        </p>
        {/* External Link: target="_blank" and rel="noreferrer" for security and UX */}
        <a
          href={article.url}
          target="_blank"
          rel="noreferrer"
          className={styles.sourceLink}
        >
          READ ON NEW YORK TIMES
        </a>
      </div>
    </div>
  );
};

export default ArticleDetail;
