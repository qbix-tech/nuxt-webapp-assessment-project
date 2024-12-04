import { storageService } from "~~/server/services/database/StorageService";

const console = useLogger().withTag("api:storage:public");

export default defineEventHandler(async (event) => {
  try {
    const { key } = getRouterParams(event);
    const publicUrl = storageService.getPublicUrl(key);

    return publicUrl;
  } catch (error) {
    console.error(error);
    throw error;
  }
});
