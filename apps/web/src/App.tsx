import { localizeTree, useLocale } from "@/lib/i18n";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Plus } from "lucide-react";

import { MembershipPrices, ClinicIntroduction } from "@/components/homepage-experiment";
import { providers } from "@/content/pages";
import { locations } from "@/content/locations";
import { SiteHeader, SiteFooter } from "@/components/site-shell";

function Sprig({
  className = "",
  variant = "grove",
}: {
  className?: string;
  variant?: "grove" | "pair" | "branch" | "original";
}) {
  const locale = useLocale();
  return localizeTree(
    <img
      className={`sprig ${className}`}
      src={variant === "original" ? "/images/trees.svg" : `/images/evergreen-${variant}.svg`}
      alt=""
      aria-hidden="true"
    />,
    locale,
  );
}

function App() {
  const locale = useLocale();
  const [activeTreatment, setActiveTreatment] = useState<number | null>(0);
  const heroVideo = useRef<HTMLVideoElement>(null);
  const [playingStory, setPlayingStory] = useState(false);
  const [heroPlaying, setHeroPlaying] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [videoUnavailable, setVideoUnavailable] = useState(false);
  useEffect(() => {
    const video = heroVideo.current;
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setMotionAllowed(!preference.matches);
      if (preference.matches) video.pause();
      else void video.play().catch(() => {});
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("arrived");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return localizeTree(
    <>
      <SiteHeader />

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">
              Transform your
              <br />
              smile with lasting
              <br />
              <em>dental implants.</em>
            </h1>
            <p className="hero-description">
              Personalized dental implant care to help restore your confidence and functionality. Your next chapter
              starts with a conversation.
            </p>
            <div className="hero-actions">
              <a href="#locations" className="button">
                Book your free consultation <ArrowUpRight size={18} />
              </a>
              <a className="button button-secondary" href="#care">
                Explore implant care <ArrowDown size={16} />
              </a>
            </div>
          </div>
          <figure className="hero-photo">
            <img
              className="hero-poster"
              src="/images/clinic.jpg"
              alt="Roots Dental clinician with a patient"
              width="1920"
              height="1080"
              fetchPriority="high"
            />
            <video
              ref={heroVideo}
              className={!motionAllowed || videoUnavailable ? "motion-disabled" : ""}
              src="/video/roots-clinic.mp4"
              poster="/images/clinic.jpg"
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              onPlay={() => setHeroPlaying(true)}
              onPause={() => setHeroPlaying(false)}
              onError={() => setVideoUnavailable(true)}
            />
            {motionAllowed && !videoUnavailable && (
              <button
                className="video-toggle"
                type="button"
                onClick={() => {
                  const video = heroVideo.current;
                  if (!video) return;
                  if (video.paused) void video.play().catch(() => {});
                  else video.pause();
                }}
              >
                {heroPlaying ? "Pause background video" : "Play background video"}
              </button>
            )}
            <figcaption>Roots Dental Implant Center · A look inside our care</figcaption>
          </figure>
        </section>

        <section className="care-values" aria-label="Why choose Roots">
          <p className="eyebrow">YOU’RE IN GOOD HANDS</p>
          <div>
            <h2>Experienced team</h2>
            <p>People who take the time to understand your needs.</p>
          </div>
          <div>
            <h2>Advanced technology</h2>
            <p>Digital tools with a focus on dental implant care.</p>
          </div>
          <div>
            <h2>Personalized care</h2>
            <p>A treatment plan centered around your goals.</p>
          </div>
          <div>
            <h2>Comfort comes first</h2>
            <p>A supportive setting and clear financial information.</p>
          </div>
        </section>

        <section id="care" className="care-section section-pad">
          <div className="care-intro reveal">
            <div>
              <p className="eyebrow">PERSONALIZED IMPLANT CARE</p>
              <h2>
                Dental implant
                <br />
                <em>treatments.</em>
              </h2>
            </div>
          </div>
          <div className="treatment-layout reveal">
            <div className="treatment-note">
              <span className="eyebrow">LET’S START WITH YOU</span>
              <h3>
                What would you
                <br />
                like to change?
              </h3>
              <Sprig variant="original" />
              <p>
                You don’t need to have
                <br />
                all the answers to begin.
              </p>
              <a href="#locations" className="text-link">
                Talk with our team <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="treatment-options">
              {[
                {
                  title: "A single missing tooth",
                  image: "single-tooth",
                  alt: "Crafting a dental restoration, from the Roots single-tooth implant page",
                  copy: "Learn about single-tooth implants and discuss a replacement for a missing tooth with your dentist.",
                  link: "single-tooth-implants",
                  label: "Single-tooth implants",
                },
                {
                  title: "A full smile to restore",
                  image: "full-arch-treatment",
                  alt: "Discussing a model during a consultation, from the Roots full-arch page",
                  copy: "Explore full-arch implant care and the questions to bring to a consultation about replacing an upper or lower arch.",
                  link: "full-arch-dental-implants",
                  label: "Full-arch implants",
                },
                {
                  title: "A different denture option",
                  image: "implant-dentures",
                  alt: "Roots care team with a patient, from the implant-supported dentures page",
                  copy: "Ask your dental team about implant-supported dentures and how they compare with your current options.",
                  link: "implant-supported-dentures",
                  label: "Implant-supported dentures",
                },
              ].map((treatment, index) => (
                <div className="treatment-item" key={treatment.link}>
                  <h3>
                    <button
                      type="button"
                      className="treatment-trigger"
                      id={`treatment-trigger-${index}`}
                      aria-expanded={activeTreatment === index}
                      aria-controls={`treatment-panel-${index}`}
                      onClick={() => setActiveTreatment(activeTreatment === index ? null : index)}
                    >
                      {treatment.title}
                      <Plus size={21} />
                    </button>
                  </h3>
                  <div
                    id={`treatment-panel-${index}`}
                    className={`treatment-panel ${activeTreatment === index ? "is-open" : ""}`}
                    role="region"
                    aria-labelledby={`treatment-trigger-${index}`}
                    aria-hidden={activeTreatment !== index}
                    inert={activeTreatment !== index}
                  >
                    <div className="treatment-panel-inner">
                      <div className="option-content">
                        <img
                          className="treatment-image"
                          src={`/images/${treatment.image}.jpg`}
                          alt={treatment.alt}
                          width="660"
                          height="350"
                          loading="lazy"
                        />
                        <div className="treatment-description">
                          <p>{treatment.copy}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="care-caption">
                A consultation helps you understand your options. Treatment recommendations are individual.
              </div>
            </div>
          </div>
          <MembershipPrices />
        </section>

        <section className="conversation-band">
          <Sprig variant="original" />
          <div className="reveal">
            <p className="eyebrow">A LITTLE LESS UNKNOWN</p>
            <h2>
              Bring your questions.
              <br />
              <em>We’ll take it from there.</em>
            </h2>
            <p>
              Your comfort matters. So does clear financial information.
              <br />
              Ask about a personalized treatment plan and an all-inclusive quote.
            </p>
            <a href="#locations" className="text-link">
              Discuss your options <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="conversation-aside">
            <span>YOUR FIRST STEP</span>
            <p>
              Choose a location.
              <br />
              Meet the team.
              <br />
              Talk through your options.
            </p>
            <a href="#locations" aria-label="Choose your location" className="circle-link">
              <ArrowDown />
            </a>
          </div>
        </section>

        <ClinicIntroduction />

        <section id="team" className="team-section section-pad">
          <div className="team-heading reveal">
            <p className="eyebrow">YOUR ROOTS TEAM</p>
            <h2>
              Meet
              <br />
              <em>our care team.</em>
            </h2>
            <div className="team-introduction">
              <p>
                Our team combines advanced technology with personalized care. Meet the seven people behind Roots before
                you step through the door.
              </p>
              <a href="#locations" className="text-link">
                Plan your visit <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
          <div className="experiment-team-grid">
            {providers.map((person) => (
              <article className="experiment-person reveal" key={person.slug}>
                <a href={`/${person.slug}/`} aria-label={`View ${person.title}’s profile`}>
                  <div className="experiment-portrait">
                    <img src={person.image} alt={person.imageAlt} width="650" height="650" loading="lazy" />
                    <span className="portrait-arrow" aria-hidden="true">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                  <h3>{person.title}</h3>
                  <p>{person.slug === "adam-kearns" ? "MS CRNA · Nurse anesthetist" : "DMD · General dentist"}</p>
                  <span className="experiment-profile-link">
                    View profile <ArrowUpRight size={14} />
                  </span>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="results" className="results-section section-pad">
          <div className="results-heading reveal">
            <div>
              <p className="eyebrow">REAL ROOTS PATIENTS</p>
              <h2>
                Patient results
                <br />
                <em>& stories.</em>
              </h2>
            </div>
          </div>
          <div className="results-gallery">
            {[1, 3].map((pair) => (
              <figure className="result-pair reveal" key={pair}>
                <div className="comparison-photos">
                  <div>
                    <span>Before</span>
                    <img
                      src={`/images/before-${pair}.jpg`}
                      alt="Before treatment, as presented in the Roots patient gallery"
                      width="1000"
                      height="1000"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <span>After</span>
                    <img
                      src={`/images/after-${pair}.jpg`}
                      alt="After treatment, paired by Roots with the adjacent before photograph"
                      width="1000"
                      height="1000"
                      loading="lazy"
                    />
                  </div>
                </div>
              </figure>
            ))}
          </div>
          <p className="results-note">
            Individual results vary. The original gallery does not identify these patients or specify their treatment
            details.
          </p>
          <div className="patient-story reveal">
            <div className="patient-video">
              {playingStory ? (
                <iframe
                  src="https://player.vimeo.com/video/1040622074?h=fdb63c88e1&autoplay=1"
                  title="Crystal’s story — Roots Dental All-On-X patient"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button type="button" className="story-play" onClick={() => setPlayingStory(true)}>
                  <span className="play-symbol" aria-hidden="true">
                    ▶
                  </span>
                  <span>
                    Watch Crystal’s story<small>Patient video from Roots Dental</small>
                  </span>
                  <ArrowUpRight size={23} />
                </button>
              )}
            </div>
            <div className="patient-story-copy">
              <p className="eyebrow">PATIENT TESTIMONIAL</p>
              <h3>Meet Crystal.</h3>
              <p>Crystal, from Dallas, Oregon, shares her experience as a Roots Dental All-On-X patient.</p>
            </div>
            <div className="results-cta">
              <p>
                Let’s talk about
                <br />
                <em>your possibilities.</em>
              </p>
              <a className="button" href="#locations">
                Book a consultation <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </section>
        <section className="reviews-section section-pad" aria-labelledby="reviews-title">
          <div className="reviews-heading reveal">
            <p className="eyebrow">PATIENT EXPERIENCES</p>
            <h2 id="reviews-title">What our patients say.</h2>
          </div>
          <div className="review-quotes">
            {[
              { quote: "Everyone seemed knowledgeable, helpful, and pleasant.", name: "Bethany V.", location: "Salem" },
              { quote: "The entire process was explained in detail.", name: "Kimberly S.", location: "Portland" },
              { quote: "Thoroughly answered all my questions.", name: "Walter W.", location: "Vancouver" },
            ].map((review) => (
              <blockquote className="reveal" key={review.name}>
                <p>“{review.quote}”</p>
                <footer>
                  <strong>{review.name}</strong>
                  <span>{review.location}</span>
                  <small>Review excerpt</small>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section id="questions" className="questions-section section-pad">
          <div className="reveal">
            <p className="eyebrow">PATIENT INFORMATION</p>
            <h2>
              Frequently
              <br />
              <em>asked questions.</em>
            </h2>
            <a href="#locations" className="text-link">
              Ask our team <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="questions-list reveal">
            <details>
              <summary>
                How do I get started?
                <Plus size={20} />
              </summary>
              <p>
                Choose the Roots location that works for you below. You can book through its scheduling page or call the
                team to discuss an implant consultation.
              </p>
            </details>
            <details>
              <summary>
                What will my treatment cost?
                <Plus size={20} />
              </summary>
              <p>
                Your treatment needs are individual. Ask for a personalized plan and quote during your consultation. Our
                team can also discuss financing and insurance with you.
              </p>
            </details>
            <details>
              <summary>
                Which implant option is right for me?
                <Plus size={20} />
              </summary>
              <p>
                That’s a conversation to have with your dentist after an assessment. You can explore the options above
                and bring your questions to your visit.
              </p>
            </details>
          </div>
          <aside className="patient-notice" aria-labelledby="patient-notice-title">
            <h3 id="patient-notice-title">A note about misleading online implant offers</h3>
            <p>
              Roots has reported unaffiliated ads promising government grants or unrealistically low implant prices.
              Confirm any offer directly with your Roots location and ask for a personalized treatment quote.
            </p>
          </aside>
        </section>

        <section id="locations" className="locations-section section-pad">
          <div className="locations-heading reveal">
            <div>
              <p className="eyebrow">FIND A ROOTS IMPLANT CENTER</p>
              <h2>
                Your next step.
                <br />
                <em>A little closer.</em>
              </h2>
            </div>
            <Sprig variant="original" />
          </div>
          <div className="location-list">
            {locations.map((location) => (
              <article className="location-row reveal" key={location.name}>
                <div className="location-name">
                  <h3>
                    {location.name}
                    <small>{location.state}</small>
                  </h3>
                </div>
                <p>
                  {location.address}
                  <br />
                  {location.zip}
                </p>
                <a className="location-phone" href={`tel:${location.phone}`}>
                  {location.phone}
                </a>
                <a
                  className="location-book"
                  href={`https://app.nexhealth.com/appt/arvory_dental_management?lid=${location.id}`}
                  aria-label={`Book a visit in ${location.name}`}
                >
                  Book a visit <ArrowUpRight size={18} />
                </a>
              </article>
            ))}
          </div>
          <p className="booking-note">
            Online booking opens our scheduling partner, NexHealth. Prefer a conversation? Call your location directly.
          </p>
        </section>
      </main>

      <SiteFooter />
    </>,
    locale,
  );
}
export default App;
