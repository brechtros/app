import type { CreateWorkItemInput, WorkItemDTO } from "../contracts/dto/work-item.dto";
import type { Result } from "../contracts/error/domain-error";
import type { ServiceContext } from "./types";

export interface WorkItemService {
  createWorkItem(ctx: ServiceContext, input: CreateWorkItemInput): Promise<Result<WorkItemDTO>>;
  activateWorkItem(ctx: ServiceContext, id: string): Promise<Result<WorkItemDTO>>;
  completeWorkItem(ctx: ServiceContext, id: string): Promise<Result<WorkItemDTO>>;
}
