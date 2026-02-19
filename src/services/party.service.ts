import type { CreatePartyInput, PartyDTO, UpdatePartyPatch } from "../contracts/dto/party.dto";
import type { Result } from "../contracts/error/domain-error";
import type { ServiceContext } from "./types";

export interface PartyService {
  createParty(ctx: ServiceContext, input: CreatePartyInput): Promise<Result<PartyDTO>>;
  updateParty(ctx: ServiceContext, partyId: string, patch: UpdatePartyPatch): Promise<Result<PartyDTO>>;
  assignRole(
    ctx: ServiceContext,
    partyId: string,
    role: "LEAD" | "CUSTOMER" | "SUPPLIER",
  ): Promise<Result<void>>;
}
