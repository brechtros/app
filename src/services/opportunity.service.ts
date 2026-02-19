import type { CreateOpportunityInput, OpportunityDTO } from "../contracts/dto/opportunity.dto";
import type { Result } from "../contracts/error/domain-error";
import type { ServiceContext } from "./types";

export interface OpportunityService {
  createOpportunity(
    ctx: ServiceContext,
    partyId: string,
    input: CreateOpportunityInput,
  ): Promise<Result<OpportunityDTO>>;
  changeOpportunityStage(
    ctx: ServiceContext,
    id: string,
    nextStage: "NEW" | "QUALIFIED" | "PROPOSAL" | "WON" | "LOST",
  ): Promise<Result<OpportunityDTO>>;
}
