import { ArrowUpRight, Plus } from "lucide-react";
import { SiteHeader, SiteFooter } from "./site-shell";
import { EligibilityQuiz, PreviewForm } from "./preview-forms";
import { events, faqs, providers, treatments, type Page } from "@/content/pages";
import { locations } from "@/content/locations";
import { PatientStories } from "./patient-stories";
import { LocationsMap } from "./locations-map";

const hours: Record<string, string> = {
  Portland: "Monday–Thursday · 8 AM–5 PM",
  Gresham: "Monday–Thursday · 8 AM–5 PM",
  Troutdale: "Tuesday–Friday · 8 AM–5 PM",
  Salem: "Monday–Friday · 8 AM–3 PM",
  Vancouver: "Monday–Thursday · 8 AM–3 PM",
};

function LinkArrow({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="text-link" href={href}>
      {children}
      <ArrowUpRight size={18} />
    </a>
  );
}

function TreatmentLinks({ current }: { current: string }) {
  return (
    <section className="inner-section treatment-directory">
      <div className="inner-section-heading">
        <p className="eyebrow">EXPLORE YOUR OPTIONS</p>
        <h2>
          Care that fits
          <br />
          <em>your needs.</em>
        </h2>
      </div>
      <div className="treatment-links">
        {treatments
          .filter((page) => page.slug !== current)
          .map((page) => (
            <a href={`/${page.slug}/`} key={page.slug}>
              <img src={page.image} alt={page.imageAlt} loading="lazy" />
              <div>
                <h3>{page.eyebrow.charAt(0) + page.eyebrow.slice(1).toLowerCase()}</h3>
                <p>{page.description}</p>
                <span>
                  Explore treatment <ArrowUpRight size={18} />
                </span>
              </div>
            </a>
          ))}
      </div>
    </section>
  );
}

function TeamDirectory() {
  return (
    <section className="inner-section" id="team">
      <div className="inner-section-heading">
        <p className="eyebrow">THE PEOPLE BEHIND YOUR CARE</p>
        <h2>Meet our team.</h2>
      </div>
      <div className="provider-directory">
        {providers.map((provider) => (
          <a href={`/${provider.slug}/`} key={provider.slug}>
            <div className="provider-photo">
              <img src={provider.image} alt={provider.imageAlt} loading="lazy" />
            </div>
            <p className="eyebrow">{provider.eyebrow}</p>
            <h3>
              {provider.title}
              <ArrowUpRight size={20} />
            </h3>
          </a>
        ))}
      </div>
    </section>
  );
}

function LocationDirectory() {
  return (
    <section className="inner-section" id="locations">
      <div className="inner-section-heading">
        <p className="eyebrow">OREGON & WASHINGTON</p>
        <h2>
          Your next step.
          <br />
          <em>A little closer.</em>
        </h2>
      </div>
      <div className="contact-locations">
        {locations.map((location) => (
          <article key={location.name} id={location.name.toLowerCase()}>
            <div>
              <p className="eyebrow">{location.state === "OR" ? "OREGON" : "WASHINGTON"}</p>
              <h3>{location.name}</h3>
            </div>
            <address>
              {location.address}
              <br />
              {location.zip}
              <a href={`tel:${location.phone}`}>{location.phone}</a>
            </address>
            <div>
              <p>{hours[location.name]}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address + " " + location.zip)}`}
              >
                Get directions <ArrowUpRight size={16} />
              </a>
            </div>
            <a
              className="button"
              href={`https://app.nexhealth.com/appt/arvory_dental_management?lid=${location.id}`}
              aria-label={`Book in ${location.name}`}
            >
              Book a visit <ArrowUpRight size={18} />
            </a>
          </article>
        ))}
      </div>
      <p className="inner-note">Booking opens NexHealth. Call your location to confirm hours for a particular day.</p>
    </section>
  );
}

function EventDirectory() {
  return (
    <section className="inner-section" id="events">
      <div className="inner-section-heading">
        <p className="eyebrow">COME WITH YOUR QUESTIONS</p>
        <h2>Implant dinner events.</h2>
      </div>
      <div className="event-directory">
        {events.map((event) => (
          <a href={`/${event.slug}/`} key={event.slug}>
            <span className="eyebrow">{event.status}</span>
            <h3>{event.name}</h3>
            <p>{event.date}</p>
            <span>
              Event details <ArrowUpRight size={18} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function Financing({ current }: { current: string }) {
  const lenders = [
    { name: "Proceed Finance", href: "https://www.proceedfinance.com/" },
    { name: "Sunbit", href: "https://sunbit.com/" },
    { name: "CareCredit", href: "https://www.carecredit.com/" },
    { name: "Cherry", href: "https://withcherry.com/" },
  ];
  return (
    <>
      <section className="inner-section editorial">
        <div>
          <p className="eyebrow">START WITH THE WHOLE PICTURE</p>
          <h2>
            A quote.
            <br />
            <em>A conversation.</em>
          </h2>
        </div>
        <div className="prose">
          <p>
            Ask for a written treatment plan and a clear explanation of what is included. Our team can discuss payment
            by major credit card and the financing providers listed below.
          </p>
          <h3>Have insurance questions?</h3>
          <p>
            Bring your plan information to your visit. Ask the team and your insurer about benefits and your expected
            share of the cost before treatment.
          </p>
          {current !== "financing-options" && (
            <LinkArrow href="/financing-options/">Explore financing options</LinkArrow>
          )}
          <h3>Before you apply</h3>
          <p>
            Compare interest, fees, total repayment, credit inquiries and early-payment terms directly with the
            provider. Approval and terms depend on the lender and your application.
          </p>
        </div>
      </section>
      <section className="inner-section lender-section">
        <p className="eyebrow">EXPLORE PROVIDER INFORMATION</p>
        <div className="lender-list">
          {lenders.map((lender) => (
            <a href={lender.href} key={lender.name}>
              <h3>{lender.name}</h3>
              <span>
                Visit provider <ArrowUpRight size={20} />
              </span>
            </a>
          ))}
        </div>
        <p className="inner-note">
          These links open external financing providers. Ask the Roots team which application is appropriate for your
          location.
        </p>
      </section>
      <section className="inner-section">
        <PreviewForm kind="guide" />
      </section>
    </>
  );
}

function Gallery() {
  return (
    <section className="inner-section full-gallery">
      <div className="gallery-intro">
        <p>
          Each pair appears together in the Roots gallery. Patient names and treatment details were not supplied with
          these photographs.
        </p>
        <LinkArrow href="/testimonials/">Hear a patient’s story</LinkArrow>
      </div>
      {Array.from({ length: 9 }, (_, index) => index + 1).map((pair) => (
        <figure key={pair}>
          <div className="gallery-pair">
            {["before", "after"].map((label) => (
              <div key={label}>
                <span>{label === "before" ? "Before" : "After"}</span>
                <img
                  src={`/images/${label}-${pair}.jpg`}
                  alt={`${label === "before" ? "Before" : "After"} treatment, Roots gallery comparison ${pair}`}
                  width="1000"
                  height="1000"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </figure>
      ))}
    </section>
  );
}

function Stories() {
  return (
    <>
      <PatientStories />
      <section className="inner-section story-reviews">
        <p className="eyebrow">CARE & COMMUNICATION</p>
        <div className="review-quotes">
          {[
            { quote: "Everyone seemed knowledgeable, helpful, and pleasant.", name: "Bethany V.", city: "Salem" },
            { quote: "The entire process was explained in detail.", name: "Kimberly S.", city: "Portland" },
            { quote: "Thoroughly answered all my questions.", name: "Walter W.", city: "Vancouver" },
          ].map((review) => (
            <blockquote key={review.name}>
              <p>“{review.quote}”</p>
              <footer>
                <strong>{review.name}</strong>
                <span>{review.city}</span>
                <small>Review excerpt</small>
              </footer>
            </blockquote>
          ))}
        </div>
        <LinkArrow href="/before-after/">Explore the patient gallery</LinkArrow>
      </section>
    </>
  );
}

function EventPage({ slug }: { slug: string }) {
  const event = events.find((item) => item.slug === slug)!;
  return (
    <>
      <section className="inner-section event-details">
        <div>
          <p className="eyebrow">{event.status}</p>
          <h2>{event.name}</h2>
          <p>Learn about implant options, bring your questions, and enjoy a complimentary dinner.</p>
          {event.status === "Past event" && (
            <p className="event-status">This date has passed. Call the team for information about future events.</p>
          )}
          {event.status === "Details to come" && (
            <p className="event-status">A new date and venue have not been announced. Call before making plans.</p>
          )}
          <LinkArrow href={`tel:${event.phone}`}>Call {event.phone}</LinkArrow>
        </div>
        <dl>
          <div>
            <dt>Date</dt>
            <dd>{event.date}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>{event.time}</dd>
          </div>
          <div>
            <dt>Place</dt>
            <dd>{event.venue}</dd>
          </div>
          {event.deadline && (
            <div>
              <dt>RSVP by</dt>
              <dd>{event.deadline}</dd>
            </div>
          )}
        </dl>
      </section>
      {event.slug === "implant-dinner-gresham" && (
        <aside className="inner-section event-offer">
          <p className="eyebrow">GRESHAM EVENT OFFER</p>
          <h2>Up to $1,000 off.</h2>
          <p>
            $500 per arch for implant treatment for dinner attendees. Presented and managed by Roots Dental Implant
            Center; valid for bookings within 30 days of the event. Confirm the offer with the team.
          </p>
        </aside>
      )}
      <section className="inner-section">
        <PreviewForm kind="event" location={event.name === "Halsey / Portland" ? "Portland" : event.name} />
      </section>
    </>
  );
}

export function InnerPage({ page }: { page: Page }) {
  const reading = page.kind === "policy" || page.kind === "article";
  return (
    <>
      <SiteHeader />
      <main id="main" className={`inner-page ${page.kind}-page`}>
        <section className={`inner-hero ${page.image ? "with-photo" : "text-hero"}`}>
          <div className="inner-hero-copy">
            <p className="eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p className="inner-deck">{page.description}</p>
            {page.kind === "treatment" && (
              <a className="button" href="/contact-us/#locations">
                Book a consultation <ArrowUpRight size={18} />
              </a>
            )}
            {page.kind === "profile" && <LinkArrow href="/why-choose-us/#team">Meet the whole team</LinkArrow>}
          </div>
          {page.image && (
            <figure>
              <img src={page.image} alt={page.imageAlt} fetchPriority="high" />
            </figure>
          )}
          {!page.image && !reading && <img className="inner-tree" src="/images/trees.svg" alt="" aria-hidden="true" />}
        </section>
        {page.sections && (
          <section className={`inner-section ${reading ? "reading-layout" : "editorial"}`}>
            <div className="section-index">
              <p className="eyebrow">{reading ? "INFORMATION" : "A CLOSER LOOK"}</p>
              <nav aria-label="On this page">
                {page.sections.map((section, i) => (
                  <a href={`#section-${i}`} key={section.title}>
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
            <div className="prose">
              {page.kind === "policy" && (
                <p className="policy-note">
                  Preview edition adapted from Roots’ existing policy. Business review is pending before launch.
                </p>
              )}
              {page.sections.map((section, index) => (
                <section id={`section-${index}`} key={section.title}>
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ))}
              {page.kind === "policy" && (
                <LinkArrow href={page.slug === "privacy" ? "/terms/" : "/privacy/"}>
                  {page.slug === "privacy" ? "SMS messaging terms" : "Privacy policy"}
                </LinkArrow>
              )}
            </div>
          </section>
        )}
        {page.kind === "treatment" && (
          <>
            <TreatmentLinks current={page.slug} />
            <section className="inner-section compact-note">
              <p>
                Implant treatment involves surgery and ongoing care. Discuss possible complications, alternatives and
                your individual suitability with your dentist.
              </p>
              <LinkArrow href="/faq/">Your questions, answered</LinkArrow>
            </section>
          </>
        )}
        {page.kind === "about" && <TeamDirectory />}
        {page.kind === "faq" && (
          <section className="inner-section faq-page-layout">
            <div>
              <p className="eyebrow">HERE TO HELP</p>
              <h2>
                Bring your
                <br />
                <em>questions.</em>
              </h2>
              <LinkArrow href="/contact-us/">Talk with our team</LinkArrow>
            </div>
            <div className="questions-list">
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>
                    {faq.question}
                    <Plus size={20} />
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}
        {page.kind === "finance" && <Financing current={page.slug} />}
        {page.kind === "gallery" && <Gallery />}
        {page.kind === "stories" && <Stories />}
        {page.kind === "locations" && (
          <>
            <LocationsMap />
            <LocationDirectory />
          </>
        )}
        {page.kind === "contact" && (
          <>
            <LocationDirectory />
            <section className="inner-section">
              <PreviewForm />
            </section>
            <EventDirectory />
          </>
        )}
        {page.kind === "quiz" && (
          <section className="inner-section quiz-layout">
            <EligibilityQuiz />
            <aside>
              <p className="eyebrow">PREFER A CONVERSATION?</p>
              <h2>
                We’re here
                <br />
                <em>to listen.</em>
              </h2>
              <p>You can book a consultation without completing a quiz.</p>
              <LinkArrow href="/contact-us/#locations">Find your location</LinkArrow>
            </aside>
          </section>
        )}
        {page.kind === "event" && <EventPage slug={page.slug} />}
        {page.kind === "confirmation" && (
          <section className="inner-section confirmation-panel">
            <h2>Ready to talk to a person?</h2>
            <p>Choose your location to call the team or book through NexHealth.</p>
            <a className="button" href="/contact-us/#locations">
              Find your location <ArrowUpRight size={18} />
            </a>
          </section>
        )}
        {page.kind === "smile" && (
          <section className="inner-section smile-layout">
            <div className="smile-upload">
              <p className="eyebrow">PHOTO STEP · DESIGN PREVIEW</p>
              <h2>Your smile starts here.</h2>
              <label htmlFor="smile-photo">
                Choose a smile photo
                <input type="file" id="smile-photo" accept="image/*" disabled />
              </label>
              <p>
                Photo selection and image generation are unavailable in this preview. No photograph is collected or
                uploaded.
              </p>
            </div>
            <div>
              <h2>
                A conversation
                <br />
                <em>about possibilities.</em>
              </h2>
              <p>
                A future visual preview would be illustrative, not a clinical prediction. For a real assessment, talk
                with the Roots team.
              </p>
              <LinkArrow href="/contact-us/">Plan a consultation</LinkArrow>
            </div>
          </section>
        )}
        {!reading && !["contact", "confirmation", "quiz", "event", "smile"].includes(page.kind) && (
          <section className="inner-section inner-consultation">
            <img src="/images/trees.svg" alt="" aria-hidden="true" />
            <div>
              <p className="eyebrow">YOUR NEXT CHAPTER</p>
              <h2>
                Start with
                <br />
                <em>a conversation.</em>
              </h2>
              <a className="button" href="/contact-us/#locations">
                Find your location <ArrowUpRight size={18} />
              </a>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
