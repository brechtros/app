# Service Layer Contract Specification

_(Toevoegen als SERVICE_CONTRACTS.md)_

---

## 1. Algemene regels

Elke service:
- is tenant-scoped
- valideert input
- voert domain rules uit
- gebruikt repositories
- runt in transaction indien nodig
- retourneert DTO, nooit Prisma model

---

## Base types

```ts
type ServiceContext = {
  tenantId: string
  userId: string
  role: "OWNER" | "ADMIN" | "MEMBER"
}

type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: DomainError }
```

---

## 2. Party Service

### createParty

Maakt relatie

`createParty(ctx, input): Result<PartyDTO>`

Input:
- name
- type (person/company)
- contactpoints[]
- addresses[]
- roles[]

---

### updateParty

Mag niet als openstaande facturen naam vereisen snapshot

`updateParty(ctx, partyId, patch): Result<PartyDTO>`

---

### assignRole

Voegt rol toe zonder duplicatie

`assignRole(ctx, partyId, role): Result<void>`

---

## 3. Opportunity Service

### createOpportunity

`createOpportunity(ctx, partyId, input): Result<OpportunityDTO>`

---

### changeStage

Valideert state machine

`changeOpportunityStage(ctx, id, nextStage): Result<OpportunityDTO>`

---

## 4. Offer Service

### createOffer

`createOffer(ctx, opportunityId): Result<OfferDTO>`

---

### createRevision

Nieuwe OfferVersion

`reviseOffer(ctx, offerId, content): Result<OfferVersionDTO>`

---

### acceptOffer

Transactioneel → maakt WorkItem

`acceptOffer(ctx, offerId): Result<WorkItemDTO>`

---

## 5. WorkItem Service

### createManualWorkItem

`createWorkItem(ctx, input): Result<WorkItemDTO>`

---

### activateWorkItem

`activateWorkItem(ctx, id): Result<WorkItemDTO>`

---

### completeWorkItem

Mag enkel als geen draft invoices

`completeWorkItem(ctx, id): Result<WorkItemDTO>`

---

## 6. Invoice Service

### createInvoice (ATOMIC)

Gebruikt InvoiceSeries lock

`createInvoice(ctx, input): Result<InvoiceDTO>`

---

### sendInvoice

Locks bedragen

`sendInvoice(ctx, id): Result<InvoiceDTO>`

---

### registerPayment

Past status aan

`registerPayment(ctx, invoiceId, paymentInput): Result<PaymentDTO>`

---

## 7. Page Service

### publishPage

`publishPage(ctx, pageId): Result<void>`

---

### resolvePublicPage

Wordt gebruikt door public router

`resolvePublicPage(host, slug): PublicPageDTO | null`

---

## 8. Domain Service

### verifyDomain

Controleert DNS

`verifyDomain(ctx, domain): Result<DomainMappingDTO>`

---

## 9. Belangrijkste backend regel

Controllers en server actions mogen alleen:

validate → service → return

Nooit:
- prisma calls
- state logic
- business checks

---

## Concrete vervolgstap
1. Sla dit op als SERVICE_CONTRACTS.md
2. Commit
3. Volgende stap: DTO schemas + Zod validators definiëren (zorgt dat frontend en backend exact dezelfde structuur gebruiken)

Zeg: DTO schemas zodra klaar.
