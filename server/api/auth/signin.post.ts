import { userService } from "~~/server/services/database/UserService";
import { signInSchema } from "~~/validation/auth";

const console = useLogger().withTag("api:auth:signin");

async function handleUserValidation(email: string, password: string) {
  const user = await userService.getByEmail(email);
  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid credentials",
    });
  }
  const isPasswordCorrect = await verifyPassword(
    user.hashedPassword!,
    password,
  );
  if (!isPasswordCorrect) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid credentials",
    });
  }
  if (!user.emailConfirmedAt) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email not yet verified. Please check your email.",
    });
  }
  return user;
}

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readValidatedBody(
      event,
      signInSchema.parse,
    );
    const user = await handleUserValidation(email, password);
    const transformedUser = sanitizeUser(user);
    await setUserSession(event, { user: transformedUser });
  } catch (error) {
    console.error(error);
    throw error;
  }
});
