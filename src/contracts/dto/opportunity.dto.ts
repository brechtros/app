import { z } from "zod";
import { IdSchema, IsoDateStringSchema, TenantIdSchema } from "./shared";

export const OpportunityStageSchema = z.enum([
  "NEW",
  "QUALIFIED",
  "PROPOSAL",
  "WON",
  "LOST",
]);

export const OpportunityDTOSchema = z.object({
  id: IdSchema,
  tenantId: TenantIdSchema,
  partyId: IdSchema,
  title: z.string().min(1),
  stage: OpportunityStageSchema,
  valueCents: z.number().int().nonnegative().optional(),
  createdAt: IsoDateStringSchema,
  updatedAt: IsoDateStringSchema,
});

export const CreateOpportunityInputSchema = z.object({
  title: z.string().min(1),
  valueCents: z.number().int().nonnegative().optional(),
});

export type OpportunityDTO = z.infer<typeof OpportunityDTOSchema>;
export type CreateOpportunityInput = z.infer<typeof CreateOpportunityInputSchema>;
