import React, { createContext, useState, useContext, useEffect } from "react";
import { getNews } from "../data/api";

// Initialize a Context to share state across the entire application
const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("home");

  // Function to update the current category, triggered from the Navbar
  const changeCategory = (newCat) => {
    setCategory(newCat);
  };

  /**
   * Effect Hook: Triggers a new API call whenever the 'category' changes.
   * This ensures the UI stays in sync with the user's selection.
   */
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        setError(null);
        const data = await getNews(category);
        setNews(data);
      } catch {
        // UI Error Handling: informs the user if the fetch fails
        setError("Unable to load articles. Please try again later.");
      } finally {
        // Stop the loading spinner regardless of success or failure
        setLoading(false);
      }
    };

    fetchArticles();
  }, [category]);

  return (
    /* Providing state and control functions to all child components */
    <NewsContext.Provider
      value={{ news, error, loading, category, changeCategory }}
    >
      {children}
    </NewsContext.Provider>
  );
};

/**
 * Custom Hook: useNews
 * Simplifies accessing the context and adds a safety check
 * to ensure it's used within a NewsProvider.
 */
export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("useNews must be used within a NewsProvider");
  }
  return context;
};
