import { describe, expect, it } from "vitest";
import { CreatePartyInputSchema } from "../src/contracts/dto/party.dto";

describe("CreatePartyInputSchema", () => {
  it("accepts valid payload", () => {
    const parsed = CreatePartyInputSchema.safeParse({
      name: "Acme BV",
      type: "COMPANY",
      roles: ["CUSTOMER"],
      contactPoints: [
        { id: "cp_1", kind: "email", value: "info@acme.be", isPrimary: true },
      ],
      addresses: [
        {
          id: "addr_1",
          kind: "billing",
          line1: "Main Street 1",
          postal: "1000",
          city: "Brussels",
          country: "BE",
          isPrimary: true,
        },
      ],
    });

    expect(parsed.success).toBe(true);
  });
});
