import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const imageContentTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const videoContentTypes = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const documentContentTypes = new Set(["application/pdf"]);

export const maxAvatarSizeBytes = 2 * 1024 * 1024;
export const maxBlogCoverSizeBytes = 5 * 1024 * 1024;
export const maxMediaImageSizeBytes = 5 * 1024 * 1024;
type S3StorageConfig = {
  bucket: string;
  region: string;
  endpoint?: string;
  publicEndpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  forcePathStyle: boolean;
};

let cachedConfig: S3StorageConfig | undefined;
let cachedClient: S3Client | undefined;
let cachedPublicClient: S3Client | undefined;

function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required for object storage.`);
  }

  return value;
}

function parseBooleanEnv(value: string | undefined) {
  return value === "true" || value === "1";
}

export function isAllowedAvatarContentType(contentType: string) {
  return imageContentTypes.has(contentType);
}

export function isAllowedImageContentType(contentType: string) {
  return imageContentTypes.has(contentType);
}

export function isAllowedMediaContentType(contentType: string) {
  return (
    imageContentTypes.has(contentType) || videoContentTypes.has(contentType) || documentContentTypes.has(contentType)
  );
}

export function getAvatarObjectKey(userId: string) {
  return `avatars/users/${userId}/avatar`;
}

export function getAvatarImageUrl(userId: string, version = Date.now()) {
  return `/api/admin/users/${encodeURIComponent(userId)}/avatar?v=${version}`;
}

export function getBlogCoverObjectKey(imageId: string) {
  return `blog/covers/${imageId}`;
}

export function getBlogCoverImageUrl(imageId: string) {
  return `/api/blog/covers/${encodeURIComponent(imageId)}`;
}

export function getMediaObjectKey(assetId: string) {
  return `media/assets/${assetId}`;
}

export function getMediaImageUrl(assetId: string) {
  return `/api/media/${encodeURIComponent(assetId)}`;
}

function getStorageConfig() {
  if (!cachedConfig) {
    cachedConfig = {
      bucket: requiredEnv("S3_BUCKET"),
      region: process.env.S3_REGION || "us-east-1",
      endpoint: process.env.S3_ENDPOINT || undefined,
      publicEndpoint: process.env.S3_PUBLIC_ENDPOINT || process.env.S3_ENDPOINT || undefined,
      accessKeyId: process.env.S3_ACCESS_KEY_ID || undefined,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || undefined,
      forcePathStyle: parseBooleanEnv(process.env.S3_FORCE_PATH_STYLE),
    };
  }

  return cachedConfig;
}

function createS3Client(endpoint: string | undefined) {
  const config = getStorageConfig();

  return new S3Client({
    region: config.region,
    endpoint,
    forcePathStyle: config.forcePathStyle,
    credentials:
      config.accessKeyId && config.secretAccessKey
        ? {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
          }
        : undefined,
  });
}

function getS3Client(options: { publicEndpoint?: boolean } = {}) {
  const config = getStorageConfig();

  if (options.publicEndpoint) {
    cachedPublicClient ??= createS3Client(config.publicEndpoint);

    return cachedPublicClient;
  }

  cachedClient ??= createS3Client(config.endpoint);

  return cachedClient;
}

export async function createAvatarUploadUrl(params: { userId: string; contentType: string }) {
  const config = getStorageConfig();
  const key = getAvatarObjectKey(params.userId);
  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ContentType: params.contentType,
  });

  const uploadUrl = await getSignedUrl(getS3Client({ publicEndpoint: true }), command, {
    expiresIn: 600,
    signableHeaders: new Set(["content-type"]),
  });

  return {
    key,
    uploadUrl,
    imageUrl: getAvatarImageUrl(params.userId),
    headers: {
      "Content-Type": params.contentType,
    },
  };
}

export async function createBlogCoverUploadUrl(params: { contentType: string }) {
  const config = getStorageConfig();
  const imageId = crypto.randomUUID();
  const key = getBlogCoverObjectKey(imageId);
  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ContentType: params.contentType,
  });

  const uploadUrl = await getSignedUrl(getS3Client({ publicEndpoint: true }), command, {
    expiresIn: 600,
    signableHeaders: new Set(["content-type"]),
  });

  return {
    key,
    uploadUrl,
    imageUrl: getBlogCoverImageUrl(imageId),
    headers: {
      "Content-Type": params.contentType,
    },
  };
}

export async function createMediaUploadUrl(params: { id: string; contentType: string }) {
  const config = getStorageConfig();
  const key = getMediaObjectKey(params.id);
  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ContentType: params.contentType,
  });

  const uploadUrl = await getSignedUrl(getS3Client({ publicEndpoint: true }), command, {
    expiresIn: 600,
    signableHeaders: new Set(["content-type"]),
  });

  return {
    key,
    uploadUrl,
    imageUrl: getMediaImageUrl(params.id),
    headers: {
      "Content-Type": params.contentType,
    },
  };
}

export async function getObjectBytes(key: string) {
  const config = getStorageConfig();
  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: key,
  });
  const response = await getS3Client().send(command);
  const body = response.Body;

  if (!body) {
    throw new Error(`Object ${key} is empty.`);
  }

  const bytes = await body.transformToByteArray();

  return new Uint8Array(bytes);
}

export async function createAvatarDownloadUrl(userId: string) {
  const config = getStorageConfig();
  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: getAvatarObjectKey(userId),
  });

  return getSignedUrl(getS3Client({ publicEndpoint: true }), command, { expiresIn: 300 });
}

export async function createObjectDownloadUrl(key: string) {
  const config = getStorageConfig();
  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: key,
  });

  return getSignedUrl(getS3Client({ publicEndpoint: true }), command, { expiresIn: 300 });
}

export async function deleteObject(key: string) {
  const config = getStorageConfig();
  const command = new DeleteObjectCommand({
    Bucket: config.bucket,
    Key: key,
  });

  await getS3Client().send(command);
}

function isMissingBucketError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const status = (error as Error & { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;

  return error.name === "NotFound" || status === 404;
}

export async function ensureStorageBucket() {
  const config = getStorageConfig();
  const client = getS3Client();

  try {
    await client.send(
      new HeadBucketCommand({
        Bucket: config.bucket,
      }),
    );
  } catch (error) {
    if (!isMissingBucketError(error) || !config.endpoint) {
      throw error;
    }

    await client.send(
      new CreateBucketCommand({
        Bucket: config.bucket,
      }),
    );
  }
}

export async function checkStorageConnection() {
  await ensureStorageBucket();
}
