import { z } from "zod";
import { IdSchema, IsoDateStringSchema, TenantIdSchema } from "./shared";

export const OfferStatusSchema = z.enum(["DRAFT", "SENT", "ACCEPTED", "REJECTED"]);

export const OfferDTOSchema = z.object({
  id: IdSchema,
  tenantId: TenantIdSchema,
  partyId: IdSchema,
  opportunityId: IdSchema.optional(),
  status: OfferStatusSchema,
  createdAt: IsoDateStringSchema,
  updatedAt: IsoDateStringSchema,
});

export const OfferVersionDTOSchema = z.object({
  id: IdSchema,
  tenantId: TenantIdSchema,
  offerId: IdSchema,
  version: z.number().int().positive(),
  title: z.string().optional(),
  contentJson: z.record(z.unknown()),
  createdAt: IsoDateStringSchema,
});

export const ReviseOfferInputSchema = z.object({
  title: z.string().optional(),
  contentJson: z.record(z.unknown()),
});

export type OfferDTO = z.infer<typeof OfferDTOSchema>;
export type OfferVersionDTO = z.infer<typeof OfferVersionDTOSchema>;
export type ReviseOfferInput = z.infer<typeof ReviseOfferInputSchema>;
