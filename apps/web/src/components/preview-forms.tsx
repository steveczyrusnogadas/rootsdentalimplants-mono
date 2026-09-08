import { localizeTree, useLocale } from "@/lib/i18n";
import { useId, useState } from "react";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { locations } from "@/content/locations";

export function PreviewForm({
  kind = "callback",
  location,
}: {
  kind?: "callback" | "guide" | "event";
  location?: string;
}) {
  const locale = useLocale();
  const id = useId();
  const [notice, setNotice] = useState(false);
  const title =
    kind === "event"
      ? "Your place at the table."
      : kind === "guide"
        ? "Request an implant pricing guide."
        : "Ask for a conversation.";
  return localizeTree(
    <section className="preview-form" aria-labelledby={`${id}-title`}>
      <p className="eyebrow">{kind === "event" ? "RSVP PREVIEW" : "REQUEST PREVIEW"}</p>
      <h2 id={`${id}-title`}>{title}</h2>
      <p className="preview-disclosure">
        Design preview only. Entries are not sent or saved. To reach Roots, call your location or use online booking.
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setNotice(true);
        }}
      >
        <div className="form-pair">
          <label htmlFor={`${id}-first`}>
            First name
            <input id={`${id}-first`} autoComplete="given-name" />
          </label>
          <label htmlFor={`${id}-last`}>
            Last name
            <input id={`${id}-last`} autoComplete="family-name" />
          </label>
        </div>
        <div className="form-pair">
          <label htmlFor={`${id}-email`}>
            Email
            <input id={`${id}-email`} type="email" autoComplete="email" />
          </label>
          <label htmlFor={`${id}-phone`}>
            Phone
            <input id={`${id}-phone`} type="tel" autoComplete="tel" />
          </label>
        </div>
        <label htmlFor={`${id}-location`}>
          Preferred location
          <select id={`${id}-location`} defaultValue={location || ""}>
            <option value="">Choose a location</option>
            {locations.map((item) => (
              <option key={item.name}>{item.name}</option>
            ))}
          </select>
        </label>
        {kind === "event" ? (
          <label htmlFor={`${id}-guests`}>
            People attending
            <select id={`${id}-guests`}>
              <option>Just me</option>
              <option>Me and one guest</option>
            </select>
          </label>
        ) : (
          <>
            <label htmlFor={`${id}-question`}>
              What would you like to discuss?
              <textarea
                id={`${id}-question`}
                rows={3}
                placeholder="Please avoid sharing sensitive health details in this preview."
              />
            </label>
            <label htmlFor={`${id}-payment`}>
              Would you like to discuss payment options?
              <select id={`${id}-payment`}>
                <option>Choose an option</option>
                <option>Financing</option>
                <option>Paying directly</option>
                <option>I’m not sure yet</option>
              </select>
            </label>
          </>
        )}
        <label className="form-check">
          <input type="checkbox" />{" "}
          <span>
            Sample contact preference: I would like a call about this request. No contact request is sent in this
            preview.
          </span>
        </label>
        <button type="button" className="button" onClick={() => setNotice(true)}>
          Preview request <ArrowUpRight size={18} />
        </button>
        {notice && (
          <p className="form-feedback" role="status">
            This is the preview state. Nothing was submitted, saved or reserved.
          </p>
        )}
        {kind === "event" && (
          <a className="text-link" href="/implant-dinner-thank-you/">
            View response-page layout <ArrowUpRight size={16} />
          </a>
        )}
      </form>
    </section>,
    locale,
  );
}

const steps = [
  { title: "Which location works for you?", options: locations.map((location) => location.name) },
  {
    title: "What would you like to discuss?",
    options: [
      "One missing tooth",
      "Several missing teeth",
      "A full arch of teeth",
      "My current dentures",
      "I’m not sure yet",
    ],
  },
  {
    title: "What matters most to you?",
    options: [
      "Understanding my options",
      "Comfort and recovery",
      "Cost and payment options",
      "Talking to the care team",
    ],
  },
];

export function EligibilityQuiz() {
  const locale = useLocale();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const current = steps[step];
  return localizeTree(
    <section className="quiz-panel" aria-labelledby="quiz-step-title">
      <p className="preview-disclosure">
        Design preview only. Answers stay in this page while it is open. They are not submitted or saved, and this quiz
        does not determine clinical eligibility.
      </p>
      <div className="quiz-progress" aria-label={`Step ${step + 1} of ${steps.length}`}>
        {steps.map((_, index) => (
          <span key={index} className={index <= step ? "complete" : ""} />
        ))}
      </div>
      <p className="eyebrow">
        STEP {step + 1} OF {steps.length}
      </p>
      <h2 id="quiz-step-title" tabIndex={-1}>
        {current.title}
      </h2>
      <fieldset>
        <legend className="sr-only">{current.title}</legend>
        {current.options.map((option) => (
          <label className="quiz-choice" key={option}>
            <input
              type="radio"
              name={`step-${step}`}
              checked={answers[step] === option}
              onChange={() =>
                setAnswers((previous) => {
                  const next = [...previous];
                  next[step] = option;
                  return next;
                })
              }
            />
            <span>{option}</span>
          </label>
        ))}
      </fieldset>
      <div className="quiz-actions">
        {step > 0 && (
          <button type="button" className="text-link" onClick={() => setStep(step - 1)}>
            <ArrowLeft size={18} /> Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button
            type="button"
            disabled={!answers[step]}
            className="button"
            onClick={() => {
              setStep(step + 1);
              document.getElementById("quiz-step-title")?.focus();
            }}
          >
            Continue <ArrowUpRight size={18} />
          </button>
        ) : (
          <a className="button" href="/thank-you/">
            Preview next step <ArrowUpRight size={18} />
          </a>
        )}
      </div>
    </section>,
    locale,
  );
}
