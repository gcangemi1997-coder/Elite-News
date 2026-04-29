import React, { createContext, useState, useContext, useEffect } from "react";
import { getNews } from "../data/api";

const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("home");
  const [cache, setCache] = useState({});

  const changeCategory = (newCat) => {
    setCategory(newCat);
  };

  useEffect(() => {
    const fetchArticles = async () => {
      // Usiamo la cache se disponibile per la categoria attuale
      if (cache[category]) {
        setNews(cache[category]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getNews(category);
        setNews(data);
        // Aggiorniamo la cache: questo NON farà ripartire l'effetto perché 'cache' non è tra le dipendenze
        setCache((prev) => ({ ...prev, [category]: data }));
      } catch (err) {
        setNews([]);
        setError("Unable to load articles. Please try again later.");
        console.error("Context Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [category]); // Corretto: solo category qui

  return (
    <NewsContext.Provider
      value={{ news, error, loading, category, changeCategory }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("useNews must be used within a NewsProvider");
  }
  return context;
};
