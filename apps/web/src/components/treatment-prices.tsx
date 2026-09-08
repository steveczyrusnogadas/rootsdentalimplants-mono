import { localizeTree, useLocale } from "@/lib/i18n";
import { MembershipPrices } from "./homepage-experiment";
import "./care-content.css";

/** Shared amounts and conditions stay in the homepage's single pricing source. */
export function TreatmentPrices() {
  const locale = useLocale();
  return localizeTree(
    <section className="inner-section care-treatment-prices">
      <MembershipPrices />
    </section>,
    locale,
  );
}
