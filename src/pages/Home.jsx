import React from "react";
import { useNews } from "../context/NewsContext";
import ArticleCard from "../components/ArticleCard/ArticleCard";
import styles from "../components/ArticleCard/ArticleCard.module.css";

const Home = () => {
  const { news, error, loading } = useNews();

  /**
   * Improved data sanitisation:
   * Removed check on multimedia.length.
   * Accept all articles that have at least one URL and one title.
   */
  const filteredNews = news
    ? news.filter(
        (article) => article.url && (article.title || article.headline?.main),
      )
    : [];

  return (
    <div className="grid-layout">
      {/* Loading screen */}
      {loading &&
        Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonImage}></div>
              <div className={styles.skeletonText}>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
              </div>
            </div>
          ))}

      {/* Error Message */}
      {!loading && error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* Rendering of articles with placeholders enabled */}
      {!loading &&
        !error &&
        filteredNews.length > 0 &&
        filteredNews.map((article) => (
          <ArticleCard key={article.url} article={article} />
        ))}

      {/* Fallback if the category is empty */}
      {!loading && !error && filteredNews.length === 0 && (
        <p>No articles found in this category.</p>
      )}
    </div>
  );
};

export default Home;
