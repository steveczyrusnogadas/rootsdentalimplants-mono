import { localizeTree, useLocale } from "@/lib/i18n";
import { useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import "@/homepage-experiment.css";

export function MembershipPrices() {
  const locale = useLocale();
  return localizeTree(
    <aside className="membership-prices reveal" aria-labelledby="membership-title">
      <div className="membership-heading">
        <p className="eyebrow">A CLEARER STARTING POINT</p>
        <h3 id="membership-title">
          Implant-supported dentures
          <br />
          <em>“Teeth in a Day”</em>
        </h3>
        <a className="text-link" href="/finance-insurance/">
          Explore payment options <ArrowUpRight size={18} />
        </a>
      </div>
      <div className="membership-price">
        <h4>Single arch</h4>
        <p className="price-amount">
          <span>As low as</span>$18,995
        </p>
        <p>with implant membership plan</p>
      </div>
      <div className="membership-price">
        <h4>Double arch</h4>
        <p className="price-amount">
          <span>As low as</span>$35,995
        </p>
        <p>with membership plan</p>
      </div>
      <div className="membership-conditions">
        <p>We will meet or beat any local competitor pricing with a written quote.</p>
        <p>
          Ask about membership terms, what your treatment includes, and your individual timeline at your consultation.
          Your personalized treatment plan and quote determine your cost.
        </p>
      </div>
    </aside>,
    locale,
  );
}

export function ClinicIntroduction() {
  const locale = useLocale();
  const [playing, setPlaying] = useState(false);
  return localizeTree(
    <section className="clinic-introduction section-pad" aria-labelledby="clinic-introduction-title">
      <div className="clinic-introduction-copy reveal">
        <p className="eyebrow">GET TO KNOW ROOTS</p>
        <h2 id="clinic-introduction-title">
          A closer look
          <br />
          <em>at our care.</em>
        </h2>
        <p>
          Meet the people and see the setting behind your next conversation. Take a moment to watch our introduction to
          Roots.
        </p>
        <a className="text-link" href="/why-choose-us/">
          Why choose Roots <ArrowUpRight size={18} />
        </a>
      </div>
      <div className="clinic-media reveal">
        <div className="clinic-film">
          {playing ? (
            <iframe
              src="https://player.vimeo.com/video/1043809908?autoplay=1&autopause=1"
              title="Why choose Roots — Roots All on X Bob"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button className="clinic-film-play" type="button" onClick={() => setPlaying(true)}>
              <img src="/images/why-roots-video.jpg" alt="" width="960" height="540" loading="lazy" />
              <span className="clinic-film-label">
                <span className="clinic-play-icon">
                  <Play size={22} fill="currentColor" aria-hidden="true" />
                </span>
                <span>
                  Why choose us?<small>Watch the Roots introduction · 40 seconds</small>
                </span>
              </span>
            </button>
          )}
        </div>
        {playing && (
          <button className="clinic-close-video" onClick={() => setPlaying(false)} type="button">
            Close video
          </button>
        )}
        <a
          className="clinic-interview"
          href="https://www.youtube.com/watch?v=pN3CBJLzDLE"
          target="_blank"
          rel="noreferrer"
        >
          <span className="clinic-interview-icon">
            <Play size={18} aria-hidden="true" />
          </span>
          <span>
            <span className="eyebrow">ROOTS ON EVERYDAY NORTHWEST</span>
            <strong>Watch the TV interview</strong>
            <small>May 30, 2025 · Opens on YouTube</small>
          </span>
          <ArrowUpRight size={20} aria-hidden="true" />
        </a>
      </div>
    </section>,
    locale,
  );
}
