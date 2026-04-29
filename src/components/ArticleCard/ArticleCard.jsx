import React from "react";
import styles from "./ArticleCard.module.css";
import { Link } from "react-router-dom";

const ArticleCard = ({ article }) => {
  // Use the first available multimedia image, or fall back to a local placeholder
  const imageUrl = article.multimedia?.[0]?.url || "/nyt-placeholder.jpg";

  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={imageUrl}
          alt={article.title}
          className={styles.image}
          loading="lazy"
        />
      </div>
      <div className={styles.content}>
        <span className={styles.section}>{article.section}</span>
        <h3 className={styles.title}>{article.title}</h3>
        <p className={styles.abstract}>{article.abstract}</p>

        {/*
          URI used as aURL parameter instead of the title because
          it is a stable, unique identifier for the article across both the
          Top Stories and Article Search APIs.
          The full article object is also passed via state as a fast path:
          ArticleDetail can render immediately without a fetch on normal navigation.
        */}
        <Link
          to={`/article/${encodeURIComponent(article.uri)}`}
          state={{ article }}
          className={styles.link}
        >
          READ MORE
        </Link>
      </div>
    </article>
  );
};

export default ArticleCard;
