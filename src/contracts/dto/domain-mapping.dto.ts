import { z } from "zod";
import { IdSchema, IsoDateStringSchema, TenantIdSchema } from "./shared";

export const DomainMappingDTOSchema = z.object({
  id: IdSchema,
  tenantId: TenantIdSchema,
  domain: z.string().min(1),
  verifiedAt: IsoDateStringSchema.optional(),
  createdAt: IsoDateStringSchema,
});

export type DomainMappingDTO = z.infer<typeof DomainMappingDTOSchema>;
