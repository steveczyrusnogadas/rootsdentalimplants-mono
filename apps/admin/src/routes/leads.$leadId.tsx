import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { ArrowLeftIcon, ExternalLinkIcon } from "lucide-react";
import { adminApi } from "@/lib/api";
import {
  formatLeadDate,
  formatLeadSource,
  getLeadPriorityVariant,
  getLeadStatusVariant,
  priorityLabels,
  statusLabels,
  type LeadResponse,
} from "@/lib/admin-leads";
import { adminAndManagerRoles, hasRoleAccess } from "@/lib/admin-roles";
import { authClient } from "@/lib/auth-client";
import { adminLeadKeys } from "@/lib/query-keys";

export const Route = createFileRoute("/leads/$leadId")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    const role = session?.user.role;

    if (!hasRoleAccess(role, adminAndManagerRoles)) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LeadDetailPage,
});

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</div>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}

function LeadDetailPage() {
  const { leadId } = Route.useParams();
  const leadQuery = useQuery({
    queryKey: adminLeadKeys.detail(leadId),
    queryFn: async () => {
      const data = await adminApi<LeadResponse>(`/api/admin/leads/${leadId}`, {
        errorMessage: "Failed to load lead.",
      });

      return data.lead;
    },
  });
  const lead = leadQuery.data;
  const error = leadQuery.error instanceof Error ? leadQuery.error.message : "";

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/leads">
              <ArrowLeftIcon />
              Back to leads
            </Link>
          </Button>
          <h1 className="font-heading mt-6 text-3xl font-bold tracking-tight">
            {lead?.name ?? (leadQuery.isPending ? "Loading lead..." : "Lead details")}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {lead ? `Submitted ${formatLeadDate(lead.createdAt)}` : "Review the full lead submission."}
          </p>
        </div>
      </div>

      {error ? <div className="mb-4 border border-destructive/40 p-3 text-sm text-destructive">{error}</div> : null}

      {lead ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
          <Card>
            <CardHeader>
              <CardTitle>Message</CardTitle>
              <CardDescription>Full contact submission</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{lead.message}</p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lead</CardTitle>
                <CardDescription>Contact and source details</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <DetailItem label="Name" value={lead.name} />
                <DetailItem label="Email" value={<a href={`mailto:${lead.email}`}>{lead.email}</a>} />
                <DetailItem label="Phone" value={lead.phone ? <a href={`tel:${lead.phone}`}>{lead.phone}</a> : "Not provided"} />
                <DetailItem label="Source" value={formatLeadSource(lead.source)} />
                <DetailItem label="Submitted" value={formatLeadDate(lead.createdAt)} />
                <DetailItem label="Updated" value={formatLeadDate(lead.updatedAt)} />
                <DetailItem label="Converted" value={lead.convertedAt ? formatLeadDate(lead.convertedAt) : "No"} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
                <CardDescription>Current lead state</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <DetailItem
                  label="Status"
                  value={<Badge variant={getLeadStatusVariant(lead.status)}>{statusLabels[lead.status]}</Badge>}
                />
                <DetailItem
                  label="Priority"
                  value={<Badge variant={getLeadPriorityVariant(lead.priority)}>{priorityLabels[lead.priority]}</Badge>}
                />
                <DetailItem label="Archived" value={lead.archivedAt ? formatLeadDate(lead.archivedAt) : "No"} />
                {lead.convertedContact ? (
                  <DetailItem
                    label="Contact"
                    value={
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/contacts/$contactId" params={{ contactId: lead.convertedContact.id }}>
                          <ExternalLinkIcon />
                          View contact
                        </Link>
                      </Button>
                    }
                  />
                ) : null}
              </CardContent>
            </Card>
          </div>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Internal Notes</CardTitle>
              <CardDescription>Notes captured by the admin team</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {lead.internalNotes || "No internal notes yet."}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
