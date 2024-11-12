import { eq, type InferSelectModel } from "drizzle-orm";

const console = useLogger().withTag("service:user");

class UserService {
  /**
   * Get user by user ID
   *
   * @param id The ID of the user to retrieve.
   * @returns A promise that resolves to a user record, or null if the user was not found.
   */
  async getById(
    id: string,
  ): Promise<InferSelectModel<typeof tables.user> | null> {
    try {
      const record = await useDB()
        .select()
        .from(tables.user)
        .where(eq(tables.user.id, id))
        .get();
      return record || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Get user by email
   *
   * @param email The email of the user to retrieve.
   * @returns A promise that resolves to a user record, or null if the user was not found.
   */
  async getByEmail(
    email: string,
  ): Promise<InferSelectModel<typeof tables.user> | null> {
    try {
      const record = await useDB()
        .select()
        .from(tables.user)
        .where(eq(tables.user.email, email))
        .get();
      return record || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Update a user record.
   *
   * @param id The ID of the user to update.
   * @param data The data to update the user with.
   * @returns A promise that resolves to the updated user record.
   */
  async updateUser(
    id: string,
    data: Partial<InferSelectModel<typeof tables.user>>,
  ): Promise<InferSelectModel<typeof tables.user> | null> {
    try {
      const record = await useDB()
        .update(tables.user)
        .set({
          ...data,
          id,
        })
        .where(eq(tables.user.id, id))
        .returning()
        .get();
      return record;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export const userService = new UserService();
