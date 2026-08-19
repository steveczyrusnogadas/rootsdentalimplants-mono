// PROTOTYPE — floating variant switcher. Dev-only; never ships to production.
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

export function PrototypeSwitcher<K extends string>({
  variants,
  current,
  stateNote,
}: {
  variants: { key: K; name: string }[];
  current: K;
  stateNote?: string;
}) {
  const navigate = useNavigate();

  if (!import.meta.env.DEV) return null;

  const index = Math.max(
    0,
    variants.findIndex((variant) => variant.key === current),
  );

  const go = (next: number) => {
    const wrapped = (next + variants.length) % variants.length;
    void navigate({
      to: ".",
      search: (prev) => ({ ...prev, variant: variants[wrapped].key }),
      replace: true,
    });
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof Element && event.target.closest("input, textarea, [contenteditable]")) return;
      if (event.key === "ArrowLeft") go(index - 1);
      if (event.key === "ArrowRight") go(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const active = variants[index];

  return (
    <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-1">
      <div className="flex items-center gap-1 rounded-full bg-neutral-900/95 py-1.5 pr-4 pl-1.5 text-white shadow-2xl ring-1 ring-white/15 backdrop-blur">
        <button
          type="button"
          aria-label="Previous variant"
          onClick={() => go(index - 1)}
          className="grid size-8 place-items-center rounded-full text-lg hover:bg-white/10"
        >
          ←
        </button>
        <span className="min-w-48 text-center text-sm font-medium">
          <span className="font-semibold uppercase">{active.key}</span>
          <span className="text-white/60"> — {active.name}</span>
        </span>
        <button
          type="button"
          aria-label="Next variant"
          onClick={() => go(index + 1)}
          className="grid size-8 place-items-center rounded-full text-lg hover:bg-white/10"
        >
          →
        </button>
      </div>
      {stateNote ? <p className="rounded-full bg-neutral-900/80 px-3 py-1 font-mono text-[11px] text-white/70">{stateNote}</p> : null}
    </div>
  );
}
