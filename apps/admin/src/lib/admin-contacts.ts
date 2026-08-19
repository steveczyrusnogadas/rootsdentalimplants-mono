export type ContactSourceLead = {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
};

export type AdminContact = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  kind: string;
  source: string;
  sourceLeadId: string | null;
  sourceLead: ContactSourceLead | null;
  notes: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type ContactsResponse = {
  contacts: AdminContact[];
  pagination: import("@repo/types/admin/users").PaginationMeta;
};

export type ContactResponse = {
  contact: AdminContact;
};

export function formatContactDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatContactSource(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
