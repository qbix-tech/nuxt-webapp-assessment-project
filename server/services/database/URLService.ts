import {
  eq,
  sql,
  asc,
  desc,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";

const console = useLogger().withTag("service:url");

class URLService {
  /**
   * Creates a new URL record with the provided data.
   *
   * @param data - An object containing the URL record data.
   * @returns A promise that resolves to the newly created URL record.
   * @throws An error if an error occurs.
   */
  async create(
    data: InferInsertModel<typeof tables.url>,
  ): Promise<InferSelectModel<typeof tables.url>> {
    try {
      const record = await useDB()
        .insert(tables.url)
        .values(data)
        .returning()
        .get();
      return record;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Fetch a URL record by its short code.
   *
   * @param shortCode
   * @returns A promise that resolves to the URL record with the provided short code or null if not found.
   */
  async getByShortCode(
    shortCode: string,
  ): Promise<InferSelectModel<typeof tables.url> | null> {
    try {
      const record = await useDB()
        .select()
        .from(tables.url)
        .where(eq(tables.url.shortCode, shortCode))
        .get();
      return record || null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Fetch all URL records associated with a user.
   *
   * @param userId
   * @returns A promise that resolves to an array of URL records associated with the user.
   */
  async getAllByUserId(
    userId: string,
    order: "asc" | "desc" = "asc",
  ): Promise<InferSelectModel<typeof tables.url>[]> {
    try {
      const records = await useDB()
        .select()
        .from(tables.url)
        .where(eq(tables.url.userId, userId))
        .orderBy(
          order === "asc"
            ? asc(tables.url.createdAt)
            : desc(tables.url.createdAt),
        );
      return records;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Increment the visit count of a URL record.
   *
   * @param id
   */
  async incrementVisitCount(id: string): Promise<void> {
    try {
      await useDB()
        .update(tables.url)
        .set({ count: sql`${tables.url.count} + 1` })
        .where(eq(tables.url.id, id));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const urlService = new URLService();
