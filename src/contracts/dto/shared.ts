import { z } from "zod";

export const IsoDateStringSchema = z.string().datetime({ offset: true });
export const IdSchema = z.string().min(1);
export const TenantIdSchema = z.string().min(1);
