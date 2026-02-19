import { z } from "zod";

export const ErrorTypeSchema = z.enum([
  "VALIDATION_ERROR",
  "BUSINESS_RULE_ERROR",
  "CONFLICT_ERROR",
  "NOT_FOUND",
  "PERMISSION_DENIED",
  "SYSTEM_ERROR",
]);

export const ErrorCodeSchema = z.enum([
  "AUTH_REQUIRED",
  "TENANT_REQUIRED",
  "PERMISSION_DENIED",
  "VALIDATION_FAILED",
  "NOT_FOUND",
  "CONFLICT",
  "INVALID_STATE_TRANSITION",
  "IMMUTABLE_RESOURCE",
  "PAYMENT_EXCEEDS_TOTAL",
  "INVOICE_NOT_SENDABLE",
  "WORKITEM_NOT_INVOICEABLE",
  "OFFER_NOT_ACCEPTABLE",
  "DUPLICATE_RESOURCE",
  "DB_ERROR",
  "UNKNOWN",
]);

export const DomainErrorSchema = z.object({
  type: ErrorTypeSchema,
  code: ErrorCodeSchema,
  message: z.string(),
  traceId: z.string().optional(),
  details: z.record(z.unknown()).optional(),
  fieldIssues: z
    .array(
      z.object({
        path: z.string(),
        message: z.string(),
      }),
    )
    .optional(),
});

export type DomainError = z.infer<typeof DomainErrorSchema>;

export const ResultSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.union([
    z.object({ ok: z.literal(true), data: dataSchema }),
    z.object({ ok: z.literal(false), error: DomainErrorSchema }),
  ]);

export type Result<T> = { ok: true; data: T } | { ok: false; error: DomainError };
