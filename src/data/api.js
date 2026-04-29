import axios from "axios";

// Accessing the API Key from environment variables for security
const API_KEY = import.meta.env.VITE_NYT_API_KEY;
const BASE_URL = "https://api.nytimes.com/svc/topstories/v2";

/**
 * Fetches news articles from the NYT API based on a specific category.
 * @param {string} category - The news section to fetch (e.g., 'world', 'science').
 * @returns {Array} - An array of article objects or an empty array if the request fails.
 */

export const getNews = async (category) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${category}.json?api-key=${API_KEY}`,
    );

    // Returns the 'results' array containing the articles
    return response.data.results;
  } catch (error) {
    // Basic error logging for debugging network or API issues
    console.error("Errore API:", error);
    throw error;
  }
};
