import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@repo/ui/components/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { Badge } from "@repo/ui/components/badge";
import {
  getLeadPriorityVariant,
  getLeadStatusVariant,
  priorityLabels,
  statusLabels,
  type AdminLead,
  type LeadPriority,
  type LeadStatus,
} from "@/lib/admin-leads";
import { adminApi } from "@/lib/api";
import { dashboardKeys } from "@/lib/query-keys";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

type LeadStats = {
  total: number;
  archived: number;
  byStatus: Record<LeadStatus, number>;
  byPriority: Record<LeadPriority, number>;
  recent: AdminLead[];
};

type LeadStatsResponse = {
  stats: LeadStats;
};

const emptyStats: LeadStats = {
  total: 0,
  archived: 0,
  byStatus: {
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    unqualified: 0,
  },
  byPriority: {
    low: 0,
    normal: 0,
    high: 0,
    urgent: 0,
  },
  recent: [],
};

const statusOrder: LeadStatus[] = ["new", "contacted", "qualified", "converted", "unqualified"];
const priorityOrder: LeadPriority[] = ["low", "normal", "high", "urgent"];

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

const pipelineChartConfig = {
  count: {
    label: "Leads",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const inventoryChartConfig = {
  count: {
    label: "Leads",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const priorityChartConfig = {
  low: {
    label: priorityLabels.low,
    color: chartColors[0],
  },
  normal: {
    label: priorityLabels.normal,
    color: chartColors[1],
  },
  high: {
    label: priorityLabels.high,
    color: chartColors[2],
  },
  urgent: {
    label: priorityLabels.urgent,
    color: chartColors[3],
  },
} satisfies ChartConfig;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function DashboardPage() {
  const leadStatsQuery = useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const data = await adminApi<LeadStatsResponse>("/api/admin/leads/stats", {
        errorMessage: "Failed to load lead stats.",
      });

      return data.stats;
    },
  });
  const leadStats = leadStatsQuery.data ?? emptyStats;
  const statsLoading = leadStatsQuery.isPending;
  const statsError = leadStatsQuery.error instanceof Error ? leadStatsQuery.error.message : "";
  const pipelineData = useMemo(
    () =>
      statusOrder.map((status) => ({
        status,
        label: statusLabels[status],
        count: leadStats.byStatus[status],
      })),
    [leadStats.byStatus],
  );
  const priorityData = useMemo(
    () =>
      priorityOrder.map((priority, index) => ({
        priority,
        label: priorityLabels[priority],
        count: leadStats.byPriority[priority],
        fill: chartColors[index],
      })),
    [leadStats.byPriority],
  );
  const inventoryData = useMemo(
    () => [
      {
        label: "Active",
        count: leadStats.total,
        fill: "var(--chart-1)",
      },
      {
        label: "Archived",
        count: leadStats.archived,
        fill: "var(--chart-3)",
      },
    ],
    [leadStats.archived, leadStats.total],
  );
  const priorityTotal = priorityData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="p-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Lead activity and pipeline overview</p>
        </div>
      </div>

      {statsError ? (
        <div className="mb-4 border border-destructive/40 p-3 text-sm text-destructive">{statsError}</div>
      ) : null}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Leads</CardDescription>
            <CardTitle className="text-3xl">{statsLoading ? "..." : leadStats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{leadStats.archived} archived leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>New Leads</CardDescription>
            <CardTitle className="text-3xl">{statsLoading ? "..." : leadStats.byStatus.new}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-emerald-600">Ready for first contact</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Qualified</CardDescription>
            <CardTitle className="text-3xl">{statsLoading ? "..." : leadStats.byStatus.qualified}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {leadStats.byPriority.high + leadStats.byPriority.urgent} high priority
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Converted</CardDescription>
            <CardTitle className="text-3xl">{statsLoading ? "..." : leadStats.byStatus.converted}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{leadStats.byStatus.contacted} contacted leads</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Lead Pipeline</CardTitle>
            <CardDescription>Active leads grouped by current status</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pipelineChartConfig} className="h-72 w-full">
              <BarChart data={pipelineData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority Mix</CardTitle>
            <CardDescription>How active leads are prioritized</CardDescription>
          </CardHeader>
          <CardContent>
            {priorityTotal > 0 ? (
              <ChartContainer config={priorityChartConfig} className="mx-auto h-72 w-full max-w-sm">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="priority" hideLabel />} />
                  <Pie data={priorityData} dataKey="count" nameKey="priority" innerRadius={58} outerRadius={92}>
                    {priorityData.map((item) => (
                      <Cell key={item.priority} fill={item.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
                No priority data yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Lead Inventory</CardTitle>
            <CardDescription>Active leads compared with archived leads</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={inventoryChartConfig} className="h-56 w-full">
              <BarChart data={inventoryData} layout="vertical" margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" allowDecimals={false} hide />
                <YAxis dataKey="label" type="category" tickLine={false} axisLine={false} width={72} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {inventoryData.map((item) => (
                    <Cell key={item.label} fill={item.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
          <CardDescription>Latest contact submissions from the public site</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leadStats.recent.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-sm text-muted-foreground">{lead.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getLeadStatusVariant(lead.status)}>{statusLabels[lead.status]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getLeadPriorityVariant(lead.priority)}>{priorityLabels[lead.priority]}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatDate(lead.createdAt)}</TableCell>
                </TableRow>
              ))}
              {!statsLoading && leadStats.recent.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                    No leads yet.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
