import { userService } from "~~/server/services/database/UserService";
import { authService } from "~~/server/services/database/AuthService";
import { signUpSchema } from "~~/validation/auth";
import ConfirmSignUpEmail from "~~/email/ConfirmSignUp.vue";

import type { z } from "zod";
import type { InferSelectModel } from "drizzle-orm";

const console = useLogger().withTag("api:auth:signup");

async function handleUserValidation(data: z.output<typeof signUpSchema>) {
  const existingEmailUser = await userService.getByEmail(data.email);
  if (existingEmailUser) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email already in use",
    });
  }
}

async function createUser(data: z.output<typeof signUpSchema>) {
  const hashedPassword = await hashPassword(data.newPassword);
  const user = await authService.signup({
    name: data.name,
    email: data.email,
    hashedPassword,
  });
  if (!user) {
    throw createError({
      statusCode: 500,
      statusMessage: "Unexpected error occurred.",
    });
  }
  return user;
}

async function sendVerificationEmail(
  user: InferSelectModel<typeof tables.user>,
) {
  const oneTimePassword = await authService.generateOneTimePassword(user.id);
  if (!oneTimePassword) {
    throw createError({
      statusCode: 500,
      statusMessage: "Unexpected error occurred.",
    });
  }
  const token = [user.id, oneTimePassword.token].join(".");
  const baseUrl = useRuntimeConfig().public.baseUrl;
  const verifyEmailTokenUrl = `${baseUrl}/api/auth/verify-signup?token=${token}`;
  const { html, text } = await renderEmail(ConfirmSignUpEmail, {
    name: user.name,
    verifyEmailTokenUrl,
  });
  await useEmail().send({
    text,
    html,
    to: user.email!,
    subject: "Welcome to qbix!",
  });
}

export default defineEventHandler(async (event) => {
  try {
    const data = await readValidatedBody(event, signUpSchema.parse);
    await handleUserValidation(data);
    const user = await createUser(data);
    sendVerificationEmail(user);
    const transformedUser = sanitizeUser(user);
    await setUserSession(event, { user: transformedUser });
    return sendRedirect(event, "/");
  } catch (error) {
    console.error(error);
    throw error;
  }
});
