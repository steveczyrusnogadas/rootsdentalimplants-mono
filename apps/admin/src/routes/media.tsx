import { createFileRoute, redirect } from "@tanstack/react-router";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MediaAsset, MediaAssetResponse, MediaAssetsResponse } from "@repo/types/admin/media";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ErrorCode, useDropzone, type FileRejection } from "react-dropzone";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  PlusIcon,
  Trash2Icon,
  UploadCloudIcon,
  VideoIcon,
  XIcon,
} from "lucide-react";
import { AdminPagination } from "@/components/admin-pagination";
import { AdminTableSearch } from "@/components/admin-table-search";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { adminApi, resolveApiUrl } from "@/lib/api";
import { formatFileSize, formatMediaDate, maxMediaImageSizeBytes, uploadMediaAsset } from "@/lib/admin-media";
import { adminAndManagerRoles, hasRoleAccess } from "@/lib/admin-roles";
import { authClient } from "@/lib/auth-client";
import { adminMediaKeys } from "@/lib/query-keys";

const PAGE_SIZE = 12;
const MEDIA_ACCEPT = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
  "video/quicktime": [".mov"],
  "application/pdf": [".pdf"],
};

export const Route = createFileRoute("/media")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    const role = session?.user.role;

    if (!hasRoleAccess(role, adminAndManagerRoles)) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: MediaPage,
});

function MediaPage() {
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [uploadError, setUploadError] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<MediaAsset | null>(null);
  const [tagInput, setTagInput] = useState("");
  const search = useDebouncedValue(searchInput).trim();
  const mediaQuery = useQuery({
    queryKey: adminMediaKeys.list(page, PAGE_SIZE, search, "createdAt", "desc"),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        search,
        sortBy: "createdAt",
        sortDir: "desc",
      });

      return adminApi<MediaAssetsResponse>(`/api/admin/media?${params.toString()}`, {
        errorMessage: "Failed to load media.",
      });
    },
    placeholderData: keepPreviousData,
  });
  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      for (const file of files) {
        await uploadMediaAsset(file);
      }

      return files.length;
    },
    onSuccess: async (count) => {
      setPage(1);
      toast.success(count === 1 ? "Media uploaded." : `Uploaded ${count} media assets.`);
      await queryClient.invalidateQueries({ queryKey: adminMediaKeys.lists() });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async (asset: MediaAsset) => {
      await adminApi<MediaAssetResponse>(`/api/admin/media/${asset.id}`, {
        method: "DELETE",
        errorMessage: "Failed to delete media asset.",
      });

      return asset;
    },
    onSuccess: async () => {
      setSelectedAsset(null);
      setAssetToDelete(null);
      toast.success("Media deleted.");
      await queryClient.invalidateQueries({ queryKey: adminMediaKeys.lists() });
    },
  });
  const updateMutation = useMutation({
    mutationFn: async ({ asset, tags }: { asset: MediaAsset; tags: string[] }) => {
      const data = await adminApi<MediaAssetResponse>(`/api/admin/media/${asset.id}`, {
        method: "PATCH",
        body: JSON.stringify({ tags }),
        errorMessage: "Failed to update media asset.",
      });

      return data.asset;
    },
    onSuccess: async (asset) => {
      setSelectedAsset(asset);
      toast.success("Media updated.");
      await queryClient.invalidateQueries({ queryKey: adminMediaKeys.lists() });
    },
  });
  const assets = useMemo(() => mediaQuery.data?.assets ?? [], [mediaQuery.data?.assets]);
  const pagination = mediaQuery.data?.pagination;
  const loading = mediaQuery.isPending;
  const uploading = uploadMutation.isPending;
  const deleting = deleteMutation.isPending;
  const updating = updateMutation.isPending;
  const error =
    uploadError ||
    (uploadMutation.error instanceof Error ? uploadMutation.error.message : "") ||
    (updateMutation.error instanceof Error ? updateMutation.error.message : "") ||
    (deleteMutation.error instanceof Error ? deleteMutation.error.message : "") ||
    (mediaQuery.error instanceof Error ? mediaQuery.error.message : "");

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (pagination && page > pagination.totalPages) {
      setPage(Math.max(pagination.totalPages, 1));
    }
  }, [page, pagination]);

  useEffect(() => {
    if (!assets.length && selectedAsset) {
      setSelectedAsset(null);
      return;
    }

    if (assets.length && (!selectedAsset || !assets.some((asset) => asset.id === selectedAsset.id))) {
      setSelectedAsset(assets[0]);
    }
  }, [assets, selectedAsset]);

  const handleDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setUploadError(fileRejections.length ? formatDropzoneErrors(fileRejections) : "");

      if (!acceptedFiles.length) {
        return;
      }

      await uploadMutation.mutateAsync(acceptedFiles).catch(() => null);
    },
    [uploadMutation],
  );
  const { getInputProps, getRootProps, isDragActive, isDragReject } = useDropzone({
    accept: MEDIA_ACCEPT,
    disabled: uploading,
    maxSize: maxMediaImageSizeBytes,
    multiple: true,
    onDrop: (acceptedFiles, fileRejections) => {
      void handleDrop(acceptedFiles, fileRejections);
    },
  });

  async function copyUrl(asset: MediaAsset) {
    await navigator.clipboard.writeText(resolveApiUrl(asset.url));
    toast.success("Media URL copied.");
  }

  function addTag() {
    if (!selectedAsset) {
      return;
    }

    const tag = tagInput.trim();

    if (!tag || selectedAsset.tags.includes(tag)) {
      setTagInput("");
      return;
    }

    updateMutation.mutate({ asset: selectedAsset, tags: [...selectedAsset.tags, tag] });
    setTagInput("");
  }

  function removeTag(tag: string) {
    if (!selectedAsset) {
      return;
    }

    updateMutation.mutate({
      asset: selectedAsset,
      tags: selectedAsset.tags.filter((current) => current !== tag),
    });
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Media</h1>
          <p className="mt-1 text-muted-foreground">
            Upload, browse, copy, and reuse images across the admin workspace.
          </p>
        </div>
      </div>

      {error ? (
        <Alert className="mb-4" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader className="gap-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <CardTitle>Assets</CardTitle>
                <CardDescription>
                  {uploading ? "Uploading media..." : "Browse images, videos, and PDFs in the media library."}
                </CardDescription>
              </div>
              <div
                {...getRootProps({
                  className: `grid min-w-72 cursor-pointer gap-2 rounded-md border border-dashed p-4 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isDragReject
                      ? "border-destructive bg-destructive/5 text-destructive"
                      : isDragActive
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-muted/30 text-muted-foreground hover:border-primary/60 hover:bg-muted/50"
                  } ${uploading ? "pointer-events-none opacity-60" : ""}`,
                })}
              >
                <input {...getInputProps({ "aria-label": "Upload media assets" })} />
                <div className="flex items-center gap-3">
                  <UploadCloudIcon className="size-5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">
                      {uploading ? "Uploading media..." : "Drop media here"}
                    </p>
                    <p className="text-xs">Images, MP4/WebM/MOV, or PDF up to 5 MB.</p>
                  </div>
                </div>
              </div>
            </div>
            <AdminTableSearch
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Search files, tags, or metadata..."
            />
          </CardHeader>
          <CardContent>
            {assets.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                {assets.map((asset) => (
                  <MediaAssetTile
                    key={asset.id}
                    asset={asset}
                    selected={selectedAsset?.id === asset.id}
                    onSelect={() => setSelectedAsset(asset)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 border border-dashed p-10 text-center text-muted-foreground">
                {loading ? <UploadCloudIcon className="size-8" /> : <ImageIcon className="size-8" />}
                <p>{loading ? "Loading media..." : "No media assets found."}</p>
              </div>
            )}

            {pagination ? <AdminPagination pagination={pagination} disabled={loading} onPageChange={setPage} /> : null}
          </CardContent>
        </Card>

        <Card className="h-fit xl:sticky xl:top-6">
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>Select an asset to inspect its metadata and actions.</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedAsset ? (
              <div className="space-y-5">
                <MediaPreview asset={selectedAsset} />
                <div>
                  <h2 className="wrap-break-word font-heading text-xl font-semibold">{selectedAsset.fileName}</h2>
                  <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                    {formatMediaDate(selectedAsset.createdAt)}
                  </p>
                </div>

                <Separator />

                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <MetadataItem label="Asset type" value={formatAssetType(selectedAsset)} />
                  <MetadataItem label="File size" value={formatFileSize(selectedAsset.size)} />
                  <MetadataItem label="Dimensions" value={formatDimensions(selectedAsset)} />
                  <MetadataItem label="Duration" value={formatDuration(selectedAsset.durationSeconds)} />
                  <MetadataItem className="col-span-2" label="Content type" value={selectedAsset.contentType} />
                </dl>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedAsset.tags.length ? (
                      selectedAsset.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <button
                            type="button"
                            className="rounded-full hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            disabled={updating}
                            onClick={() => removeTag(tag)}
                            aria-label={`Remove ${tag} tag`}
                          >
                            <XIcon className="size-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No tags yet.</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(event) => setTagInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="Add tag"
                      disabled={updating}
                    />
                    <Button type="button" variant="outline" disabled={updating || !tagInput.trim()} onClick={addTag}>
                      <PlusIcon />
                      Add
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-2">
                  <Button type="button" onClick={() => void copyUrl(selectedAsset)}>
                    <CopyIcon />
                    Copy URL
                  </Button>
                  <Button asChild type="button" variant="outline">
                    <a href={resolveApiUrl(selectedAsset.url)} target="_blank" rel="noreferrer">
                      <ExternalLinkIcon />
                      Open asset
                    </a>
                  </Button>
                  <Button asChild type="button" variant="outline">
                    <a href={resolveApiUrl(selectedAsset.url)} download={selectedAsset.fileName}>
                      <DownloadIcon />
                      Download
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={deleting}
                    onClick={() => setAssetToDelete(selectedAsset)}
                  >
                    <Trash2Icon />
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-lg border border-dashed text-center text-muted-foreground">
                <FileIcon className="size-8" />
                <p>Select an asset to view details.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={Boolean(assetToDelete)} onOpenChange={(open) => !open && setAssetToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete media asset?</AlertDialogTitle>
            <AlertDialogDescription>
              This deletes "{assetToDelete?.fileName}" from the library and object storage. Existing blog posts using
              this URL may show a broken image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault();
                if (assetToDelete) {
                  deleteMutation.mutate(assetToDelete);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function MediaAssetTile({ asset, selected, onSelect }: { asset: MediaAsset; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      className="group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={onSelect}
    >
      <div
        className={`relative aspect-[1.35/1] overflow-hidden border bg-muted transition group-hover:border-primary/50 ${
          selected ? "border-2 border-foreground" : "border-border"
        }`}
      >
        <MediaThumbnail asset={asset} />
        <Badge
          className="absolute top-2 right-2 rounded-sm bg-background/90 px-1.5 py-0 text-[0.65rem] tracking-widest text-foreground uppercase shadow-sm"
          variant="outline"
        >
          {formatFileExtension(asset.fileName, asset.assetType)}
        </Badge>
        {asset.assetType === "video" && asset.durationSeconds ? (
          <span className="absolute bottom-2 left-2 bg-background/90 px-1.5 py-0.5 text-[0.65rem] font-medium text-foreground">
            {formatDuration(asset.durationSeconds)}
          </span>
        ) : null}
        {selected ? (
          <span className="absolute top-2 left-2 flex size-5 items-center justify-center bg-background text-foreground shadow-sm">
            <CheckIcon className="size-3" />
          </span>
        ) : null}
      </div>
      <div className="mt-2 space-y-0.5">
        <p className="truncate text-sm font-semibold group-hover:text-primary">{asset.fileName}</p>
        <p className="text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase">
          {formatTileDate(asset.createdAt)} · {formatFileSize(asset.size)}
        </p>
      </div>
    </button>
  );
}

function MediaThumbnail({ asset }: { asset: MediaAsset }) {
  if (asset.assetType === "image") {
    return <img src={resolveApiUrl(asset.url)} alt={asset.altText ?? ""} className="h-full w-full object-cover" />;
  }

  if (asset.assetType === "video") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
        <VideoIcon className="size-9" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
      <FileTextIcon className="size-9" />
    </div>
  );
}

function MediaPreview({ asset }: { asset: MediaAsset }) {
  if (asset.assetType === "image") {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg border bg-muted/40 p-3">
        <img
          src={resolveApiUrl(asset.url)}
          alt={asset.altText ?? ""}
          className="max-h-full max-w-full rounded-md object-contain"
        />
      </div>
    );
  }

  if (asset.assetType === "video") {
    return (
      <div className="overflow-hidden rounded-lg border bg-muted/40">
        <video src={resolveApiUrl(asset.url)} controls className="aspect-video w-full bg-black" />
      </div>
    );
  }

  return (
    <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-lg border bg-muted/40 text-muted-foreground">
      <FileTextIcon className="size-10" />
      <p className="text-sm">PDF document</p>
    </div>
  );
}

function MetadataItem({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 wrap-break-word font-medium">{value}</dd>
    </div>
  );
}

function formatAssetType(asset: MediaAsset) {
  if (asset.assetType === "pdf") {
    return "PDF";
  }

  return `${asset.assetType[0]?.toUpperCase()}${asset.assetType.slice(1)}`;
}

function formatDimensions(asset: MediaAsset) {
  if (!asset.width || !asset.height) {
    return "Not available";
  }

  return `${asset.width} x ${asset.height}`;
}

function formatTileDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
  }).format(new Date(value));
}

function formatDuration(durationSeconds: number | null) {
  if (!durationSeconds) {
    return "Not available";
  }

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatFileExtension(fileName: string, assetType: MediaAsset["assetType"]) {
  const extension = fileName.split(".").pop()?.toUpperCase();

  return extension || assetType.toUpperCase();
}

function formatDropzoneErrors(fileRejections: FileRejection[]) {
  return fileRejections
    .flatMap(({ file, errors }) =>
      errors.map((error) => {
        if (error.code === ErrorCode.FileInvalidType) {
          return `${file.name}: Media must be a JPEG, PNG, WebP, GIF, MP4, WebM, MOV, or PDF file.`;
        }

        if (error.code === ErrorCode.FileTooLarge) {
          return `${file.name}: Media asset must be smaller than 5 MB.`;
        }

        return `${file.name}: ${error.message}`;
      }),
    )
    .join(" ");
}
