import { z } from "zod";
import { IdSchema, IsoDateStringSchema, TenantIdSchema } from "./shared";

export const InvoiceTypeSchema = z.enum(["STANDARD", "DEPOSIT", "CREDIT_NOTE"]);
export const InvoiceStatusSchema = z.enum(["DRAFT", "SENT", "PARTIALLY_PAID", "PAID"]);

export const InvoiceDTOSchema = z.object({
  id: IdSchema,
  tenantId: TenantIdSchema,
  workItemId: IdSchema.optional(),
  billToPartyId: IdSchema,
  type: InvoiceTypeSchema,
  status: InvoiceStatusSchema,
  invoiceYear: z.number().int().gte(2000),
  invoiceSequence: z.number().int().positive(),
  invoiceNumber: z.string().regex(/^\d{4}-\d{6}$/),
  ogm: z.string().min(1),
  currency: z.string().length(3),
  totalCents: z.number().int().nonnegative(),
  issuedAt: IsoDateStringSchema.optional(),
  dueAt: IsoDateStringSchema.optional(),
  createdAt: IsoDateStringSchema,
  updatedAt: IsoDateStringSchema,
});

export const PaymentMethodSchema = z.enum(["BANK_TRANSFER", "CASH", "CARD", "OTHER"]);

export const PaymentDTOSchema = z.object({
  id: IdSchema,
  tenantId: TenantIdSchema,
  invoiceId: IdSchema,
  method: PaymentMethodSchema,
  amountCents: z.number().int().positive(),
  paidAt: IsoDateStringSchema,
  reference: z.string().optional(),
  createdAt: IsoDateStringSchema,
});

export const CreateInvoiceInputSchema = z.object({
  workItemId: IdSchema.optional(),
  billToPartyId: IdSchema,
  type: InvoiceTypeSchema.default("STANDARD"),
  currency: z.string().length(3).default("EUR"),
  totalCents: z.number().int().nonnegative(),
  issuedAt: IsoDateStringSchema.optional(),
  dueAt: IsoDateStringSchema.optional(),
});

export const RegisterPaymentInputSchema = z.object({
  method: PaymentMethodSchema,
  amountCents: z.number().int().positive(),
  paidAt: IsoDateStringSchema,
  reference: z.string().optional(),
});

export type InvoiceDTO = z.infer<typeof InvoiceDTOSchema>;
export type PaymentDTO = z.infer<typeof PaymentDTOSchema>;
export type CreateInvoiceInput = z.infer<typeof CreateInvoiceInputSchema>;
export type RegisterPaymentInput = z.infer<typeof RegisterPaymentInputSchema>;
