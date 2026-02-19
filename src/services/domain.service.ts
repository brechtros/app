import type { DomainMappingDTO } from "../contracts/dto/domain-mapping.dto";
import type { Result } from "../contracts/error/domain-error";
import type { ServiceContext } from "./types";

export interface DomainService {
  verifyDomain(ctx: ServiceContext, domain: string): Promise<Result<DomainMappingDTO>>;
}
