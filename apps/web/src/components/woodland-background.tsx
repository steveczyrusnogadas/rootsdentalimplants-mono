import { useEffect, useRef, useState } from "react";

/** Decorative section film: download on arrival, respect reduced motion and pause offscreen. */
export function WoodlandBackground({ variant = "woodland" }: { variant?: "woodland" | "locations" | "hero-cedar" }) {
  const poster = `/images/roots-${variant}-poster.jpg`;
  const container = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionAllowed(!preference.matches);
    update();
    preference.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) setArrived(true);
    });
    if (container.current) observer.observe(container.current);
    return () => {
      preference.removeEventListener("change", update);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const film = video.current;
    if (!film) return;
    if (motionAllowed && visible && arrived && !failed) {
      void film.play().catch(() => {});
    } else film.pause();
  }, [motionAllowed, visible, arrived, failed]);

  return (
    <div
      className={`woodland-background${variant === "woodland" ? "" : ` ${variant}-background`}`}
      ref={container}
      aria-hidden="true"
    >
      <img
        src={poster}
        alt=""
        width={variant === "hero-cedar" ? 1780 : 1920}
        height={variant === "hero-cedar" ? 800 : 1080}
        loading="lazy"
      />
      {motionAllowed && arrived && !failed && (
        <video
          ref={video}
          src={`/video/roots-${variant}.mp4`}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
