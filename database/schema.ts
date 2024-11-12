import { sqliteTable, uniqueIndex } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { customAlphabet } from "nanoid";

const generateShortCode = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  6,
);

export const user = sqliteTable("user", (t) => ({
  id: t
    .text()
    .primaryKey()
    .$default(() => createId()),
  createdAt: t
    .integer({ mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
  email: t.text().notNull().unique(),
  emailConfirmedAt: t.integer({ mode: "timestamp" }),
  name: t.text().notNull(),
  hashedPassword: t.text(),
}));

export enum OneTimePasswordTypes {
  signup = "SIGNUP",
}

export const oneTimePassword = sqliteTable("one_time_password", (t) => ({
  id: t
    .text()
    .primaryKey()
    .$default(() => createId()),
  createdAt: t
    .integer({ mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
  type: t.text().notNull().default(OneTimePasswordTypes.signup),
  userId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: t.text().notNull(),
  expiredAt: t.integer({ mode: "timestamp" }).notNull(),
}));

export enum URLType {
  link = "link",
  qrcode = "qrcode",
  image = "image",
}

export const url = sqliteTable("url", (t) => ({
  id: t
    .text()
    .primaryKey()
    .$default(() => createId()),
  createdAt: t
    .integer({ mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
  userId: t.text().references(() => user.id, { onDelete: "set null" }),
  url: t.text().notNull(),
  shortCode: t
    .text()
    .notNull()
    .unique()
    .$default(() => generateShortCode()),
  count: t.integer().default(0).notNull(),
  type: t.text().notNull().default(URLType.link),
  imageObject: t.text().references(() => object.key, { onDelete: "cascade" }),
}));

export const object = sqliteTable(
  "object",
  (t) => ({
    key: t.text().primaryKey(),
    createdAt: t
      .integer({ mode: "timestamp" })
      .notNull()
      .$default(() => new Date()),
    bucket: t.text().notNull(),
    name: t.text().notNull(),
    metadata: t.text({ mode: "json" }).notNull().default({}),
    version: t.integer().default(1).notNull(),
    owner: t.text().references(() => user.id, { onDelete: "set null" }),
  }),
  (table) => ({
    uniqueBucketObject: uniqueIndex("unique_bucket_object").on(
      table.bucket,
      table.name,
    ),
  }),
);
