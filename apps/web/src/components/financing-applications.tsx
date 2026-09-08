import { localizeTree, useLocale } from "@/lib/i18n";
import "./care-content.css";

// Practice-specific destinations read from the legacy /financing-options/ page
// on 2026-09-08. Preserve its account labels rather than infer new lender mappings.
const proceedLocations = [
  ["Roots Dental Implant Center", "8190-1539-28F4"],
  ["Roots Dental – Gresham", "8190-1542-F00E"],
  ["Roots Dental – Hollywood", "8190-1543-2C5C"],
  ["Salem Dental", "8190-1541-82A7"],
  ["Troutdale Dental", "8190-1540-FF5C"],
  ["Vancouver Dental", "8190-6031-BEA6"],
  ["Roots Dental – Powell", "8190-1544-889D"],
  ["Carlton Dental", "8190-1545-1C32"],
];
const questions = [
  [
    "Will checking options affect my credit score?",
    "Some providers let you check options or prequalify with a soft credit inquiry. A hard inquiry may be required when you accept or finalize an offer. Check the provider’s disclosure before continuing.",
  ],
  [
    "Will I need an upfront payment?",
    "Application fees, down payments and other costs vary by provider and plan. Review the initial payment, interest, fees and total repayment before accepting an agreement.",
  ],
  [
    "How do I choose a provider?",
    "Compare the treatment cost, monthly payment, repayment term and credit requirements. You may review more than one provider and ask our team for help understanding your options.",
  ],
  [
    "Can I pay it off early?",
    "Early-payment policies depend on your agreement. Check the provider’s terms for prepayment penalties before you accept an offer.",
  ],
];

export function FinancingApplications() {
  const locale = useLocale();
  return localizeTree(
    <section className="inner-section care-financing" aria-labelledby="financing-apply-title">
      <p className="eyebrow">TAKE THE NEXT STEP</p>
      <h2 id="financing-apply-title">Explore your financing options.</h2>
      <p className="care-financing-intro">
        Compare your options, apply online or with help from our team, and review the decision and agreement before
        choosing a plan. Applications open on the lender’s website; approval and terms are determined by the lender.
      </p>
      <div className="care-financing-grid">
        <div>
          <h3>Apply with Cherry</h3>
          <p>Use the Roots Dental application to see the options available to you.</p>
          <a href="https://pay.withcherry.com/roots-dental-" target="_blank" rel="noopener noreferrer">
            Open Roots’ Cherry application (new tab)
          </a>
        </div>
        <div>
          <h3>Apply with Proceed Finance</h3>
          <p>
            Choose the account named by your Roots team. If you are unsure which one applies to your visit, contact us
            before applying.
          </p>
          <details>
            <summary>Choose your Proceed application</summary>
            <ul>
              {proceedLocations.map(([name, referrer]) => (
                <li key={referrer}>
                  <a
                    href={`https://www.proceedfinance.com/application/create?referrer=${referrer}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {name} (new tab)
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
      <div className="care-financing-help">
        <h3>Questions before you apply?</h3>
        {questions.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
        <p className="care-financing-intro">
          Our team can help you understand the application process in the office. For guidance, email{" "}
          <a href="mailto:implants@rootsdental.com">implants@rootsdental.com</a> or{" "}
          <a href="/contact-us/">contact your Roots location</a>.
        </p>
      </div>
    </section>,
    locale,
  );
}
