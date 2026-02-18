# Havona — Implementatieplan (vervolgstappen)

Dit document vertaalt de bestaande PRD- en contractdocumenten naar een uitvoerbaar bouwplan.

## 1) Werkende ontwikkelomgeving opzetten (dag 0)

Doel: iedereen kan lokaal exact dezelfde checks draaien.

- Zorg voor Node 22+ en npm.
- Configureer npm registry toegang.
- Installeer dependencies met `npm install`.
- Verifieer basischecks:
  - `npm run typecheck`
  - `npm test`

**Definition of Done**
- Iedereen in het team kan `typecheck` en `test` lokaal uitvoeren.

## 2) Sprint 2 focus: service-implementaties (week 1)

Doel: van interfaces naar echte business flow in code.

- Implementeer services volgens `SERVICE_CONTRACTS.md`:
  - `PartyService`
  - `OpportunityService`
  - `OfferService`
  - `WorkItemService`
  - `InvoiceService`
  - `PageService`
  - `DomainService`
- Hou controllers/server actions strikt op patroon: `validate -> service -> return`.
- Retourneer overal `Result<T>` met contractuele foutcodes.

**Definition of Done**
- Elke service heeft minimaal 1 werkende implementatie met unit tests op core rules.

## 3) Persistencylaag bouwen (week 1-2)

Doel: domeinregels afdwingen in dataopslag.

- Voeg Prisma schema + migraties toe voor alle kernentiteiten uit `PRD_DataContracts.md`.
- Voeg tenant-scoped constraints/indexen toe.
- Voor factuurnummering:
  - `InvoiceSeries` of equivalente teller-structuur.
  - Atomic incrementation met row-locking.

**Definition of Done**
- Migraties draaien clean.
- Concurrency test voor factuurnummering is groen.

## 4) Error + observability hardening (week 2)

Doel: voorspelbaar runtime gedrag in productie.

- Centrale error mapper implementeren conform `PRD_ErrorModel.md`.
- `traceId` propagatie in request context.
- Structured logging per errorcategorie.
- API responses enkel via resultaat-envelope (`ok/data` of `ok/error`).

**Definition of Done**
- Geen raw exceptions naar client.
- Elke fout bevat minstens `type`, `code` en waar nodig `traceId`.

## 5) Audit trail implementeren (week 2)

Doel: historische waarheid en supporteerbaarheid.

- Voeg append-only `audit_events` opslag toe.
- Schrijf audit events bij kritieke acties (invoice/payment/status changes).
- Bewaar `meta.traceId`, actor, timestamp server-side.

**Definition of Done**
- Financiële acties en lifecycle-transities zijn reconstrueerbaar via audit events.

## 6) Eerste end-to-end vertical slice opleveren (week 3)

Doel: echte businesswaarde tonen van lead tot betaling.

- Bouw flow: `Party -> Opportunity -> Offer -> WorkItem -> Invoice -> Payment`.
- Voeg tests toe op:
  - state transitions
  - validatie
  - audit event creatie
  - error contracten

**Definition of Done**
- Één tenant kan volledige flow afwerken zonder manuele data-transfer.

## 7) Website + domeinen per tenant (week 4)

Doel: publieke tenant-sites met veilige resolutie.

- `resolvePublicPage(host, slug)` implementeren.
- `DomainMapping` verificatieflow toevoegen.
- Subdomain + custom domain routing valideren.

**Definition of Done**
- Tenant kan pagina publiceren en bereiken via subdomain of custom domain.

## 8) Delivery en productie-gereedheid (doorlopend)

Doel: veilig releasen op Hetzner/Coolify.

- CI pipeline met verplichte checks (`typecheck`, `test`).
- Staging + production omgevingsvariabelen vastleggen.
- Backup + restore runbook.
- Incident runbook voor errors/audit/trace-correlatie.

**Definition of Done**
- Elke merge loopt door CI.
- Team kan restore-test aantoonbaar uitvoeren.

## Aanbevolen onmiddellijke next action

Start met **Sprint 2, stap 2 + 3 parallel**:
1. Service-implementaties op Party/Opportunity/Offer.
2. Prisma model + migraties voor diezelfde slice.

Zo lever je snel een eerste werkende keten op zonder architectuurafwijkingen.
