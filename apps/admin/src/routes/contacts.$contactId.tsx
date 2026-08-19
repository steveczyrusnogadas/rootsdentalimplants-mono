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
import { formatContactDate, formatContactSource, type ContactResponse } from "@/lib/admin-contacts";
import { adminAndManagerRoles, hasRoleAccess } from "@/lib/admin-roles";
import { authClient } from "@/lib/auth-client";
import { adminContactKeys } from "@/lib/query-keys";

export const Route = createFileRoute("/contacts/$contactId")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    const role = session?.user.role;

    if (!hasRoleAccess(role, adminAndManagerRoles)) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: ContactDetailPage,
});

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</div>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}

function ContactDetailPage() {
  const { contactId } = Route.useParams();
  const contactQuery = useQuery({
    queryKey: adminContactKeys.detail(contactId),
    queryFn: async () => {
      const data = await adminApi<ContactResponse>(`/api/admin/contacts/${contactId}`, {
        errorMessage: "Failed to load contact.",
      });

      return data.contact;
    },
  });
  const contact = contactQuery.data;
  const error = contactQuery.error instanceof Error ? contactQuery.error.message : "";

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/contacts">
              <ArrowLeftIcon />
              Back to contacts
            </Link>
          </Button>
          <h1 className="font-heading mt-6 text-3xl font-bold tracking-tight">
            {contact?.name ?? (contactQuery.isPending ? "Loading contact..." : "Contact details")}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {contact ? `Created ${formatContactDate(contact.createdAt)}` : "Review the contact record."}
          </p>
        </div>
      </div>

      {error ? <div className="mb-4 border border-destructive/40 p-3 text-sm text-destructive">{error}</div> : null}

      {contact ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
              <CardDescription>Identity and reachability</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <DetailItem label="Name" value={contact.name} />
              <DetailItem label="Email" value={<a href={`mailto:${contact.email}`}>{contact.email}</a>} />
              <DetailItem
                label="Phone"
                value={contact.phone ? <a href={`tel:${contact.phone}`}>{contact.phone}</a> : "Not provided"}
              />
              <DetailItem label="Type" value={<Badge variant="secondary">{contact.kind}</Badge>} />
              <DetailItem label="Source" value={formatContactSource(contact.source)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Source</CardTitle>
              <CardDescription>Where this contact came from</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <DetailItem label="Created" value={formatContactDate(contact.createdAt)} />
              <DetailItem label="Updated" value={formatContactDate(contact.updatedAt)} />
              <DetailItem label="Tags" value={contact.tags.length > 0 ? contact.tags.join(", ") : "No tags"} />
              {contact.sourceLead ? (
                <DetailItem
                  label="Lead"
                  value={
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/leads/$leadId" params={{ leadId: contact.sourceLead.id }}>
                        <ExternalLinkIcon />
                        View lead
                      </Link>
                    </Button>
                  }
                />
              ) : null}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Context carried over during conversion</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {contact.notes || "No notes yet."}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
