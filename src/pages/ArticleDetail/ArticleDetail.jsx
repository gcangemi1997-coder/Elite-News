import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./ArticleDetail.module.css";

/**
 * Normalizes raw article data from both the Top Stories API and the
 * Article Search API into a consistent shape for the UI.
 * The fallbackImg is used when no multimedia is found in the fetched doc,
 * but an image was already available from navigation state.
 */

const normalizeData = (doc, fallbackImg = null) => {
  if (!doc) return null;

  const multimedia = Array.isArray(doc.multimedia) ? doc.multimedia : [];

  // Prefer the largest available image format, falling back progressively

  const mainImage =
    multimedia.find((m) => m.subtype === "xlarge") ||
    multimedia.find((m) => m.crop_name === "articleLarge") ||
    multimedia.find((m) => m.legacy?.xlarge) ||
    multimedia[0];

  let imgUrl = null;

  if (mainImage) {
    const rawPath = mainImage.url || mainImage.legacy?.xlarge;

    // The Top Stories API returns relative paths; Article Search returns full URLs

    if (rawPath) {
      imgUrl = rawPath.startsWith("http")
        ? rawPath
        : `https://static01.nyt.com/${rawPath}`;
    }
  }

  return {
    title: doc.headline?.main || doc.title || "Untitled article",
    // abstract can be an object in "interactive" article types — guard against it

    abstract:
      typeof doc.abstract === "string"
        ? doc.abstract
        : doc.abstract?.value || "No abstract available.",
    // byline can also be an object; extract the human-readable string safely

    byline:
      doc.byline?.original ||
      (typeof doc.byline === "string" ? doc.byline : null) ||
      "Author not available",
    url: doc.web_url || doc.url,
    imageUrl: imgUrl || fallbackImg || "/nyt-placeholder.jpg",
  };
};

const ArticleDetail = () => {
  const { uri } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Capture navigation state once — used as the fast-path data source

  const originalStateArticle = location.state?.article || null;
  const originalStateImg = originalStateArticle?.multimedia?.[0]?.url || null;

  // If the user navigated here via a Link, normalize the state article immediately
  // to avoid a redundant fetch. If the page was refreshed or opened directly,
  // article starts as null and the useEffect fetch kicks in.

  const [article, setArticle] = useState(() =>
    originalStateArticle ? normalizeData(originalStateArticle) : null,
  );
  const [loading, setLoading] = useState(!originalStateArticle);
  const [error, setError] = useState(null);

  // Navigate back if possible, otherwise fall back to home to avoid a dead end

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    if (!uri) return;

    // Fast path: article already available from navigation state — skip fetch

    if (originalStateArticle) {
      setLoading(false);
      return;
    }
    // Cleanup flag: prevents setting state on an unmounted component
    // (e.g. user navigates away before the fetch completes)

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

        // Use fq (filter query) with the article URI for a precise, stable lookup.
        // fl limits the response fields to only what the UI needs.
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
          // Pass originalStateImg as fallback so the image from navigation
          // state is reused if the search API returns no multimedia
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

    // Cleanup: mark this effect as stale if the component unmounts mid-fetch

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
            // If the resolved URL is broken, fall back to the local placeholder
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
