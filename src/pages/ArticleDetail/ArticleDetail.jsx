import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./ArticleDetail.module.css";

const normalizeData = (doc, fallbackImg = null) => {
  if (!doc) return null;

  const multimedia = Array.isArray(doc.multimedia) ? doc.multimedia : [];

  const mainImage =
    multimedia.find((m) => m.subtype === "xlarge") ||
    multimedia.find((m) => m.crop_name === "articleLarge") ||
    multimedia.find((m) => m.legacy?.xlarge) ||
    multimedia[0];

  let imgUrl = null;

  if (mainImage) {
    const rawPath = mainImage.url || mainImage.legacy?.xlarge;

    if (rawPath) {
      imgUrl = rawPath.startsWith("http")
        ? rawPath
        : `https://static01.nyt.com/${rawPath}`;
    }
  }

  return {
    title: doc.headline?.main || doc.title || "Untitled article",
    abstract: doc.abstract || doc.snippet || "No abstract available.",
    byline: doc.byline?.original || doc.byline || "Author not available",
    url: doc.web_url || doc.url,
    imageUrl: imgUrl || fallbackImg || "/nyt-placeholder.jpg",
  };
};

const ArticleDetail = () => {
  const { uri } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const originalStateArticle = location.state?.article || null;
  const originalStateImg = originalStateArticle?.multimedia?.[0]?.url || null;

  const [article, setArticle] = useState(() =>
    originalStateArticle ? normalizeData(originalStateArticle) : null,
  );
  const [loading, setLoading] = useState(!originalStateArticle);
  const [error, setError] = useState(null);

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    if (!uri) return;

    if (originalStateArticle) {
      setLoading(false);
      return;
    }

    let ignore = false;

    const fetchArticle = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiKey = import.meta.env.VITE_NYT_API_KEY;
        if (!apiKey) {
          throw new Error("Missing VITE_NYT_API_KEY");
        }

        const decodedUri = decodeURIComponent(uri);

        const params = new URLSearchParams({
          fq: `uri:("${decodedUri}")`,
          fl: "headline,abstract,snippet,byline,web_url,multimedia",
          "api-key": apiKey,
        });

        const response = await fetch(
          `https://api.nytimes.com/svc/search/v2/articlesearch.json?${params.toString()}`,
        );

        if (!response.ok) {
          throw new Error("Unable to load article");
        }

        const data = await response.json();
        const doc = data?.response?.docs?.[0];

        if (!doc) {
          throw new Error("Article not found");
        }

        if (!ignore) {
          setArticle(normalizeData(doc, originalStateImg));
        }
      } catch (err) {
        if (!ignore) {
          console.error("Fetch error:", err);
          setError(err.message || "Unable to retrieve article details.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchArticle();

    return () => {
      ignore = true;
    };
  }, [uri, originalStateArticle, originalStateImg]);

  if (loading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Loading article...</h2>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>{error || "Article not available"}</h2>
        <button
          className={styles.backButton}
          onClick={() => navigate("/", { replace: true })}
        >
          BACK TO HOME
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleBack}>
        ← BACK
      </button>

      {article.imageUrl && (
        <div className={styles.imageWrapper}>
          <img
            src={article.imageUrl}
            alt={article.title}
            className={styles.mainImage}
            onError={(e) => {
              e.currentTarget.src = "/nyt-placeholder.jpg";
            }}
          />
        </div>
      )}

      <h1 className={styles.title}>{article.title}</h1>
      <p className={styles.abstract}>{article.abstract}</p>

      <div className={styles.meta}>
        <p>
          <strong>Author:</strong> {article.byline}
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
