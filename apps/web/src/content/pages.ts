export type Section = { title: string; paragraphs: string[] };
export type Page = {
  slug: string;
  title: string;
  seoTitle?: string;
  eyebrow: string;
  description: string;
  image?: string;
  imageAlt?: string;
  kind:
    | "treatment"
    | "about"
    | "profile"
    | "faq"
    | "finance"
    | "gallery"
    | "stories"
    | "locations"
    | "contact"
    | "blog"
    | "article"
    | "policy"
    | "quiz"
    | "event"
    | "confirmation"
    | "smile";
  sections?: Section[];
};

export const treatments: Page[] = [
  {
    slug: "dental-implants",
    kind: "treatment",
    eyebrow: "DENTAL IMPLANT CARE",
    title: "A new foundation for your smile.",
    description:
      "One tooth, several teeth, or a full arch. Explore the options and start with a plan built around you.",
    image: "/images/clinic.jpg",
    imageAlt: "Inside the Roots dental clinic",
    sections: [
      {
        title: "What is a dental implant?",
        paragraphs: [
          "An implant sits in the jawbone and supports a replacement tooth or teeth. A connector joins the implant to a crown, bridge or denture. Your dentist will explain which restoration fits your needs.",
        ],
      },
      {
        title: "A process, with a plan.",
        paragraphs: [
          "Care begins with an assessment of your oral health and treatment goals. Implant placement is followed by a healing period, then the connector and custom restoration. The timing depends on your treatment and healing.",
        ],
      },
      {
        title: "Know your options.",
        paragraphs: [
          "A consultation is a chance to compare treatments, understand their benefits and risks, and discuss cost and ongoing care. Bring your questions; you do not need to choose an option before your visit.",
        ],
      },
    ],
  },
  {
    slug: "single-tooth-implants",
    kind: "treatment",
    eyebrow: "SINGLE-TOOTH IMPLANTS",
    title: "One missing tooth. A personal solution.",
    description: "Explore an implant and custom crown for a gap left by a missing tooth.",
    image: "/images/single-tooth.jpg",
    imageAlt: "A technician preparing a dental restoration",
    sections: [
      {
        title: "Designed for one space.",
        paragraphs: [
          "A single-tooth restoration combines an implant in the jaw, a connector and a custom crown. Your dentist assesses the gap and surrounding teeth before recommending a plan.",
        ],
      },
      {
        title: "From assessment to restoration.",
        paragraphs: [
          "The Roots process begins with a consultation, followed by implant placement if appropriate. After the implant heals with the surrounding bone, a connector and custom crown complete the restoration. Healing can take several months.",
        ],
      },
      {
        title: "Questions worth bringing.",
        paragraphs: [
          "Ask about the treatment timeline, the appearance of your crown, care during healing, and the full cost of your plan. Your dentist can explain how the option compares with other ways to replace the tooth.",
        ],
      },
    ],
  },
  {
    slug: "full-arch-dental-implants",
    kind: "treatment",
    eyebrow: "FULL-ARCH DENTAL IMPLANTS",
    title: "A complete arch. A fresh beginning.",
    description:
      "A fixed restoration supported by several implants can replace an entire upper or lower arch of teeth.",
    image: "/images/full-arch-treatment.jpg",
    imageAlt: "A Roots team member discussing treatment with a patient",
    sections: [
      {
        title: "Understanding full-arch care.",
        paragraphs: [
          "Rather than replacing each tooth separately, a full-arch restoration uses a group of implants to support a complete set of replacement teeth. Roots also describes this approach as All-On-X.",
        ],
      },
      {
        title: "Your treatment, in stages.",
        paragraphs: [
          "Your dentist assesses your mouth and goals, plans implant placement, and explains the healing and restoration stages. Custom teeth are connected to the implants as your treatment progresses.",
        ],
      },
      {
        title: "What does ‘teeth in a day’ mean for you?",
        paragraphs: [
          "Ask your dentist which stages may happen on the same day and which require healing. A same-day description is not a promise that every patient’s full treatment is completed in one visit. Request a written plan, timeline and personalized quote.",
        ],
      },
    ],
  },
  {
    slug: "implant-supported-dentures",
    kind: "treatment",
    eyebrow: "IMPLANT-SUPPORTED DENTURES",
    title: "Support for a more secure smile.",
    description: "Explore a denture connected to dental implants for added stability when replacing multiple teeth.",
    image: "/images/implant-dentures.jpg",
    imageAlt: "A patient with the Roots care team",
    sections: [
      {
        title: "A different foundation.",
        paragraphs: [
          "Implant-supported dentures connect replacement teeth to implants in the jaw. They offer an alternative to a traditional denture that rests on the gums. Your dentist can explain the design and maintenance that suit your situation.",
        ],
      },
      {
        title: "Planned around your mouth.",
        paragraphs: [
          "The process includes a consultation, implant placement, healing, and connections for a custom denture. The number and position of implants and the type of restoration are determined during your assessment.",
        ],
      },
      {
        title: "Make the comparison clear.",
        paragraphs: [
          "Ask how your proposed denture attaches, whether it is removable, how to clean it, and what follow-up care is needed. Discuss the complete treatment cost and available payment options before choosing your plan.",
        ],
      },
    ],
  },
];

export const providers: Page[] = [
  {
    slug: "dr-clark-brinton",
    kind: "profile",
    eyebrow: "GENERAL DENTIST · DMD",
    title: "Dr. Clark Brinton",
    description: "Implant care, education and a commitment to continued learning.",
    image: "/images/brinton.jpg",
    imageAlt: "Dr. Clark Brinton",
    sections: [
      {
        title: "Meet Dr. Brinton.",
        paragraphs: [
          "Dr. Brinton is a general dentist whose clinical practice focuses on dental implants. He graduated from Oregon Health & Science University School of Dentistry in 2013 and spent four years serving rural communities in New Mexico through the National Health Service Corps.",
          "After returning to Oregon in 2017, he began teaching dentists about implant placement and restoration. His work includes implant education with Dental Success Network and Neodent/Straumann Group, alongside continuing clinical education.",
        ],
      },
      { title: "Beyond the clinic.", paragraphs: ["Dr. Brinton co-owns Element Dental Lab and is a father of three."] },
    ],
  },
  {
    slug: "dr-seth-huish",
    kind: "profile",
    eyebrow: "GENERAL DENTIST · DMD",
    title: "Dr. Seth Huish",
    description: "A personal understanding of how dental care can make a difference.",
    image: "/images/huish.jpg",
    imageAlt: "Dr. Seth Huish",
    sections: [
      {
        title: "Meet Dr. Huish.",
        paragraphs: [
          "Dr. Huish graduated from Oregon Health & Science University School of Dentistry in 2013. His further training includes orthodontics, dental surgery and endodontics, as well as experience caring for patients with special needs.",
          "He has completed two fellowships in implant therapy and training in oral and IV sedation. He also mentors dentists in surgical and restorative techniques. His own experience of breaking a front tooth helped shape his interest in dentistry.",
        ],
      },
      {
        title: "Beyond the clinic.",
        paragraphs: [
          "Outside work, he enjoys outdoor adventures with his wife and four daughters, including skiing, biking, hiking and boating.",
        ],
      },
    ],
  },
  {
    slug: "dr-jonathan-gold",
    kind: "profile",
    eyebrow: "GENERAL DENTIST · DMD",
    title: "Dr. Jonathan Gold",
    description: "Patient-centered dentistry, with an individual approach to implant care.",
    image: "/images/gold.jpg",
    imageAlt: "Dr. Jonathan Gold",
    sections: [
      {
        title: "Meet Dr. Gold.",
        paragraphs: [
          "Dr. Gold graduated from Oregon Health & Science University School of Dentistry in 2010. He spent nine years caring for underserved Medicaid patients in southern Louisiana before returning to Oregon in 2020.",
          "He completed a Fellowship in Implant Dentistry through the California Implant Institute in 2024. His background also includes teaching at Louisiana State University and OHSU.",
        ],
      },
      {
        title: "Beyond the clinic.",
        paragraphs: ["He enjoys Oregon’s outdoors with his son, from skiing and hiking to golf and kite flying."],
      },
    ],
  },
  {
    slug: "dr-brian-hale",
    kind: "profile",
    eyebrow: "GENERAL DENTIST · DMD",
    title: "Dr. Brian R. Hale",
    description: "A foundation in general dentistry and hospital-based surgical training.",
    image: "/images/hale.webp",
    imageAlt: "Dr. Brian R. Hale",
    sections: [
      {
        title: "Meet Dr. Hale.",
        paragraphs: [
          "Dr. Hale earned a biology degree from Brigham Young University and graduated from the UNLV School of Dental Medicine in 2017. He then completed a General Practice Residency at the Veterans Affairs Medical Center in Baltimore, developing his implant and surgical skills.",
          "He moved to Troutdale with his wife in 2018. His general dental practice includes single-tooth and full-arch implant care. His continuing education includes Hero Dental Education and courses at the Pikos Institute.",
        ],
      },
      {
        title: "A little more about Dr. Hale.",
        paragraphs: ["He grew up in Las Vegas and speaks Spanish, having lived in southern Argentina."],
      },
    ],
  },
  {
    slug: "dr-chris-epperson",
    kind: "profile",
    eyebrow: "GENERAL DENTIST · DMD",
    title: "Dr. Chris Epperson",
    description: "Implant dentistry informed by education and service.",
    image: "/images/epperson.jpg",
    imageAlt: "Dr. Chris Epperson",
    sections: [
      {
        title: "Meet Dr. Epperson.",
        paragraphs: [
          "Dr. Epperson earned his dental degree at A.T. Still University’s Arizona School of Dentistry & Oral Health. Humanitarian visits to Mexico and the Dominican Republic helped introduce him to dentistry.",
          "His experience includes full-mouth implant treatment. He is a Fellow of the International Congress of Oral Implantologists and a member of the American Academy of Implant Dentistry. He has also taught at Implant Pathway.",
        ],
      },
      {
        title: "Beyond the clinic.",
        paragraphs: [
          "Originally from Arizona, he lives in the Pacific Northwest with his wife and three children. He enjoys outdoor activities, barbecue, and working on his truck and motorcycle.",
        ],
      },
    ],
  },
  {
    slug: "dr-jacob-kaufman",
    kind: "profile",
    eyebrow: "GENERAL DENTIST · DMD",
    title: "Dr. Jacob Kaufman",
    description: "Digital planning with a personal approach to care.",
    image: "/images/kaufman.jpg",
    imageAlt: "Dr. Jacob Kaufman",
    sections: [
      {
        title: "Meet Dr. Kaufman.",
        paragraphs: [
          "Dr. Kaufman grew up in Newberg and practices in Gresham. He graduated from Oregon Health & Science University School of Dentistry and completed the California Implant Institute’s Fellowship in Implant Dentistry.",
          "His clinical interests include guided implant surgery, digital treatment planning and 3D-printed restorations, supported by continuing education in implant and restorative dentistry.",
        ],
      },
      {
        title: "Beyond the clinic.",
        paragraphs: [
          "He enjoys backpacking, golf and live music around Portland, and spending time with his partner Jan and their dogs, Dillard and Olive.",
        ],
      },
    ],
  },
  {
    slug: "adam-kearns",
    kind: "profile",
    eyebrow: "NURSE ANESTHETIST · MS CRNA",
    title: "Adam Kearns",
    description: "Anesthesia experience across hospital and community settings.",
    image: "/images/kearns.jpg",
    imageAlt: "Adam Kearns",
    sections: [
      {
        title: "Meet Adam.",
        paragraphs: [
          "Adam began his anesthesia career in a Level One trauma hospital, caring for trauma and neurosurgical patients. His experience also includes anesthesia care for cardiac surgery patients.",
          "After moving to Portland, he continued practicing in a range of urban and rural settings. He is a father of two.",
        ],
      },
    ],
  },
];

export const events = [
  {
    slug: "implant-dinner-gresham",
    name: "Gresham",
    date: "October 29, 2026",
    time: "5:30 PM",
    venue: "Bumpers · 21935 NE Halsey St #100, Fairview, OR 97024",
    status: "Upcoming event",
    deadline: "October 23, 2026",
    phone: "503-512-6184",
  },
  {
    slug: "implant-dinner-troutdale",
    name: "Troutdale",
    date: "To be announced",
    time: "To be announced",
    venue: "Venue to be announced",
    status: "Details to come",
    phone: "503-855-6792",
  },
  {
    slug: "implant-dinner-halsey",
    name: "Halsey / Portland",
    date: "June 4, 2026",
    time: "6:00 PM",
    venue: "Roots Dental Office Halsey",
    status: "Past event",
    phone: "503-647-6135",
  },
  {
    slug: "implant-dinner-vancouver",
    name: "Vancouver",
    date: "May 21, 2026",
    time: "7:00 PM",
    venue: "Gustav’s",
    status: "Past event",
    phone: "360-310-4683",
  },
  {
    slug: "implant-dinner-salem",
    name: "Salem",
    date: "June 17, 2026",
    time: "5:45 PM",
    venue: "Ratchet Brewery",
    status: "Past event",
    phone: "503-506-6339",
  },
];

const otherPages: Page[] = [
  {
    slug: "locations",
    kind: "locations",
    eyebrow: "ROOTS IMPLANT CENTERS",
    title: "Find your Roots.",
    description:
      "Five implant center locations across Oregon and Washington. Choose a location to call or book a visit.",
  },
  {
    slug: "why-choose-us",
    kind: "about",
    eyebrow: "ROOTED IN PERSONAL CARE",
    title: "People first. Always.",
    description: "Meet the people behind your care, and the approach that brings us together.",
    image: "/images/clinic.jpg",
    imageAlt: "The Roots clinic",
    sections: [
      {
        title: "Care begins with listening.",
        paragraphs: [
          "Your goals, questions and concerns help shape your treatment. Our team brings implant experience, digital technology and individual planning to the conversation, whether you are missing one tooth or several.",
        ],
      },
    ],
  },
  {
    slug: "faq",
    kind: "faq",
    eyebrow: "PATIENT INFORMATION",
    title: "Good questions. Clearer next steps.",
    description: "A starting point for your conversation about dental implants.",
  },
  {
    slug: "finance-insurance",
    kind: "finance",
    eyebrow: "FINANCING & INSURANCE",
    title: "Let’s make a plan you understand.",
    description: "Discuss your treatment quote, insurance questions and payment options with our team.",
    image: "/images/clinic.jpg",
    imageAlt: "Roots Dental clinic",
  },
  {
    slug: "financing-options",
    kind: "finance",
    eyebrow: "PAYMENT OPTIONS",
    title: "Explore ways to pay for your care.",
    description: "Compare financing providers and ask questions before choosing an agreement.",
  },
  {
    slug: "before-after",
    kind: "gallery",
    eyebrow: "PATIENT RESULTS",
    title: "Real smiles. Personal journeys.",
    description: "Before-and-after photographs from the Roots patient gallery. Individual results vary.",
  },
  {
    slug: "testimonials",
    kind: "stories",
    eyebrow: "PATIENT EXPERIENCES",
    title: "In their own words.",
    description: "Hear patient stories and read experiences shared about care and communication.",
  },
  {
    slug: "contact-us",
    kind: "contact",
    eyebrow: "FIVE LOCATIONS · ONE NEXT STEP",
    title: "Let’s start a conversation.",
    description: "Find your nearest Roots Implant Center, book a visit or call the team.",
  },
  {
    slug: "implant-eligibility-quiz",
    kind: "quiz",
    eyebrow: "IMPLANT ELIGIBILITY QUIZ",
    title: "Where would you like to begin?",
    description:
      "Explore questions to bring to your implant consultation. Only a clinical assessment can determine suitability.",
  },
  {
    slug: "smile-preview",
    kind: "smile",
    eyebrow: "SMILE PREVIEW",
    title: "Imagine your next chapter.",
    description:
      "Explore the smile-preview experience. This design preview does not upload photos or generate treatment images.",
  },
  {
    slug: "thank-you",
    kind: "confirmation",
    eyebrow: "QUIZ PREVIEW",
    title: "Your next step is a conversation.",
    description:
      "This is a preview of the next-step page. No answers have been sent and no eligibility decision has been made.",
  },
  {
    slug: "implant-dinner-thank-you",
    kind: "confirmation",
    eyebrow: "EVENT RESPONSE PREVIEW",
    title: "Let’s look forward to meeting.",
    description:
      "This is a preview of the event response page. No RSVP has been sent and no place has been reserved. Call your location to ask about an event.",
  },
  {
    slug: "privacy",
    kind: "policy",
    eyebrow: "YOUR INFORMATION",
    title: "Privacy policy",
    description: "How Roots describes its handling of personal information and communications.",
    sections: [
      {
        title: "Information and purpose",
        paragraphs: [
          "Information you provide when contacting Roots or booking care supports dental services, appointment communications and assistance. Operational subcontractors may receive necessary information; Roots does not sell personal information or trade leads.",
        ],
      },
      {
        title: "Messages and consent",
        paragraphs: [
          "SMS requires opt-in. Reply STOP to unsubscribe or HELP for assistance. Frequency varies; carrier charges may apply and delivery is not guaranteed. Mobile information is not shared for third-party marketing. Messaging consent data is excluded from other sharing categories; support subcontractors may assist service delivery.",
        ],
      },
      {
        title: "Security, cookies and choices",
        paragraphs: [
          "Safeguards cannot eliminate all transmission or storage risk. Cookies may support site operation, preferences and measurement; manage them in your browser. You may request access, correction or deletion, ask about information use, unsubscribe from email, or withdraw communication consent.",
        ],
      },
      {
        title: "Contact",
        paragraphs: [
          "Contact help@arvory.com or +1 360-558-3293, or write to Roots Dental Implants, 16600 SE 15th St, Vancouver, WA 98683.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    kind: "policy",
    eyebrow: "COMMUNICATION PREFERENCES",
    title: "SMS messaging terms",
    description: "Information about Roots mobile messages, support and opting out.",
    sections: [
      {
        title: "Taking part",
        paragraphs: [
          "Roots messages may include appointment reminders, confirmations, treatment follow-ups and office notices. Participation requires your mobile number and consent. You must be at least 18.",
        ],
      },
      {
        title: "Opting out and getting help",
        paragraphs: [
          "Text STOP to +1 360-558-3293 to unsubscribe. A confirmation message follows; rejoining requires a new opt-in. Reply HELP for assistance or email help@arvory.com.",
        ],
      },
      {
        title: "Frequency and charges",
        paragraphs: [
          "Message frequency depends on appointments and interactions. Message and data charges may apply; ask your carrier about your plan. Carriers are not responsible for delayed or undelivered messages.",
        ],
      },
      {
        title: "Mobile privacy",
        paragraphs: [
          "Roots does not sell or share mobile information for marketing or promotional purposes. Read the privacy policy for more about information handling.",
        ],
      },
    ],
  },
];

export const pages: Page[] = [
  ...treatments,
  ...providers,
  ...otherPages,
  ...events.map((event) => ({
    slug: event.slug,
    kind: "event" as const,
    eyebrow: `${event.name.toUpperCase()} · IMPLANT DINNER`,
    title: "An evening of good food & good questions.",
    seoTitle: `${event.name} Implant Dinner`,
    description: `Explore the ${event.name} implant dinner, event details and the RSVP design preview.`,
    image: "/images/clinic.jpg",
    imageAlt: "Inside a Roots Dental clinic",
  })),
];

export function findPage(slug: string) {
  return pages.find((page) => page.slug === slug);
}

export const faqs = [
  {
    question: "What are dental implants?",
    answer:
      "Implants are placed in the jawbone to support replacement teeth such as crowns, bridges or dentures. Your dentist can explain the parts of your proposed restoration.",
  },
  {
    question: "What about pain and comfort?",
    answer:
      "Talk with the team about anesthesia, sedation and your comfort concerns before treatment. Ask for an individual plan for managing discomfort and for aftercare instructions.",
  },
  {
    question: "How long can implants last?",
    answer:
      "Longevity varies with health, healing and ongoing care. Implants and restorations need regular cleaning and dental follow-up; a lifetime outcome cannot be guaranteed.",
  },
  {
    question: "How long does recovery take?",
    answer:
      "Your clinician will explain when to resume activities. Healing around an implant may take months, and your complete treatment timeline depends on your situation.",
  },
  {
    question: "What will treatment cost?",
    answer:
      "Ask for a written quote based on your treatment plan. Discuss what is included, possible additional procedures, insurance questions and payment options.",
  },
  {
    question: "How do I begin?",
    answer:
      "Choose a location and book through NexHealth, or call the team. Bring your health history and questions to the consultation.",
  },
];
