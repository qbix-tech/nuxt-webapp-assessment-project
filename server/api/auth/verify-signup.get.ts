import { userService } from "~~/server/services/database/UserService";
import { authService } from "~~/server/services/database/AuthService";
import { wrappedTokenSchema } from "~~/validation/auth";
import { OneTimePasswordTypes } from "~~/database/schema";

const console = useLogger().withTag("api:auth:verify-signup");

export default defineEventHandler(async (event) => {
  try {
    const [userId, token] = await getValidatedQuery(
      event,
      wrappedTokenSchema.parse,
    );
    const isTokenCorrect = await authService.verifyOneTimePassword(
      userId,
      token,
      OneTimePasswordTypes.signup,
    );
    if (!isTokenCorrect) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid or expired link.",
      });
    }
    const user = await userService.getById(userId);
    if (!user) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid or expired link.",
      });
    }
    if (!user.emailConfirmedAt) {
      await userService.updateUser(user.id, {
        emailConfirmedAt: new Date(),
      });
    }
    const transformedUser = sanitizeUser(user);
    await setUserSession(event, { user: transformedUser });
    sendRedirect(event, "/");
  } catch (error) {
    console.error(error);
    throw error;
  }
});
