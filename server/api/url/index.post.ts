import { urlService } from "~~/server/services/database/URLService";
import { storageService } from "~~/server/services/database/StorageService";
import { createUrlSchema } from "~~/validation/url";
import { URLType } from "~~/database/schema";
import { customAlphabet } from "nanoid";

const console = useLogger().withTag("api:url:post");
const generateShortCode = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  6,
);

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event);

  try {
    const data = await readValidatedBody(event, createUrlSchema.parse);
    const url =
      data.type === URLType.image
        ? storageService.getPublicUrl(data.imageObject)
        : data.url;

    const record = await urlService.create({
      url,
      imageObject: data.type === URLType.image ? data.imageObject : null,
      shortCode:
        generateShortCode() +
        (data.type === URLType.image
          ? // concat the file extension to the short code for image type
            ".".concat(url.split(".").pop()!)
          : ""),
      type: data.type,
      userId: user?.id,
    });

    return record;
  } catch (error) {
    console.error(error);
    throw error;
  }
});
