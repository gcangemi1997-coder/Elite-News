import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";
import { NewsProvider } from "./context/NewsContext.jsx";

// Initialize the React app and wrap it with NewsProvider for global state management
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NewsProvider>
      <App />
    </NewsProvider>
  </StrictMode>,
);
