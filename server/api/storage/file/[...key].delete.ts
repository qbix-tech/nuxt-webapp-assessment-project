import { storageService } from "~~/server/services/database/StorageService";

const console = useLogger().withTag("api:storage:file:delete");

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event);

  try {
    const { key } = getRouterParams(event);

    const owner = await storageService.getOwner(key);

    if (owner && owner.id !== user?.id) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      });
    }

    const record = await storageService.delete(key);

    return record;
  } catch (error) {
    console.error(error);
    throw error;
  }
});
