import { userService } from "~~/server/services/database/UserService";

export default defineNitroPlugin(() => {
  sessionHooks.hook("fetch", async (session, event) => {
    const user = await userService.getById(session.user.id);
    if (!user) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid user.",
      });
    }
    const transformedUser = sanitizeUser(user);
    await setUserSession(event, { user: transformedUser });
  });
});
