import { describe, expect, it } from "vitest";
import {
  CreateInvoiceInputSchema,
  CreateOpportunityInputSchema,
  DomainMappingDTOSchema,
  OfferVersionDTOSchema,
} from "../src/contracts/dto";

describe("DTO contracts", () => {
  it("validates opportunity create input", () => {
    const parsed = CreateOpportunityInputSchema.safeParse({ title: "Nieuwe deal", valueCents: 50000 });
    expect(parsed.success).toBe(true);
  });

  it("validates invoice create input", () => {
    const parsed = CreateInvoiceInputSchema.safeParse({
      billToPartyId: "pty_1",
      totalCents: 1999,
      currency: "EUR",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid domain mapping dto", () => {
    const parsed = DomainMappingDTOSchema.safeParse({
      id: "dom_1",
      tenantId: "t_1",
      domain: "",
      createdAt: "2026-02-18T09:00:00Z",
    });
    expect(parsed.success).toBe(false);
  });

  it("requires positive offer version", () => {
    const parsed = OfferVersionDTOSchema.safeParse({
      id: "ov_1",
      tenantId: "t_1",
      offerId: "off_1",
      version: 0,
      contentJson: {},
      createdAt: "2026-02-18T09:00:00Z",
    });
    expect(parsed.success).toBe(false);
  });
});
