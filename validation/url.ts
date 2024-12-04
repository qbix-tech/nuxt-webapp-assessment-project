import { z } from "zod";
import { URLType } from "~~/database/schema";

export const createShortLinkSchema = z.object({
  url: z.string().url(),
  type: z.literal(URLType.link),
});

export const createQRCodeSchema = z.object({
  url: z.string().url(),
  type: z.literal(URLType.qrcode),
});

export const createImageSchema = z.object({
  imageObject: z.string(),
  type: z.literal(URLType.image),
});

export const createUrlSchema = z.discriminatedUnion("type", [
  createShortLinkSchema,
  createQRCodeSchema,
  createImageSchema,
]);
