import z from "zod";
import { urlService } from "~~/server/services/database/URLService";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const { order } = await getValidatedQuery(
    event,
    z.object({ order: z.enum(["asc", "desc"]).optional() }).parse,
  );

  return await urlService.getAllByUserId(user.id, order);
});
