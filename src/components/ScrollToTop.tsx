import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/** Resets window scroll on client-side navigation (React Router does not by default). */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
