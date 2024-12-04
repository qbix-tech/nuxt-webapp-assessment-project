import { customAlphabet } from "nanoid";
import { storageService } from "~~/server/services/database/StorageService";

const console = useLogger().withTag("api:storage:upload");

export default defineEventHandler(async (event) => {
  try {
    const { bucket } = getRouterParams(event);
    const bucketConfig = getBucketConfig(bucket);

    const form = await readFormData(event);
    const file = form.get("file");

    if (!(file instanceof Blob)) {
      throw new Error("File is not a Blob");
    }
    validateBlob(file, {
      maxSize: bucketConfig.maxSize,
      mimeTypes: bucketConfig.allowedMimeTypes,
    });

    const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);
    const name = `${nanoid()}-${file.name}`;

    const record = await storageService.upload(file, {
      name,
      bucket,
    });

    return record;
  } catch (error) {
    console.error(error);
    throw error;
  }
});
