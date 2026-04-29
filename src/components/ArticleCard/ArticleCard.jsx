import React from "react";
import styles from "./ArticleCard.module.css";
import { Link } from "react-router-dom";

const ArticleCard = ({ article }) => {
  // Uniformato a .jpg come in ArticleDetail
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
