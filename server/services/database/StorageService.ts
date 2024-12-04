import { eq, getTableColumns, type InferSelectModel } from "drizzle-orm";
import { useFileStorage } from "~~/server/services/storage";
import { defu } from "defu";

const console = useLogger().withTag("service:storage");

class StorageService {
  /**
   * Uploads a file to the specified storage bucket and records its metadata in the database.
   *
   * @param {File} file The file to be uploaded.
   * @param {Object} options Configuration options for the upload.
   * @param {string} options.name The name of the file.
   * @param {string} options.bucket The name of the storage bucket.
   * @param {string} [options.owner] (Optional) The ID of the user who owns the file.
   * @param {Record<string, any>} [options.metadata] (Optional) Additional metadata to be associated with the file.
   *
   * @returns The record of the uploaded file from the database.
   *
   * @throws Will throw an error if the upload or database transaction fails.
   */
  async upload(
    file: File,
    options: {
      name: string;
      bucket: string;
      owner?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metadata?: Record<string, any>;
    },
  ): Promise<InferSelectModel<typeof tables.object>> {
    try {
      const bucketConfig = getBucketConfig(options.bucket);

      const record = await useDB().transaction(async (tx) => {
        const key = `${options.bucket}/${options.name}`;

        const [object] = await tx
          .insert(tables.object)
          .values({
            key: key,
            bucket: options.bucket,
            name: options.name,
            owner: options.owner,
            metadata: defu(
              {
                size: file.size,
                type: file.type,
                name: file.name,
                lastModified: file.lastModified,
              },
              options.metadata,
            ),
          })
          .returning();

        await useFileStorage("S3", {
          public: bucketConfig.public,
        }).upload({
          key,
          file,
        });

        return object;
      });

      return record;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Retrieves the public URL for a given key from the storage service.
   *
   * @param key The key representing the file in the storage service.
   * @returns The public URL of the file.
   * @throws Will throw an error if the bucket is not public or if any other error occurs.
   */
  getPublicUrl(key: string): string {
    try {
      const bucket = key.split("/")[0];
      const bucketConfig = getBucketConfig(bucket);

      if (!bucketConfig.public) {
        throw createError({
          statusCode: 403,
          statusMessage: "Forbidden",
        });
      }

      return useFileStorage("S3", { public: true }).getPublicUrl(key);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Asynchronously retrieves a signed URL for reading a file from storage.
   *
   * @param key The key or path of the file in the storage bucket.
   * @param [expiresInSeconds=3600] (Optional) The number of seconds the signed URL is valid for.
   * @returns A promise that resolves to the signed URL for reading the file.
   * @throws Will throw an error if there is an issue generating the signed URL.
   */
  async getSignedUrl(
    key: string,
    expiresInSeconds = 60 * 60 * 1,
  ): Promise<string> {
    try {
      const bucket = key.split("/")[0];
      const bucketConfig = getBucketConfig(bucket);

      return await useFileStorage("S3", {
        public: bucketConfig.public,
      }).getSignedUrlForRead(key, expiresInSeconds);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Deletes the object from the storage service and its record in database.
   *
   * @param key The key of the object to be deleted.
   * @returns The deleted object record.
   * @throws Will throw an error if the deletion process fails.
   */
  async delete(key: string): Promise<InferSelectModel<typeof tables.object>> {
    try {
      const bucket = key.split("/")[0];
      const bucketConfig = getBucketConfig(bucket);

      const record = await useDB().transaction(async (tx) => {
        const [object] = await tx
          .delete(tables.object)
          .where(eq(tables.object.key, key))
          .returning();

        await useFileStorage("S3", { public: bucketConfig.public }).delete(key);

        return object;
      });

      return record;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Retrieves the owner of the object with the specified key.
   *
   * @param key The key of the object.
   * @returns A promise that resolves to the user record of the owner or null if not found.
   */
  async getOwner(
    key: string,
  ): Promise<InferSelectModel<typeof tables.user> | null> {
    try {
      const record = await useDB()
        .select({ ...getTableColumns(tables.user) })
        .from(tables.object)
        .leftJoin(tables.user, eq(tables.user.id, tables.object.owner))
        .where(eq(tables.object.key, key))
        .get();

      return (record as InferSelectModel<typeof tables.user>) || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export const storageService = new StorageService();
