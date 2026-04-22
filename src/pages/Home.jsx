import React from "react";
import { useNews } from "../context/NewsContext";
import ArticleCard from "../components/ArticleCard/ArticleCard";
import styles from "../components/ArticleCard/ArticleCard.module.css";

const Home = () => {
  // Extracting news data, error status, and loading state from the global NewsContext
  const { news, error, loading } = useNews();

  // Error Boundary: Displays a message to the user if the API fetch fails
  if (error) return <div className="error-message">{error}</div>;

  /**
   * Data Sanitization:
   * We filter the news array to ensure only articles with valid multimedia content
   * are displayed, maintaining a consistent and high-quality visual layout.
   */
  const filteredNews = news
    ? news.filter(
        (article) => article.multimedia && article.multimedia.length > 0,
      )
    : [];

  return (
    <div className="grid-layout">
      {loading
        ? /* UX Improvement: While data is fetching, we render a "Skeleton Screen" 
             (6 placeholder cards) to reduce perceived waiting time. 
          */
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
            ))
        : /* Conditional Rendering: 
             If data exists, map through the filtered array to render ArticleCard components.
             Otherwise, display a fallback message if no results are found.
          */
          filteredNews.length > 0
          ? filteredNews.map((article, index) => (
              <ArticleCard key={index} article={article} />
            ))
          : !loading && <p>Nessun articolo trovato in questa categoria.</p>}
    </div>
  );
};

export default Home;
