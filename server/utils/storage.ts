import type { BlobSize, BlobType } from "./blob";

const _storageBuckets = useRuntimeConfig().storage.buckets;

export type BucketConfig = {
  public?: boolean;
  allowedMimeTypes?: BlobType[];
  maxSize: BlobSize;
};

/**
 * Ensures is a valid bucket.
 *
 * @param {string} bucket
 * @returns {void}
 * @throws Will throw an error if the bucket is invalid.
 */
export const validateBucket = (bucket: string) => {
  if (!Object.keys(_storageBuckets).includes(bucket)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Bucket not found",
    });
  }

  return bucket as keyof typeof _storageBuckets;
};

/**
 * Gets the configuration for a bucket.
 *
 * @param {string} bucket
 * @returns {BucketConfig}
 */
export const getBucketConfig = (bucket: string): BucketConfig => {
  return _storageBuckets[validateBucket(bucket)] as BucketConfig;
};
