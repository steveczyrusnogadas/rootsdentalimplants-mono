import { localizeTree, useLocale } from "@/lib/i18n";
import { useEffect, useId, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import "./patient-stories.css";
import "./care-content.css";

type CareVideoProps = {
  title: string;
  embed: string;
  url: string;
  poster: string;
  credit: string;
};

/** No third-party player loads before a visitor explicitly opens the video. */
export function CareVideo({ title, embed, url, poster, credit }: CareVideoProps) {
  const locale = useLocale();
  const [active, setActive] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (active) dialog.current?.showModal();
  }, [active]);

  function close() {
    dialog.current?.close();
    setActive(false);
    opener.current?.focus();
  }

  return localizeTree(
    <div className="care-video">
      <button
        ref={opener}
        type="button"
        className="patient-story-card"
        aria-label={`Watch ${title}`}
        onClick={() => setActive(true)}
      >
        <span className="patient-story-poster">
          <img src={poster} alt="" loading="lazy" width="960" height="540" />
          <span className="patient-story-play">
            <Play aria-hidden="true" fill="currentColor" size={22} />
          </span>
        </span>
        <span className="patient-story-caption">
          <span className="patient-story-title">{title}</span>
          <span className="patient-story-credit">{credit}</span>
          <span className="patient-story-watch">Watch video</span>
        </span>
      </button>
      <dialog
        ref={dialog}
        className="patient-story-dialog"
        aria-labelledby={titleId}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
      >
        {active && (
          <>
            <div className="patient-story-dialog-heading">
              <h2 id={titleId}>{title}</h2>
              <button type="button" onClick={close} aria-label="Close video">
                <X aria-hidden="true" size={22} />
                <span>Close</span>
              </button>
            </div>
            <iframe
              src={`${embed}${embed.includes("?") ? "&" : "?"}autoplay=1`}
              title={title}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <div className="patient-story-dialog-footer">
              <p>{credit}</p>
              <a href={url} target="_blank" rel="noopener noreferrer">
                Open video on its provider (new tab)
              </a>
            </div>
          </>
        )}
      </dialog>
    </div>,
    locale,
  );
}

// Primary legacy homepage and publisher oEmbed verified 2026-09-08.
export function RootsIntroductionVideo() {
  const locale = useLocale();
  return localizeTree(
    <section className="inner-section care-introduction" aria-labelledby="roots-long-introduction">
      <div className="inner-section-heading">
        <p className="eyebrow">GET TO KNOW ROOTS</p>
        <h2 id="roots-long-introduction">Spend a little time with our team.</h2>
        <p>A five-minute introduction to the people and approach behind Roots Dental Implant Center.</p>
      </div>
      <CareVideo
        title="Get to know Roots · 5 minutes"
        embed="https://player.vimeo.com/video/1101752183"
        url="https://vimeo.com/1101752183"
        poster="/images/story-1101752183.jpg"
        credit="Roots Dental · Film by 11:10 Productions"
      />
    </section>,
    locale,
  );
}

// These two videos appear within the corresponding legacy FAQ answers.
export function FaqVideos() {
  const locale = useLocale();
  return localizeTree(
    <section className="inner-section care-faq-videos" aria-labelledby="care-faq-video-title">
      <div className="inner-section-heading">
        <p className="eyebrow">HEAR FROM ROOTS</p>
        <h2 id="care-faq-video-title">More on comfort and cost.</h2>
        <p>
          Hear the team explain common questions, then discuss your own care and written quote at your consultation.
        </p>
      </div>
      <div className="patient-story-grid">
        <CareVideo
          title="Are dental implants painful?"
          embed="https://www.youtube-nocookie.com/embed/iRSN7rHyZZk?rel=0"
          url="https://www.youtube.com/watch?v=iRSN7rHyZZk"
          poster="/images/story-iRSN7rHyZZk.jpg"
          credit="Published by Roots Dental"
        />
        <CareVideo
          title="How much do dental implants cost?"
          embed="https://www.youtube-nocookie.com/embed/FHHAhgexIh8?rel=0"
          url="https://www.youtube.com/watch?v=FHHAhgexIh8"
          poster="/images/story-FHHAhgexIh8.jpg"
          credit="Published by Roots Dental"
        />
      </div>
    </section>,
    locale,
  );
}
