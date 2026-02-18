# Product Requirements Document (PRD)

## Havona — Multi-tenant Business Operating System

**Versie:** 4.0  
**Datum:** 2026-02-18  
**Status:** Build-ready (engineering contract)

---

## 1. Doel van het systeem

Havona is een multi-tenant SaaS dat een bedrijf bestuurt vanaf eerste contact tot betaling binnen één consistente dataketen.

Het systeem verenigt:

| Interface | Functie |
|---|---|
| CRM | Relaties en verkoop |
| Operations | Opdrachten en uitvoering |
| Billing | Facturatie en betalingen |
| Website | Publieke pagina’s en leads |

**Fundamentele regel**

Het systeem bestaat uit één bedrijfsmodel.  
Interfaces tonen dezelfde data op verschillende manieren.

Er bestaan dus geen aparte CRM- of ERP-databronnen.

---

## 2. Productvisie

Bedrijven verliezen tijd door:
- dubbele invoer
- synchronisatie tussen tools
- handmatige overdracht van verkoop naar administratie

Havona elimineert dit via één flow:

Bezoeker  
→ Party  
→ Opportunity  
→ Offer  
→ WorkItem  
→ Invoice  
→ Payment

Elke stap bouwt verder op dezelfde entiteiten.

---

## 3. Doelstellingen

### Business
- MVP binnen 12 weken live
- 10 betalende tenants binnen 90 dagen
- 50% van tenants gebruikt facturatie

### Product
- eerste factuur < 20 min
- website live < 10 min
- nul duplicaat klanten
- nul handmatige data-transfer

---

## 4. Kernarchitectuurprincipe

Het systeem is entity-driven.

Niet modules bouwen.  
Maar processen rond entiteiten.

| Entiteit | Betekenis |
|---|---|
| Party | relatie |
| Opportunity | verkoopkans |
| Offer | voorstel |
| WorkItem | uitvoering |
| Invoice | schuld |
| Payment | vereffening |

---

## 5. Domeinmodel

### 5.1 Identiteit

#### Party
Persoon of bedrijf.

Kan rollen hebben:
- lead
- klant
- leverancier

#### ContactPoint
Email / telefoon.

#### Address
Facturatie / werf / levering.

---

### 5.2 Commerciële keten

#### Opportunity
Verkoopintentie.

#### Offer
Offertecontainer.

#### OfferVersion
Onveranderlijke revisies.

#### WorkItem
Uitvoeringseenheid.

Types:
- ORDER
- PROJECT

#### Invoice
Financiële verplichting.

#### Payment
Betaling of voorschot.

---

### 5.3 Website

#### LeadCapture
Formulier → maakt Party + Opportunity

#### Page
Publieke content

#### DomainMapping
Domein → tenant

---

## 6. Gedragsregels (state machines)

### Opportunity
NEW → QUALIFIED → PROPOSAL → WON/LOST  
WON en LOST zijn locked

---

### Offer
DRAFT → SENT → ACCEPTED/REJECTED
- ACCEPTED creëert WorkItem
- revisie = nieuwe OfferVersion
- bestaande versie immutable

---

### WorkItem
DRAFT → ACTIVE → DONE/CANCELLED
- facturen enkel vanaf ACTIVE
- DONE read-only

---

### Invoice
DRAFT → SENT → PARTIALLY_PAID → PAID
- bedragen locked vanaf SENT
- wijzigingen enkel via creditnota

---

### Payment
- nooit verwijderen
- max bedrag = factuurbedrag

---

## 7. Dataconsistentie
1. Alles start vanuit Party
2. Factuur vereist Party
3. OfferVersion immutable
4. Invoice immutable na verzending
5. Payment historisch permanent

---

## 8. Factuurnummering (België)

Per tenant en per jaar:

`YYYY-000001`

Bron: InvoiceSeries

### OGM
Afgeleid van:

`YYYY + sequence → mod97`

Server-side gegenereerd.

Atomic via database lock.

---

## 9. Multi-tenant veiligheid

Elke tabel bevat `tenant_id`.

Beveiligingslagen:
1. Auth guard
2. Service guard
3. Repository scoping
4. Database unique constraints
5. Row locking bij nummering

Cross-tenant toegang onmogelijk.

---

## 10. Website werking

Publieke site is read-only view op data.

Eigenschappen:
- subdomain routing
- custom domains
- SSL automatisch
- statisch renderbaar
- formulieren → server → domain entities

---

## 11. Niet-functionele eisen

### Performance
API p95 < 500 ms  
Page LCP < 2.5 s

### Beschikbaarheid
99.9% target

### Security
Server-side mutations only  
Audit logs op financiële acties

### Backup
Dagelijks + restore tests

---

## 12. Technologie

Next.js App Router  
PostgreSQL  
Prisma ORM  
Coolify deploy  
Hetzner VPS

---

## 13. Delivery methode

Vertical slice verplicht:

Elke feature bevat:
- service
- domain rules
- repository
- tests
- logging

Niet toegestaan:
- directe DB calls vanuit UI
- business rules in controllers

---

## 14. MVP scope

### Inbegrepen
Parties  
Opportunities  
Offers  
WorkItems  
Invoices  
Payments  
Pages  
Domains

### Niet inbegrepen
boekhouding  
BTW automatisatie  
plugins  
marketing automation

---

## 15. Acceptatiecriteria
- Website lead → factuur zonder duplicatie
- Gelijktijdige facturen geen nummerconflict
- Data lek tussen tenants onmogelijk
- Project met meerdere facturen mogelijk

---

## 16. Kritische ontwerpregel

Havona is een bedrijfsmodel, geen softwaremodules.

Elke implementatie moet domeinconsistentie behouden.

---

## 17. Volgende fase

Service layer contracten definiëren  
→ bepaalt backend structuur
