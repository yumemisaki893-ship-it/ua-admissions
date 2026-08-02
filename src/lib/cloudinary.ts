import { v2 as cloudinary } from "cloudinary";

const configured =
  Boolean(process.env.CLOUDINARY_CLOUD_NAME) &&
  Boolean(process.env.CLOUDINARY_API_KEY) &&
  Boolean(process.env.CLOUDINARY_API_SECRET);

if (configured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export interface UploadResult {
  url: string;
  publicId?: string;
}

export function isCloudinaryConfigured() {
  return configured;
}

/**
 * Uploads a file buffer to Cloudinary. When Cloudinary is not configured
 * (local development), the file is written to /public/uploads and a local
 * URL is returned instead.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  mimeType: string,
  folder = "ua-admissions",
): Promise<UploadResult> {
  const base64 = buffer.toString("base64");
  const resourceType = mimeType.startsWith("image/") ? "image" : "raw";

  if (configured) {
    const result = await cloudinary.uploader.upload(`data:${mimeType};base64,${base64}`, {
      folder,
      resource_type: resourceType,
      unique_filename: true,
    });
    return { url: result.secure_url, publicId: result.public_id };
  }

  // ---- Local fallback ----
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const crypto = await import("node:crypto");

  const ext = mimeType === "application/pdf" ? "pdf" : mimeType === "image/png" ? "png" : "jpg";
  const name = `${crypto.randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), buffer);

  return { url: `/uploads/${name}` };
}
