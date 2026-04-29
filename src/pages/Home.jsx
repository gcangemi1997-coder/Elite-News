import React from "react";
import { useNews } from "../context/NewsContext";
import ArticleCard from "../components/ArticleCard/ArticleCard";
import styles from "../components/ArticleCard/ArticleCard.module.css";

const Home = () => {
  const { news, error, loading } = useNews();

  /**
   * Data Sanitization Migliorata:
   * Rimuoviamo il controllo su multimedia.length.
   * Ora accettiamo tutti gli articoli che hanno almeno un URL e un titolo.
   */
  const filteredNews = news
    ? news.filter(
        (article) => article.url && (article.title || article.headline?.main),
      )
    : [];

  return (
    <div className="grid-layout">
      {/* Skeleton Screen per il caricamento */}
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

      {/* Messaggio di Errore */}
      {!loading && error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* Rendering degli articoli con Placeholder abilitato */}
      {!loading &&
        !error &&
        filteredNews.length > 0 &&
        filteredNews.map((article) => (
          <ArticleCard key={article.url} article={article} />
        ))}

      {/* Fallback se la categoria è vuota */}
      {!loading && !error && filteredNews.length === 0 && (
        <p>Nessun articolo trovato in questa categoria.</p>
      )}
    </div>
  );
};

export default Home;
