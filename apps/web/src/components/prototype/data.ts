// PROTOTYPE — real copy and corpus assets for the Roots homepage stub (ticket 08).

export const PHONE_MAIN = "(503) 647-6135";

export const navItems = [
  { label: "Treatments", href: "#treatments" },
  { label: "Why Roots", href: "#why" },
  { label: "Before & After", href: "#proof" },
  { label: "Locations", href: "#locations" },
  { label: "FAQ", href: "#" },
] as const;

export const hero = {
  eyebrow: "Roots Dental Implant Center — Oregon & Washington",
  title: "Transform your smile with lasting dental implants",
  support:
    "We specialize in high-quality, personalized implant care — from a single tooth to a full arch, planned around you.",
  cta: "Book a consultation",
};

export const pricing = {
  eyebrow: "Implant-supported dentures",
  title: "“Teeth in a Day,” priced in the open",
  rows: [
    { label: "Single arch", amount: "$18,995", note: "As low as $18,995 with the implant membership plan" },
    { label: "Full arch", amount: "$35,995", note: "As low as $35,995 with the membership plan" },
  ],
  footnote: "We will meet or beat any local competitor pricing with a written quote.",
};

export const expertise = [
  {
    title: "Full mouth restoration with implants",
    body: "Often known as All-on-X, this treatment uses four or more implants per jaw to fix a permanent, full set of teeth in place.",
    image: "/prototype/clinic.jpg",
  },
  {
    title: "Ceramic implant crowns",
    body: "Made of zirconia, a strong and biocompatible ceramic — a metal-free option that still stands up to daily life.",
    image: "/prototype/smile.jpg",
  },
  {
    title: "Titanium implant crowns",
    body: "Medical-grade titanium with a long track record of success — lightweight strength and proven biocompatibility.",
    image: "/prototype/consult.jpg",
  },
] as const;

export const whyPoints = [
  { title: "Experienced dental professionals", body: "Our dentists have years of experience in dental implant procedures." },
  { title: "Advanced technology", body: "Cutting-edge techniques for precise, efficient implant placement." },
  { title: "Personalized treatment plans", body: "Plans tailored to your needs and goals, so results fit you." },
  { title: "Comfortable, caring environment", body: "A relaxing, supportive atmosphere throughout your treatment." },
] as const;

export const doctors = [
  { name: "Dr. Clark Brinton, DMD", role: "Doctor of Medicine in Dentistry", image: "/prototype/doctor-brinton.jpg" },
  { name: "Dr. Seth Huish, DMD", role: "Doctor of Medicine in Dentistry", image: "/prototype/doctor-huish.jpg" },
  { name: "Dr. Jonathan Gold, DMD", role: "Doctor of Medicine in Dentistry", image: "/prototype/doctor-gold.jpg" },
  { name: "Dr. Brian R. Hale, DMD", role: "Doctor of Medicine in Dentistry", image: "/prototype/doctor-hale.webp" },
  { name: "Adam Kearns", role: "MS CRNA", image: "/prototype/doctor-kearns.jpg" },
  { name: "Dr. Chris Epperson, DMD", role: "Doctor of Medicine in Dentistry", image: "/prototype/doctor-epperson.jpg" },
  { name: "Dr. Jacob Kaufman, DMD", role: "Doctor of Medicine in Dentistry", image: "/prototype/doctor-kaufman.jpg" },
] as const;

export const stories = [
  {
    quote: "The function of my teeth suffered for years. Dr. Huish restored my entire smile.",
    poster: "/prototype/story-1.jpg",
  },
  {
    quote: "My teeth deteriorated due to medical issues. Dental implants gave me the freedom to smile again.",
    poster: "/prototype/story-2.jpg",
  },
  {
    quote: "Coming here for my dental implants was the best decision.",
    poster: "/prototype/story-3.jpg",
  },
] as const;

export const locations = [
  { city: "Portland", phone: "(503) 647-6135", hours: "Monday – Thursday, 8:00 AM – 5:00 PM" },
  { city: "Vancouver", phone: "(360) 310-4683", hours: "Monday – Thursday, 8:00 AM – 3:00 PM" },
  { city: "Salem", phone: "(503) 506-6339", hours: "Monday – Friday, 8:00 AM – 3:00 PM" },
  { city: "Gresham", phone: "(503) 512-6184", hours: "Monday – Thursday, 8:00 AM – 5:00 PM" },
  { city: "Troutdale", phone: "(503) 855-6792", hours: "Tuesday – Friday, 8:00 AM – 5:00 PM" },
] as const;

export const finalCta = {
  title: "Schedule your consultation with our dental experts today",
  cta: "Request a consultation",
};

export const trustBadges = ["Advanced Equipment", "Low Stress", "Experienced Team"] as const;

export const experience = {
  title: "Why does experience matter?",
  body: "Implants aren't inexpensive, and they aren't simple. A team that places them every day — across five centers — plans around the surprises before they happen, and your result is built to last.",
  image: "/prototype/smile.jpg",
};

export const knowUs = {
  title: "Get to know us better",
  length: "5 minutes",
  poster: "/prototype/consult.jpg",
};

export const faqs = [
  {
    q: "What are dental implants?",
    a: "Artificial tooth roots, surgically placed into the jawbone, that provide a strong foundation for crowns, bridges, or dentures.",
  },
  {
    q: "Are dental implant procedures painful?",
    a: "Modern techniques and anesthesia make implant procedures virtually painless. Any discomfort afterward is typically mild and manageable.",
  },
  {
    q: "How long do dental implants last?",
    a: "With proper care, dental implants can last a lifetime. They are a durable, long-lasting solution for replacing missing teeth.",
  },
  {
    q: "What is the recovery time?",
    a: "It varies with the individual and the complexity of the procedure, but most patients resume normal activities within a few days.",
  },
] as const;

export const mapEmbed = "https://www.google.com/maps?q=Roots+Dental+Implant+Center&output=embed";
