import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl as getS3SignedUrl } from "@aws-sdk/s3-request-presigner";
import type { FileStorageService, FileUploadOptions } from "./Storage";

const console = useLogger().withTag("service:storage:s3");

export class S3FileStorage implements FileStorageService {
  private s3Client: S3Client;
  private bucket: string;
  private s3PublicUrl: string;

  constructor(type: "public" | "private") {
    const s3Endpoint = process.env[
      `S3_${type.toUpperCase()}_ENDPOINT`
    ] as string;
    const s3ForcePathStyle =
      process.env[`S3_${type.toUpperCase()}_FORCE_PATH_STYLE`] === "true";
    const s3AccessKeyId = process.env[
      `S3_${type.toUpperCase()}_ACCESS_KEY_ID`
    ] as string;
    const s3SecretAccessKey = process.env[
      `S3_${type.toUpperCase()}_SECRET_ACCESS_KEY`
    ] as string;
    this.bucket = process.env[`S3_${type.toUpperCase()}_BUCKET`] as string;
    this.s3PublicUrl = process.env[
      `S3_${type.toUpperCase()}_ACCESS_URL`
    ] as string;

    if (!s3Endpoint || !s3AccessKeyId || !s3SecretAccessKey || !this.bucket) {
      throw new Error(
        `Missing S3 ${type} configuration. Please check your environment variables.`,
      );
    }

    this.s3Client = new S3Client({
      region: "auto",
      endpoint: s3Endpoint,
      credentials: {
        accessKeyId: s3AccessKeyId,
        secretAccessKey: s3SecretAccessKey,
      },
      forcePathStyle: s3ForcePathStyle,
    });
  }

  async upload({ key, file }: FileUploadOptions): Promise<string> {
    let body: Buffer | string;
    if (file instanceof Blob) {
      body = Buffer.from(await file.arrayBuffer());
    } else if (Buffer.isBuffer(file)) {
      body = file;
    } else if (typeof file === "string") {
      body = file;
    } else {
      throw new Error("Unsupported data type for upload");
    }

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
    });

    try {
      await this.s3Client.send(command);
      return key;
    } catch (error) {
      console.error("Error uploading file to S3", error);
      throw new Error(`Failed to upload file of key ${key}`);
    }
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new Error(`Failed to delete file of key ${key}`);
    }
  }

  async getSignedUrlForRead(
    key: string,
    expiresInSeconds: number = 60 * 60 * 1, // defaults 1 hour
  ): Promise<string> {
    try {
      return await getS3SignedUrl(
        this.s3Client,
        new GetObjectCommand({ Bucket: this.bucket, Key: key }),
        { expiresIn: expiresInSeconds },
      );
    } catch (error) {
      console.error("Error generating signed URL for read:", error);
      throw new Error(`Failed to generate signed URL for reading ${key}`);
    }
  }

  getPublicUrl(key: string) {
    return `${this.s3PublicUrl}/${key}`;
  }
}
