import type { AdminLocation, AdminLocationResponse, CreateAdminLocationPayload } from "@repo/types/admin/location";
import { weekdays, type Weekday, type WeeklyHours } from "@repo/types/location";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@repo/ui/components/alert";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Switch } from "@repo/ui/components/switch";
import { toast } from "@repo/ui/components/sonner";
import { closedWeeklyHours, slugifyLocationName, weekdayLabels } from "@/lib/admin-locations";
import { adminApi } from "@/lib/api";
import { adminLocationKeys } from "@/lib/query-keys";

type LocationFormProps = {
  location?: AdminLocation | null;
};

type FormState = {
  slug: string;
  displayName: string;
  street: string;
  suite: string;
  city: string;
  region: string;
  postalCode: string;
  phone: string;
  weeklyHours: WeeklyHours;
  lat: string;
  lng: string;
  sortOrder: string;
  published: boolean;
  isDefaultCall: boolean;
};

const emptyForm: FormState = {
  slug: "",
  displayName: "",
  street: "",
  suite: "",
  city: "",
  region: "OR",
  postalCode: "",
  phone: "",
  weeklyHours: closedWeeklyHours(),
  lat: "",
  lng: "",
  sortOrder: "0",
  published: true,
  isDefaultCall: false,
};

function getInitialForm(location?: AdminLocation | null): FormState {
  if (!location) {
    return emptyForm;
  }

  return {
    slug: location.slug,
    displayName: location.displayName,
    street: location.street,
    suite: location.suite ?? "",
    city: location.city,
    region: location.region,
    postalCode: location.postalCode,
    phone: location.phone,
    weeklyHours: location.weeklyHours,
    lat: String(location.lat),
    lng: String(location.lng),
    sortOrder: String(location.sortOrder),
    published: location.published,
    isDefaultCall: location.isDefaultCall,
  };
}

function toWallClock(value: string) {
  return value.slice(0, 5);
}

export function LocationForm({ location }: LocationFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(() => getInitialForm(location));
  const [slugTouched, setSlugTouched] = useState(Boolean(location));

  useEffect(() => {
    setForm(getInitialForm(location));
    setSlugTouched(Boolean(location));
  }, [location]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload: CreateAdminLocationPayload = {
        slug: form.slug,
        displayName: form.displayName,
        street: form.street,
        suite: form.suite || null,
        city: form.city,
        region: form.region,
        postalCode: form.postalCode,
        phone: form.phone,
        weeklyHours: form.weeklyHours,
        lat: Number(form.lat),
        lng: Number(form.lng),
        sortOrder: Number.parseInt(form.sortOrder, 10),
        published: form.published,
        isDefaultCall: form.isDefaultCall,
      };
      const data = await adminApi<AdminLocationResponse>(
        location ? `/api/admin/locations/${location.id}` : "/api/admin/locations",
        {
          method: location ? "PATCH" : "POST",
          body: JSON.stringify(location ? { ...payload, slug: undefined } : payload),
          errorMessage: "Failed to save location.",
        },
      );

      return data.location;
    },
    onSuccess: async (savedLocation) => {
      await queryClient.invalidateQueries({ queryKey: adminLocationKeys.lists() });
      queryClient.setQueryData(adminLocationKeys.detail(savedLocation.id), savedLocation);
      toast.success(savedLocation.published ? "Location saved." : "Location unpublished.");

      if (!location) {
        await navigate({ to: "/locations/$locationId", params: { locationId: savedLocation.id } });
      }
    },
  });

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateDisplayName(value: string) {
    setForm((current) => ({
      ...current,
      displayName: value,
      slug: location || slugTouched ? current.slug : slugifyLocationName(value),
    }));
  }

  function updateDayHours(weekday: Weekday, closed: boolean) {
    setForm((current) => ({
      ...current,
      weeklyHours: {
        ...current.weeklyHours,
        [weekday]: closed ? { kind: "closed" } : { kind: "open", open: "08:00", close: "17:00" },
      },
    }));
  }

  function updateDayClock(weekday: Weekday, field: "open" | "close", value: string) {
    setForm((current) => {
      const day = current.weeklyHours[weekday];

      if (day.kind !== "open") {
        return current;
      }

      return {
        ...current,
        weeklyHours: {
          ...current.weeklyHours,
          [weekday]: { ...day, [field]: toWallClock(value) },
        },
      };
    });
  }

  const saving = saveMutation.isPending;
  const error = saveMutation.error instanceof Error ? saveMutation.error.message : "";
  const canSave = Boolean(
    form.displayName.trim() &&
      form.slug.trim() &&
      form.street.trim() &&
      form.city.trim() &&
      form.region.trim() &&
      form.postalCode.trim() &&
      form.phone.trim() &&
      form.lat.trim() &&
      form.lng.trim(),
  );

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <h1 className="font-heading text-3xl font-bold tracking-tight">
              {location ? `Edit ${location.displayName}` : "New location"}
            </h1>
            <Badge variant={form.published ? "default" : "secondary"}>{form.published ? "Published" : "Unpublished"}</Badge>
          </div>
          <p className="text-muted-foreground">
            Address, phone, and hours shown on the public Call picker and footer.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="/locations">Back to locations</Link>
          </Button>
          <Button type="button" disabled={!canSave || saving} onClick={() => saveMutation.mutate()}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {error ? (
        <Alert className="mb-4" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <CardDescription>Structured address and the phone used for Call links.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="displayName">Display name</Label>
                <Input
                  id="displayName"
                  value={form.displayName}
                  disabled={saving}
                  onChange={(event) => updateDisplayName(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  disabled={saving || Boolean(location)}
                  onChange={(event) => {
                    setSlugTouched(true);
                    updateField("slug", slugifyLocationName(event.target.value));
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  {location ? "Slug is set at create and cannot be changed." : "Set once at create. It cannot be changed later."}
                </p>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="street">Street</Label>
              <Input id="street" value={form.street} disabled={saving} onChange={(event) => updateField("street", event.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="suite">Suite</Label>
                <Input id="suite" value={form.suite} disabled={saving} onChange={(event) => updateField("suite", event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={form.city} disabled={saving} onChange={(event) => updateField("city", event.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="region">Region</Label>
                <Input id="region" value={form.region} disabled={saving} onChange={(event) => updateField("region", event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="postalCode">Postal code</Label>
                <Input
                  id="postalCode"
                  value={form.postalCode}
                  disabled={saving}
                  onChange={(event) => updateField("postalCode", event.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} disabled={saving} onChange={(event) => updateField("phone", event.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Public use</CardTitle>
              <CardDescription>Unpublished locations are omitted from Call, footer, and every other public use.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="published">Published</Label>
                <Switch id="published" checked={form.published} disabled={saving} onCheckedChange={(checked) => updateField("published", checked)} />
              </div>
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="isDefaultCall">Default Call (footer)</Label>
                <Switch
                  id="isDefaultCall"
                  checked={form.isDefaultCall}
                  disabled={saving || (Boolean(location?.isDefaultCall) && form.isDefaultCall)}
                  onCheckedChange={(checked) => updateField("isDefaultCall", checked)}
                />
              </div>
              <p className="text-xs text-muted-foreground">Exactly one location is the footer default Call. Portland is the seed default.</p>
              <div className="grid gap-2">
                <Label htmlFor="sortOrder">Sort order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={form.sortOrder}
                  disabled={saving}
                  onChange={(event) => updateField("sortOrder", event.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="lat">Latitude</Label>
                  <Input id="lat" value={form.lat} disabled={saving} onChange={(event) => updateField("lat", event.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lng">Longitude</Label>
                  <Input id="lng" value={form.lng} disabled={saving} onChange={(event) => updateField("lng", event.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Weekly hours</CardTitle>
          <CardDescription>Monday through Sunday, each day closed or open/close wall-clock. No holiday calendar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {weekdays.map((weekday) => {
            const day = form.weeklyHours[weekday];
            const isOpen = day.kind === "open";

            return (
              <div key={weekday} className="grid items-center gap-3 sm:grid-cols-[8rem_8rem_1fr_1fr]">
                <div className="text-sm font-medium">{weekdayLabels[weekday]}</div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!isOpen}
                    disabled={saving}
                    onChange={(event) => updateDayHours(weekday, event.target.checked)}
                  />
                  Closed
                </label>
                {isOpen ? (
                  <>
                    <Input
                      type="time"
                      value={day.open}
                      disabled={saving}
                      onChange={(event) => updateDayClock(weekday, "open", event.target.value)}
                    />
                    <Input
                      type="time"
                      value={day.close}
                      disabled={saving}
                      onChange={(event) => updateDayClock(weekday, "close", event.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <div className="text-sm text-muted-foreground">Closed</div>
                    <div />
                  </>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
