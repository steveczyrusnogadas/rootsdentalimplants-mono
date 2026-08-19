// PROTOTYPE — live HighLevel quiz iframe. Chrome around this is the ticket.
// Match the WordPress embed: iframe + form_embed.js resizer, no overflow clip.
import { useEffect } from "react";
import type { QuizLocation } from "./data";

const EMBED_SRC = "https://link.msgsndr.com/js/form_embed.js";

export function HighLevelQuiz({ location }: { location: QuizLocation }) {
  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${EMBED_SRC}"]`);
    if (existing) {
      existing.remove();
    }
    const script = document.createElement("script");
    script.src = EMBED_SRC;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [location.widgetId]);

  return (
    <iframe
      key={location.widgetId}
      src={`https://api.leadconnectorhq.com/widget/quiz/${location.widgetId}`}
      id={location.widgetId}
      title={`${location.city} eligibility quiz`}
      className="block w-full border-0"
      style={{ width: "100%", border: "none", minHeight: 640 }}
      scrolling="no"
    />
  );
}
