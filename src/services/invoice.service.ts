import type {
  CreateInvoiceInput,
  InvoiceDTO,
  PaymentDTO,
  RegisterPaymentInput,
} from "../contracts/dto/invoice.dto";
import type { Result } from "../contracts/error/domain-error";
import type { ServiceContext } from "./types";

export interface InvoiceService {
  createInvoice(ctx: ServiceContext, input: CreateInvoiceInput): Promise<Result<InvoiceDTO>>;
  sendInvoice(ctx: ServiceContext, id: string): Promise<Result<InvoiceDTO>>;
  registerPayment(
    ctx: ServiceContext,
    invoiceId: string,
    paymentInput: RegisterPaymentInput,
  ): Promise<Result<PaymentDTO>>;
}
