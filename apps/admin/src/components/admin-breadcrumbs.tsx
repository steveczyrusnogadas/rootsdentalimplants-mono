import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { adminApi } from "@/lib/api";
import type { AdminBlogPostResponse } from "@repo/types/admin/blog";
import type { LeadResponse } from "@/lib/admin-leads";
import { adminBlogKeys, adminLeadKeys } from "@/lib/query-keys";

type AdminBreadcrumbLink = "/dashboard" | "/users" | "/leads" | "/blog" | "/media" | "/activity" | "/settings";

type AdminBreadcrumbItem = {
  label: string;
  to?: AdminBreadcrumbLink;
};

const breadcrumbsByPath: Record<string, AdminBreadcrumbItem[]> = {
  "/dashboard": [{ label: "Dashboard" }],
  "/users": [{ label: "Dashboard", to: "/dashboard" }, { label: "Users" }],
  "/leads": [{ label: "Dashboard", to: "/dashboard" }, { label: "Leads" }],
  "/blog": [{ label: "Dashboard", to: "/dashboard" }, { label: "Blog" }],
  "/blog/new": [{ label: "Dashboard", to: "/dashboard" }, { label: "Blog", to: "/blog" }, { label: "New post" }],
  "/media": [{ label: "Dashboard", to: "/dashboard" }, { label: "Media" }],
  "/activity": [{ label: "Dashboard", to: "/dashboard" }, { label: "Activity" }],
  "/settings": [{ label: "Settings" }],
};

function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function getLeadDetailId(pathname: string) {
  const match = pathname.match(/^\/leads\/([^/]+)$/);

  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function getBlogPostId(pathname: string) {
  const match = pathname.match(/^\/blog\/([^/]+)$/);

  if (!match?.[1] || match[1] === "new") {
    return null;
  }

  return decodeURIComponent(match[1]);
}

function BreadcrumbTrail({ breadcrumbs }: { breadcrumbs: AdminBreadcrumbItem[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => {
          const isCurrentPage = index === breadcrumbs.length - 1;

          return (
            <BreadcrumbItem key={`${item.label}-${index}`}>
              {item.to && !isCurrentPage ? (
                <BreadcrumbLink asChild>
                  <Link to={item.to}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
              {!isCurrentPage && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function LeadDetailBreadcrumbs({ leadId }: { leadId: string }) {
  const leadQuery = useQuery({
    queryKey: adminLeadKeys.detail(leadId),
    queryFn: async () => {
      const data = await adminApi<LeadResponse>(`/api/admin/leads/${leadId}`);

      return data.lead;
    },
  });

  return (
    <BreadcrumbTrail
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Leads", to: "/leads" },
        { label: leadQuery.data?.name ?? "Lead details" },
      ]}
    />
  );
}

function BlogPostBreadcrumbs({ blogPostId }: { blogPostId: string }) {
  const blogPostQuery = useQuery({
    queryKey: adminBlogKeys.detail(blogPostId),
    queryFn: async () => {
      const data = await adminApi<AdminBlogPostResponse>(`/api/admin/blog/${blogPostId}`);

      return data.post;
    },
  });

  return (
    <BreadcrumbTrail
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Blog", to: "/blog" },
        { label: blogPostQuery.data?.title ?? "Blog post" },
      ]}
    />
  );
}

export function AdminBreadcrumbs() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const normalizedPathname = normalizePathname(pathname);
  const leadId = getLeadDetailId(normalizedPathname);
  const blogPostId = getBlogPostId(normalizedPathname);

  if (leadId) {
    return <LeadDetailBreadcrumbs leadId={leadId} />;
  }

  if (blogPostId) {
    return <BlogPostBreadcrumbs blogPostId={blogPostId} />;
  }

  const breadcrumbs = breadcrumbsByPath[normalizedPathname];

  if (!breadcrumbs) {
    return null;
  }

  return <BreadcrumbTrail breadcrumbs={breadcrumbs} />;
}
