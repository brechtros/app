import type { PublicPageDTO } from "../contracts/dto/page.dto";
import type { Result } from "../contracts/error/domain-error";
import type { ServiceContext } from "./types";

export interface PageService {
  publishPage(ctx: ServiceContext, pageId: string): Promise<Result<void>>;
  resolvePublicPage(host: string, slug: string): Promise<PublicPageDTO | null>;
}
