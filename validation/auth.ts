import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.string().email("Invalid email"),
    name: z.string().min(3, "Must be at least 3 characters"),
    newPassword: z
      .string()
      .min(12, "Must be at least 12 characters")
      .max(64, "Must be at most 64 characters")
      .refine((check) => {
        const hasNumber = /\d/.test(check);
        const hasLowerCase = /[a-z]/.test(check);
        const hasUpperCase = /[A-Z]/.test(check);
        const hasSpecial = /[^A-Za-z0-9]/.test(check);
        return hasNumber && hasLowerCase && hasUpperCase && hasSpecial;
      }, "Must contain at least one number, lowercase, uppercase, and special character"),
    confirmPassword: z
      .string()
      .min(12, "Must be at least 12 characters")
      .max(64, "Must be at most 64 characters"),
  })
  .superRefine((data, ctx) => {
    const { newPassword, confirmPassword } = data;

    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string(),
});

export const wrappedTokenSchema = z
  .object({ token: z.string() })
  .transform((data) => data.token)
  .or(z.string())
  .refine(
    (twoken: string): twoken is `${string}.${string}` =>
      twoken.split(".").length === 2,
    "Invalid link.",
  )
  .transform((twoken) => twoken.split("."));
