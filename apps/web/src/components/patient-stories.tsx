import { localizeTree, useLocale } from "@/lib/i18n";
import { useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import "./patient-stories.css";

type Story = { id: string; title: string; credit: string; embed: string; url: string };

// Names, IDs, unlisted hashes and posters verified against the legacy testimonials
// page/homepage and each publisher's oEmbed metadata on 2026-09-08.
const rootsStories: Story[] = [
  {
    id: "1040622074",
    title: "Crystal’s story",
    credit: "Roots Dental · Film by 11:10 Productions",
    embed: "https://player.vimeo.com/video/1040622074?h=fdb63c88e1",
    url: "https://vimeo.com/1040622074/fdb63c88e1",
  },
  {
    id: "1040252443",
    title: "Shayla’s story",
    credit: "Roots Dental · Film by 11:10 Productions",
    embed: "https://player.vimeo.com/video/1040252443?h=9a229591cd",
    url: "https://vimeo.com/1040252443/9a229591cd",
  },
  {
    id: "1040255650",
    title: "Renee’s story",
    credit: "Roots Dental · Film by 11:10 Productions",
    embed: "https://player.vimeo.com/video/1040255650?h=81fe3c3f07",
    url: "https://vimeo.com/1040255650/81fe3c3f07",
  },
  {
    id: "1040251039",
    title: "Charlotte’s story",
    credit: "Roots Dental · Film by 11:10 Productions",
    embed: "https://player.vimeo.com/video/1040251039?h=8d88d03bf5",
    url: "https://vimeo.com/1040251039/8d88d03bf5",
  },
  {
    id: "1040259033",
    title: "Diane’s story",
    credit: "Roots Dental · Film by 11:10 Productions",
    embed: "https://player.vimeo.com/video/1040259033?h=beabccb16d",
    url: "https://vimeo.com/1040259033/beabccb16d",
  },
  {
    id: "1108607676",
    title: "Richard’s story",
    credit: "Roots Dental · Film by 11:10 Productions",
    embed: "https://player.vimeo.com/video/1108607676?autopause=1",
    url: "https://vimeo.com/1108607676",
  },
];
const sharedStories: Story[] = [
  {
    id: "2FPTk-kRf2U",
    title: "Restoring everyday function",
    credit: "Published by Clark Brinton",
    embed: "https://www.youtube-nocookie.com/embed/2FPTk-kRf2U?rel=0",
    url: "https://www.youtube.com/watch?v=2FPTk-kRf2U",
  },
  {
    id: "YEPJpGkD14U",
    title: "Finding the freedom to smile",
    credit: "Published by Renu Dental Implant",
    embed: "https://www.youtube-nocookie.com/embed/YEPJpGkD14U?rel=0",
    url: "https://www.youtube.com/watch?v=YEPJpGkD14U",
  },
  {
    id: "sGpBwyDRxyI",
    title: "Choosing dental implants",
    credit: "Published by Renu Dental Implant",
    embed: "https://www.youtube-nocookie.com/embed/sGpBwyDRxyI?rel=0",
    url: "https://www.youtube.com/watch?v=sGpBwyDRxyI",
  },
  {
    id: "fgPvxnh0nDY",
    title: "Sharing a smile again",
    credit: "Published by Renu Dental Implant",
    embed: "https://www.youtube-nocookie.com/embed/fgPvxnh0nDY?rel=0",
    url: "https://www.youtube.com/watch?v=fgPvxnh0nDY",
  },
];

export function PatientStories() {
  const locale = useLocale();
  const [active, setActive] = useState<Story | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (active) dialog.current?.showModal();
  }, [active]);

  function close() {
    dialog.current?.close();
    setActive(null);
    opener.current?.focus();
  }

  function storyButton(story: Story) {
    return (
      <button
        type="button"
        className="patient-story-card"
        key={story.id}
        aria-label={`Watch ${story.title}`}
        onClick={(event) => {
          opener.current = event.currentTarget;
          setActive(story);
        }}
      >
        <span className="patient-story-poster">
          <img src={`/images/story-${story.id}.jpg`} alt="" loading="lazy" width="960" height="540" />
          <span className="patient-story-play">
            <Play aria-hidden="true" fill="currentColor" size={22} />
          </span>
        </span>
        <span className="patient-story-caption">
          <span className="patient-story-title">{story.title}</span>
          <span className="patient-story-credit">{story.credit}</span>
          <span className="patient-story-watch">Watch story</span>
        </span>
      </button>
    );
  }

  return localizeTree(
    <>
      <section className="inner-section patient-stories" aria-labelledby="patient-stories-title">
        <div className="patient-story-feature">
          <div>
            <p className="eyebrow">IN THEIR WORDS</p>
            <h2 id="patient-stories-title">
              Meet the people.
              <br />
              <em>Hear their stories.</em>
            </h2>
            <p>Personal experiences, shared by Richard, Crystal, Shayla, Renee, Charlotte and Diane.</p>
          </div>
          {storyButton(rootsStories[0]!)}
        </div>
        <div className="patient-story-grid">{rootsStories.slice(1).map(storyButton)}</div>
      </section>
      <section className="inner-section patient-stories-shared" aria-labelledby="shared-stories-title">
        <div className="inner-section-heading">
          <h2 id="shared-stories-title">More patient perspectives.</h2>
          <p>Additional videos shared on the original Roots testimonials page, credited to their publishers.</p>
        </div>
        <div className="patient-story-grid">{sharedStories.map(storyButton)}</div>
      </section>
      <dialog
        ref={dialog}
        className="patient-story-dialog"
        aria-labelledby="patient-story-dialog-title"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
      >
        {active && (
          <>
            <div className="patient-story-dialog-heading">
              <h2 id="patient-story-dialog-title">{active.title}</h2>
              <button type="button" onClick={close} aria-label="Close video">
                <X aria-hidden="true" size={22} />
                <span>Close</span>
              </button>
            </div>
            <iframe
              src={`${active.embed}&autoplay=1`}
              title={active.title}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <div className="patient-story-dialog-footer">
              <p>{active.credit}</p>
              <a href={active.url} target="_blank" rel="noopener noreferrer">
                Watch on {active.id.length === 10 ? "Vimeo" : "YouTube"} (new tab)
              </a>
            </div>
          </>
        )}
      </dialog>
    </>,
    locale,
  );
}
