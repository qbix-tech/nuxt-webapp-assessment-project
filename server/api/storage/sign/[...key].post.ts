import z from "zod";
import { storageService } from "~~/server/services/database/StorageService";

const console = useLogger().withTag("api:storage:sign");

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  try {
    const { key } = getRouterParams(event);
    const { expiresInSeconds } = await readValidatedBody(
      event,
      z.object({ expiresInSeconds: z.number().optional() }).parse,
    );

    if (user.id !== (await storageService.getOwner(key))?.id) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      });
    }

    const signedUrl = await storageService.getSignedUrl(key, expiresInSeconds);

    return signedUrl;
  } catch (error) {
    console.error(error);
    throw error;
  }
});
