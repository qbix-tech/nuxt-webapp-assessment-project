import { createClient } from "@libsql/client/http";
import { drizzle } from "drizzle-orm/libsql";
import type { LibSQLDatabase } from "drizzle-orm/libsql";

let _db: LibSQLDatabase<Record<string, never>> | null = null;

export const useDB = (): LibSQLDatabase<Record<string, never>> => {
  if (!_db) {
    const { TURSO_DB_URL, TURSO_DB_TOKEN } = process.env;

    if (!TURSO_DB_URL || !TURSO_DB_TOKEN) {
      throw new Error("Turso configuration is missing");
    }

    _db = drizzle(
      createClient({
        url: TURSO_DB_URL,
        authToken: TURSO_DB_TOKEN,
      }),
      { casing: "snake_case" },
    );
  }
  return _db;
};

// export all tables from the schema
export * as tables from "~~/database/schema";
