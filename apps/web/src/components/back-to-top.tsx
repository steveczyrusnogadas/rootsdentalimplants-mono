import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import styles from "./back-to-top.module.css";

type BackToTopProps = {
  /** Distance from the top, in pixels, before the control appears. */
  threshold?: number;
};

/** Mount once in the public site layout, outside transformed containers. */
export function BackToTop({ threshold = 400 }: BackToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > threshold);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, [threshold]);

  if (!visible) return null;

  return (
    <button
      type="button"
      className={styles.control}
      aria-label="Back to top"
      onClick={() => {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        // `instant` overrides a document-level smooth-scroll rule as well.
        window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
      }}
    >
      <ArrowUp size={21} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
