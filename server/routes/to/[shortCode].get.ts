import { urlService } from "~~/server/services/database/URLService";

const console = useLogger().withTag("api:routes:to:shortCode:get");

export default defineEventHandler(async (event) => {
  try {
    const { shortCode } = getRouterParams(event);
    const record = await urlService.getByShortCode(shortCode);

    if (!record) {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
      });
    }

    urlService.incrementVisitCount(record.id);
    sendRedirect(event, record.url, 301);
  } catch (error) {
    console.error(error);
    throw error;
  }
});
