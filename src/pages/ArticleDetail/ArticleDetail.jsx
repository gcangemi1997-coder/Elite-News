import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./ArticleDetail.module.css";

const ArticleDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title } = useParams();

  // Let’s start with the navigation state (immediate UX)
  const [article, setArticle] = useState(location.state?.article || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the fallback only if the article is not present (e.g. on refresh)
    if (!article && title) {
      const fetchArticleByTitle = async () => {
        setLoading(true);
        setError(null);

        try {
          const apiKey = import.meta.env.VITE_NYT_API_KEY;
          const decodedTitle = decodeURIComponent(title);

          // Use Filter Query (fq) to perform a precise search on the headline
          const response = await fetch(
            `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=headline:("${decodedTitle}")&api-key=${apiKey}`,
          );

          const data = await response.json();

          if (data.response && data.response.docs.length > 0) {
            const doc = data.response.docs[0];

            // Robust data normalisation
            setArticle({
              title: doc.headline?.main || "Untitled article",
              abstract: doc.abstract || "No abstract available.",
              byline: doc.byline?.original || "Author not available",
              url: doc.web_url,
              multimedia: (doc.multimedia || []).map((m) => ({
                url: m.url.startsWith("http")
                  ? m.url
                  : `https://static01.nyt.com/${m.url}`,
              })),
            });
          } else {
            setError("Article not found");
          }
        } catch (err) {
          console.error("Fetch error:", err);
          setError("Unable to load article data");
        } finally {
          setLoading(false);
        }
      };

      fetchArticleByTitle();
    }
  }, [article, title]); // Dependency defined solely by the URL parameter

  // UI: Loading status
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>Loading article data...</p>
        </div>
      </div>
    );
  }

  // UI: Explicit error status
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorBox}>
            <h2 className={styles.errorTitle}>{error}</h2>
            <p className={styles.errorText}>
              We couldn't retrieve the article. Please go back and try again.
            </p>
            <button className={styles.backButton} onClick={() => navigate("/")}>
              ← BACK
            </button>
          </div>
        </div>
      </div>
    );
  }

  // UI: Fallback if article is null (without an explicit error)
  if (!article) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorBox}>
            <h2 className={styles.errorTitle}>Article not available</h2>
            <p className={styles.errorText}>
              The page was reloaded or the link is no longer valid.
            </p>
            <button className={styles.backButton} onClick={() => navigate("/")}>
              ← BACK TO HOME
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate("/")}>
        ← BACK TO HOME
      </button>

      <div className={styles.imageWrapper}>
        <img
          src={
            article.multimedia?.[0]?.url ||
            "https://via.placeholder.com/800x400?text=No+Image"
          }
          alt={article.title}
          className={styles.mainImage}
        />
      </div>

      <h1 className={styles.title}>{article.title}</h1>
      <p className={styles.abstract}>{article.abstract}</p>

      <div className={styles.meta}>
        <p className={styles.metaAuthor}>
          <strong>Autore:</strong> {article.byline}
        </p>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.sourceLink}
        >
          READ ON NEW YORK TIMES
        </a>
      </div>
    </div>
  );
};

export default ArticleDetail;
