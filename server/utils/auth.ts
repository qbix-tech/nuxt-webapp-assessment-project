import type { User } from "#auth-utils";
import type { InferSelectModel } from "drizzle-orm";

/**
 * Sanitizes a user object by removing sensitive information
 *
 * @param {InferSelectModel<typeof tables.user.user>} user
 * @returns {User | null}
 */
export const sanitizeUser = (
  user: InferSelectModel<typeof tables.user>,
): User => {
  const transformedUser = user as Partial<InferSelectModel<typeof tables.user>>;

  delete transformedUser.createdAt;
  delete transformedUser.emailConfirmedAt;
  delete transformedUser.hashedPassword;

  return transformedUser as User;
};
