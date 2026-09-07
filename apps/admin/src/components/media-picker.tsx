import type { MediaAsset, MediaAssetsResponse } from "@repo/types/admin/media";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ChangeEvent } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { CopyIcon, ImageIcon, UploadCloudIcon } from "lucide-react";
import { AdminPagination } from "@/components/admin-pagination";
import { AdminTableSearch } from "@/components/admin-table-search";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { adminApi, resolveApiUrl } from "@/lib/api";
import { allowedMediaTypes, formatFileSize, maxMediaImageSizeBytes, uploadMediaAsset } from "@/lib/admin-media";
import { adminMediaKeys } from "@/lib/query-keys";

type MediaPickerProps = {
  open: boolean;
  title?: string;
  description?: string;
  selectLabel?: string;
  onOpenChange: (open: boolean) => void;
  onSelect: (asset: MediaAsset) => void;
};

const PAGE_SIZE = 9;

export function MediaPicker({
  open,
  title = "Choose media",
  description = "Select an uploaded image, upload a new one, or copy a public URL.",
  selectLabel = "Select",
  onOpenChange,
  onSelect,
}: MediaPickerProps) {
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [uploadError, setUploadError] = useState("");
  const search = useDebouncedValue(searchInput).trim();
  const mediaQuery = useQuery({
    queryKey: adminMediaKeys.list(page, PAGE_SIZE, search, "createdAt", "desc", "image"),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        search,
        sortBy: "createdAt",
        sortDir: "desc",
        assetType: "image",
      });

      return adminApi<MediaAssetsResponse>(`/api/admin/media?${params.toString()}`, {
        errorMessage: "Failed to load media.",
      });
    },
    enabled: open,
    placeholderData: keepPreviousData,
  });
  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadMediaAsset(file),
    onSuccess: async (asset) => {
      setPage(1);
      toast.success("Media uploaded.");
      await queryClient.invalidateQueries({ queryKey: adminMediaKeys.lists() });
      onSelect(asset);
      onOpenChange(false);
    },
  });
  const assets = mediaQuery.data?.assets ?? [];
  const pagination = mediaQuery.data?.pagination;
  const loading = mediaQuery.isPending;
  const uploading = uploadMutation.isPending;
  const error =
    uploadError ||
    (uploadMutation.error instanceof Error ? uploadMutation.error.message : "") ||
    (mediaQuery.error instanceof Error ? mediaQuery.error.message : "");

  useEffect(() => {
    setPage(1);
  }, [search]);

  async function uploadFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setUploadError("");

    if (!allowedMediaTypes.has(file.type)) {
      setUploadError("Media must be a JPEG, PNG, WebP, or GIF image.");
      return;
    }

    if (file.size > maxMediaImageSizeBytes) {
      setUploadError("Media image must be smaller than 5 MB.");
      return;
    }

    await uploadMutation.mutateAsync(file).catch(() => null);
  }

  async function copyUrl(asset: MediaAsset) {
    await navigator.clipboard.writeText(resolveApiUrl(asset.url));
    toast.success("Media URL copied.");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <AdminTableSearch value={searchInput} onChange={setSearchInput} placeholder="Search media..." />
          <div className="grid gap-2">
            <Label htmlFor="media-picker-upload">Upload image</Label>
            <Input
              id="media-picker-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={uploading}
              onChange={(event) => void uploadFile(event)}
            />
          </div>
        </div>

        {assets.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset) => (
              <div key={asset.id} className="overflow-hidden rounded-lg border bg-card">
                <div className="aspect-video bg-muted">
                  <img
                    src={resolveApiUrl(asset.url)}
                    alt={asset.altText ?? ""}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-3 p-3">
                  <div>
                    <p className="truncate text-sm font-medium">{asset.fileName}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(asset.size)}</p>
                  </div>
                  <div className="flex justify-between gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => void copyUrl(asset)}>
                      <CopyIcon />
                      Copy URL
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        onSelect(asset);
                        onOpenChange(false);
                      }}
                    >
                      {selectLabel}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 border border-dashed p-10 text-center text-muted-foreground">
            {loading ? <UploadCloudIcon className="size-8" /> : <ImageIcon className="size-8" />}
            <p>{loading ? "Loading media..." : "No media assets found."}</p>
          </div>
        )}

        {pagination ? <AdminPagination pagination={pagination} disabled={loading} onPageChange={setPage} /> : null}
      </DialogContent>
    </Dialog>
  );
}
