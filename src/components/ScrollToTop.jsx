import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll back to the top of the page (X: 0, Y: 0)

    window.scrollTo(0, 0);
  }, [pathname]); // This is triggered every time the path changes

  return null;
};

export default ScrollToTop;
