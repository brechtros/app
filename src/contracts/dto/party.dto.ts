import { z } from "zod";
import { IdSchema, IsoDateStringSchema, TenantIdSchema } from "./shared";

export const PartyTypeSchema = z.enum(["PERSON", "COMPANY"]);
export const PartyRoleTypeSchema = z.enum(["LEAD", "CUSTOMER", "SUPPLIER"]);

export const PartyContactPointSchema = z.object({
  id: IdSchema,
  kind: z.enum(["email", "phone", "custom"]),
  value: z.string().min(1),
  label: z.string().min(1).optional(),
  isPrimary: z.boolean(),
});

export const PartyAddressSchema = z.object({
  id: IdSchema,
  kind: z.enum(["billing", "site", "shipping"]),
  line1: z.string().min(1),
  line2: z.string().optional(),
  postal: z.string().min(1),
  city: z.string().min(1),
  country: z.string().length(2),
  label: z.string().optional(),
  isPrimary: z.boolean(),
});

export const PartyDTOSchema = z.object({
  id: IdSchema,
  tenantId: TenantIdSchema,
  type: PartyTypeSchema,
  name: z.string().min(1),
  vatNumber: z.string().optional(),
  notes: z.string().optional(),
  roles: z.array(PartyRoleTypeSchema),
  contactPoints: z.array(PartyContactPointSchema),
  addresses: z.array(PartyAddressSchema),
  createdAt: IsoDateStringSchema,
  updatedAt: IsoDateStringSchema,
});

export const CreatePartyInputSchema = PartyDTOSchema.pick({
  name: true,
  type: true,
  roles: true,
  contactPoints: true,
  addresses: true,
}).extend({
  vatNumber: z.string().optional(),
  notes: z.string().optional(),
});

export const UpdatePartyPatchSchema = z
  .object({
    name: z.string().min(1).optional(),
    vatNumber: z.string().optional(),
    notes: z.string().optional(),
    contactPoints: z.array(PartyContactPointSchema).optional(),
    addresses: z.array(PartyAddressSchema).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, "At least one field is required");

export type PartyDTO = z.infer<typeof PartyDTOSchema>;
export type CreatePartyInput = z.infer<typeof CreatePartyInputSchema>;
export type UpdatePartyPatch = z.infer<typeof UpdatePartyPatchSchema>;
