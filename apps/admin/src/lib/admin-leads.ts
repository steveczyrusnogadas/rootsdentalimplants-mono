export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "unqualified";
export type LeadPriority = "low" | "normal" | "high" | "urgent";
export type LeadsView = "active" | "archived" | "all";

export type AdminLead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: LeadStatus;
  priority: LeadPriority;
  source: string;
  internalNotes: string | null;
  archivedAt: string | null;
  convertedAt: string | null;
  convertedContact?: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export type LeadResponse = {
  lead: AdminLead;
};

export const statusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  converted: "Converted",
  unqualified: "Unqualified",
};

export const priorityLabels: Record<LeadPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

export const viewLabels: Record<LeadsView, string> = {
  active: "Active leads",
  archived: "Archived leads",
  all: "All leads",
};

export function formatLeadDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatLeadSource(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getLeadStatusVariant(status: LeadStatus) {
  if (status === "converted") {
    return "default";
  }

  if (status === "new" || status === "qualified") {
    return "secondary";
  }

  return "outline";
}

export function getLeadPriorityVariant(priority: LeadPriority) {
  return priority === "urgent" || priority === "high" ? "destructive" : "outline";
}
