import React from "react";
import styles from "./ArticleCard.module.css";
import { Link } from "react-router-dom";

const ArticleCard = ({ article }) => {
  // Extracting the first available image from the multimedia array
  const imageUrl = article.multimedia?.[0]?.url;

  return (
    <article className={`${styles.card}`}>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={article.title} className={styles.image} />
      </div>
      <div className={styles.content}>
        <span className={styles.section}>{article.section}</span>
        <h3 className={styles.title}>{article.title}</h3>
        <p className={styles.abstract}>{article.abstract}</p>

        {/* Strategic Navigation:
            We pass the entire 'article' object via the 'state' property.
            This allows ArticleDetail to show data instantly without a new API call.
        */}
        <Link
          to={`/article/${encodeURIComponent(article.title)}`}
          state={{ article: article }}
          className={styles.link}
        >
          READ MORE
        </Link>
      </div>
    </article>
  );
};

export default ArticleCard;
