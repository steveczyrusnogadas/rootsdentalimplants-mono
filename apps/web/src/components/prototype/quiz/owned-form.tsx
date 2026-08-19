// PROTOTYPE — owned eligibility quiz. Same HighLevel questions, three steps,
// Location inside the form. No HighLevel iframe. Does not POST.
import { useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { findQuizLocation, quizLocations, type QuizLocationSlug } from "./data";

const mouthOptions = [
  { value: "single", label: "Single tooth" },
  { value: "several", label: "Several teeth" },
  { value: "arch", label: "One arch" },
  { value: "both", label: "Both arches" },
] as const;

const consideringOptions = [
  { value: "1-3m", label: "1–3 months" },
  { value: "3-12m", label: "3 months to a year" },
  { value: "years", label: "I’ve wanted them for years" },
] as const;

const financingOptions = [
  { value: "financing", label: "Financing" },
  { value: "personal", label: "Personal funds" },
  { value: "both", label: "Combination of both" },
  { value: "unsure", label: "Unsure / need guidance" },
] as const;

type Mouth = (typeof mouthOptions)[number]["value"];
type Considering = (typeof consideringOptions)[number]["value"];
type Financing = (typeof financingOptions)[number]["value"];

function Chip({
  selected,
  onSelect,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`font-display rounded-md px-4 py-2.5 text-sm font-semibold ${
        selected ? "bg-[var(--forest)] text-white" : "bg-[var(--mint)] text-[var(--pine)] hover:bg-[var(--sage)]/40"
      }`}
    >
      {children}
    </button>
  );
}

export function OwnedQuiz({ locationSlug }: { locationSlug?: string }) {
  const navigate = useNavigate({ from: "/prototype/quiz" });
  const preselected = findQuizLocation(locationSlug);
  const [step, setStep] = useState<1 | 2 | 3>(preselected ? 2 : 1);
  const [slug, setSlug] = useState<QuizLocationSlug | undefined>(preselected?.slug);
  const [pain, setPain] = useState<"yes" | "no" | undefined>();
  const [considering, setConsidering] = useState<Considering | undefined>();
  const [mouth, setMouth] = useState<Mouth | undefined>();
  const [notes, setNotes] = useState("");
  const [tv, setTv] = useState<"yes" | "no" | undefined>();
  const [financing, setFinancing] = useState<Financing | undefined>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [smsMarketing, setSmsMarketing] = useState(false);
  const [smsTransactional, setSmsTransactional] = useState(false);
  const [done, setDone] = useState(false);

  const chosen = findQuizLocation(slug);

  const pickLocation = (next: QuizLocationSlug) => {
    setSlug(next);
    void navigate({
      search: (prev) => ({ ...prev, location: next }),
      replace: true,
    });
  };

  const goClinical = () => {
    if (!slug) return;
    setStep(2);
  };

  const goYou = () => {
    if (!pain || !considering || !mouth) return;
    setStep(3);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!slug || !name.trim() || !phone.trim() || !email.trim() || !tv || !financing) return;
    if (!smsMarketing || !smsTransactional) return;
    setDone(true);
  };

  if (done && chosen) {
    return (
      <div className="py-6 text-center">
        <p className="font-display text-2xl font-semibold text-[var(--pine)]">We have your quiz</p>
        <p className="mt-3 text-[var(--smoke)]">
          Someone from the {chosen.city} team will follow up. This prototype does not save a Lead yet.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-8">
      <p className="text-xs font-semibold tracking-[0.16em] text-[var(--forest)] uppercase">
        Step {step} of 3
      </p>

      {step === 1 ? (
        <fieldset>
          <legend className="font-display text-xl font-semibold text-[var(--pine)]">
            Where would you like to be seen?
          </legend>
          <p className="mt-2 text-sm text-[var(--smoke)]">The rest of the quiz is the same at every implant center.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {quizLocations.map((location) => (
              <Chip key={location.slug} selected={slug === location.slug} onSelect={() => pickLocation(location.slug)}>
                {location.city}
              </Chip>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              disabled={!slug}
              onClick={goClinical}
              className="font-display rounded-md bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        </fieldset>
      ) : null}

      {step === 2 ? (
        <div className="flex flex-col gap-8">
          <fieldset>
            <legend className="font-display text-xl font-semibold text-[var(--pine)]">
              What part of your mouth is giving you issues?
            </legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {mouthOptions.map((option) => (
                <Chip key={option.value} selected={mouth === option.value} onSelect={() => setMouth(option.value)}>
                  {option.label}
                </Chip>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="font-display text-xl font-semibold text-[var(--pine)]">
              Does tooth pain interfere with your day?
            </legend>
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip selected={pain === "yes"} onSelect={() => setPain("yes")}>
                Yes
              </Chip>
              <Chip selected={pain === "no"} onSelect={() => setPain("no")}>
                No
              </Chip>
            </div>
          </fieldset>
          <fieldset>
            <legend className="font-display text-xl font-semibold text-[var(--pine)]">
              How long have you been considering implants?
            </legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {consideringOptions.map((option) => (
                <Chip
                  key={option.value}
                  selected={considering === option.value}
                  onSelect={() => setConsidering(option.value)}
                >
                  {option.label}
                </Chip>
              ))}
            </div>
          </fieldset>
          <label className="block">
            <span className="font-display text-xl font-semibold text-[var(--pine)]">Anything else about your teeth?</span>
            <span className="mt-1 block text-sm text-[var(--smoke)]">Optional</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              className="mt-3 w-full rounded-md border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-[var(--pine)]"
            />
          </label>
          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(1)} className="font-display text-sm font-semibold text-[var(--forest)]">
              Back
            </button>
            <button
              type="button"
              disabled={!pain || !considering || !mouth}
              onClick={goYou}
              className="font-display rounded-md bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="flex flex-col gap-8">
          <fieldset>
            <legend className="font-display text-xl font-semibold text-[var(--pine)]">
              Are you familiar with our TV advertisements?
            </legend>
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip selected={tv === "yes"} onSelect={() => setTv("yes")}>
                Yes
              </Chip>
              <Chip selected={tv === "no"} onSelect={() => setTv("no")}>
                No
              </Chip>
            </div>
          </fieldset>
          <fieldset>
            <legend className="font-display text-xl font-semibold text-[var(--pine)]">
              Would you prefer financing or personal funds?
            </legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {financingOptions.map((option) => (
                <Chip
                  key={option.value}
                  selected={financing === option.value}
                  onSelect={() => setFinancing(option.value)}
                >
                  {option.label}
                </Chip>
              ))}
            </div>
          </fieldset>
          <label className="block">
            <span className="text-sm font-medium text-[var(--pine)]">Full name</span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-md border border-[var(--line)] bg-[var(--paper)] px-4 py-3"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[var(--pine)]">Phone</span>
            <input
              required
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="mt-2 w-full rounded-md border border-[var(--line)] bg-[var(--paper)] px-4 py-3"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[var(--pine)]">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-md border border-[var(--line)] bg-[var(--paper)] px-4 py-3"
            />
          </label>
          <label className="flex gap-3 text-sm leading-relaxed text-[var(--smoke)]">
            <input type="checkbox" checked={smsTransactional} onChange={(event) => setSmsTransactional(event.target.checked)} className="mt-1" />
            <span>
              I consent to receive non-marketing text messages from Roots Dental about my order updates, appointment
              reminders etc. Frequency may vary. Message and data rates may apply. Text HELP for assistance, reply STOP
              to opt out.
            </span>
          </label>
          <label className="flex gap-3 text-sm leading-relaxed text-[var(--smoke)]">
            <input type="checkbox" checked={smsMarketing} onChange={(event) => setSmsMarketing(event.target.checked)} className="mt-1" />
            <span>
              I consent to receive marketing text messages from Roots Dental at the phone number provided. Frequency may
              vary. Message and data rates may apply. Text HELP for assistance, reply STOP to opt out.
            </span>
          </label>
          <p className="text-xs text-[var(--smoke)]">
            <a href="/privacy/" className="underline">
              Privacy
            </a>
            {" · "}
            <a href="/terms/" className="underline">
              Terms
            </a>
          </p>
          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(2)} className="font-display text-sm font-semibold text-[var(--forest)]">
              Back
            </button>
            <button
              type="submit"
              className="font-display rounded-md bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-white"
            >
              Submit quiz
            </button>
          </div>
        </div>
      ) : null}
    </form>
  );
}
