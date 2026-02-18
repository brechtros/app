import type { OfferDTO, OfferVersionDTO, ReviseOfferInput } from "../contracts/dto/offer.dto";
import type { WorkItemDTO } from "../contracts/dto/work-item.dto";
import type { Result } from "../contracts/error/domain-error";
import type { ServiceContext } from "./types";

export interface OfferService {
  createOffer(ctx: ServiceContext, opportunityId: string): Promise<Result<OfferDTO>>;
  reviseOffer(ctx: ServiceContext, offerId: string, content: ReviseOfferInput): Promise<Result<OfferVersionDTO>>;
  acceptOffer(ctx: ServiceContext, offerId: string): Promise<Result<WorkItemDTO>>;
}
