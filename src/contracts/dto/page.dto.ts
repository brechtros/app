import { z } from "zod";
import { IdSchema, IsoDateStringSchema, TenantIdSchema } from "./shared";

export const PageDTOSchema = z.object({
  id: IdSchema,
  tenantId: TenantIdSchema,
  slug: z.string().min(1),
  title: z.string().min(1),
  contentJson: z.record(z.unknown()),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  publishedAt: IsoDateStringSchema.optional(),
  createdAt: IsoDateStringSchema,
  updatedAt: IsoDateStringSchema,
});

export const PublicPageDTOSchema = z.object({
  tenantId: TenantIdSchema,
  host: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  contentJson: z.record(z.unknown()),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type PageDTO = z.infer<typeof PageDTOSchema>;
export type PublicPageDTO = z.infer<typeof PublicPageDTOSchema>;
