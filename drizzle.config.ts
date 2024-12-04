import { defineConfig } from "drizzle-kit";
const { TURSO_DB_URL, TURSO_DB_TOKEN } = process.env;

if (!TURSO_DB_URL || !TURSO_DB_TOKEN) {
  throw new Error("Turso configuration is missing");
}

export default defineConfig({
  dialect: "turso",
  dbCredentials: {
    url: TURSO_DB_URL,
    authToken: TURSO_DB_TOKEN,
  },
  casing: "snake_case",
  schema: "./database/schema.ts",
  out: "./database/migrations",
});
