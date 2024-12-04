import { eq, and, type InferSelectModel } from "drizzle-orm";
import { OneTimePasswordTypes } from "~~/database/schema";
import { nanoid } from "nanoid";

const console = useLogger().withTag("service:auth");

class AuthService {
  /**
   * Registers a new user with the provided data and hashed password.
   *
   * @param data - An object containing the user's registration details.
   * @param data.name - The name of the user.
   * @param data.email - The email address of the user.
   * @param data.hashedPassword - The hashed password of the user.
   * @returns A promise that resolves to the newly created user record.
   * @throws An error if an error occurs.
   */
  async signup(data: {
    name: string;
    email: string;
    hashedPassword: string;
  }): Promise<InferSelectModel<typeof tables.user> | null> {
    try {
      const record = await useDB()
        .insert(tables.user)
        .values({
          name: data.name,
          email: data.email,
          hashedPassword: data.hashedPassword,
        })
        .returning()
        .get();
      return record;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Generates a one-time password for a user.
   *
   * @param userId
   * @param options
   * @param options.type - The type of one-time password to generate. Defaults to 'signup'.
   * @param options.expiresInMs - The expiration time of the one-time password in milliseconds.
   *                              Defaults to 24 hours.
   * @returns A promise that resolves to the newly created one-time password record.
   * @throws An error if an error occurs.
   */
  async generateOneTimePassword(
    userId: string,
    options: {
      type?: OneTimePasswordTypes;
      expiresInMs?: number;
    } = {},
  ): Promise<InferSelectModel<typeof tables.oneTimePassword> | null> {
    try {
      const {
        expiresInMs = 1000 * 60 * 60 * 24, // 24 hours
        type = OneTimePasswordTypes.signup,
      } = options;
      const token = nanoid(36);
      const record = await useDB()
        .insert(tables.oneTimePassword)
        .values({
          userId,
          type,
          expiredAt: new Date(new Date().getTime() + expiresInMs),
          token,
        })
        .returning()
        .get();
      return record;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Verifies a one-time password for a user.
   *
   * @param userId - The ID of the user for whom the OTP is being retrieved.
   * @param token - The OTP token associated with the user.
   * @param type - The type of OTP to verify.
   * @returns A promise that resolves to a boolean indicating whether the OTP was verified.
   */
  async verifyOneTimePassword(
    userId: string,
    token: string,
    type: OneTimePasswordTypes,
  ): Promise<boolean> {
    try {
      const result = await useDB().transaction(async (tx) => {
        const oneTimePassword = await tx
          .select()
          .from(tables.oneTimePassword)
          .where(
            and(
              eq(tables.oneTimePassword.userId, userId),
              eq(tables.oneTimePassword.token, token),
              eq(tables.oneTimePassword.type, type),
            ),
          )
          .get();

        if (!oneTimePassword || oneTimePassword.expiredAt > new Date()) {
          return false;
        }
        await tx
          .update(tables.oneTimePassword)
          .set({ expiredAt: new Date() })
          .where(eq(tables.oneTimePassword.userId, oneTimePassword.id));
        return true;
      });
      return result;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

export const authService = new AuthService();
