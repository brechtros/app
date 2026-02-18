import { z } from "zod";
import { IdSchema, IsoDateStringSchema, TenantIdSchema } from "./shared";

export const WorkItemTypeSchema = z.enum(["ORDER", "PROJECT"]);
export const WorkItemStatusSchema = z.enum(["DRAFT", "ACTIVE", "DONE", "CANCELLED"]);

export const WorkItemContactSchema = z.object({
  partyId: IdSchema,
  role: z.string().optional(),
});

export const WorkItemDTOSchema = z.object({
  id: IdSchema,
  tenantId: TenantIdSchema,
  type: WorkItemTypeSchema,
  status: WorkItemStatusSchema,
  title: z.string().min(1),
  primaryPartyId: IdSchema,
  offerId: IdSchema.optional(),
  contacts: z.array(WorkItemContactSchema),
  createdAt: IsoDateStringSchema,
  updatedAt: IsoDateStringSchema,
});

export const CreateWorkItemInputSchema = z.object({
  type: WorkItemTypeSchema,
  title: z.string().min(1),
  primaryPartyId: IdSchema,
  offerId: IdSchema.optional(),
  contacts: z.array(WorkItemContactSchema).default([]),
});

export type WorkItemDTO = z.infer<typeof WorkItemDTOSchema>;
export type WorkItemContact = z.infer<typeof WorkItemContactSchema>;
export type CreateWorkItemInput = z.infer<typeof CreateWorkItemInputSchema>;
