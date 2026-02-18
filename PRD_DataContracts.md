# Product Requirements Document — Data Contracts

## Havona Domain Data Specification

**Versie:** 1.0  
**Bron:** DTO & validation schema  
**Doel:** Exacte structuur van alle systeemgegevens definiëren

---

## 1. Algemene principes
1. Alle data is tenant-scoped
2. DTO ≠ database model (transportstructuur)
3. Datums zijn ISO-8601 strings
4. Bedragen zijn integer cents
5. Geen nullable chaos: optional betekent afwezig, niet null

---

## 2. Identiteit

### Party

Universele relatie (persoon of bedrijf)

| veld | type | beschrijving |
|---|---|---|
| id | string | uniek |
| tenantId | string | eigenaar |
| type | PERSON \| COMPANY | soort |
| name | string | naam |
| vatNumber | string? | btw |
| notes | string? | intern |
| roles | PartyRoleType[] | lead/klant/leverancier |
| contactPoints | PartyContactPoint[] | communicatie |
| addresses | PartyAddress[] | adressen |
| createdAt | ISO string | creatie |
| updatedAt | ISO string | wijziging |

---

### PartyContactPoint

| veld | type |
|---|---|
| id | string |
| kind | email \| phone \| custom |
| value | string |
| label | string? |
| isPrimary | boolean |

---

### PartyAddress

| veld | type |
|---|---|
| id | string |
| kind | billing \| site \| shipping |
| line1 | string |
| line2 | string? |
| postal | string |
| city | string |
| country | string |
| label | string? |
| isPrimary | boolean |

---

## 3. Verkoop

### Opportunity

| veld | type |
|---|---|
| id | string |
| tenantId | string |
| partyId | string |
| title | string |
| stage | NEW \| QUALIFIED \| PROPOSAL \| WON \| LOST |
| valueCents | number? |
| createdAt | ISO |
| updatedAt | ISO |

---

### Offer

| veld | type |
|---|---|
| id | string |
| tenantId | string |
| partyId | string |
| opportunityId | string? |
| status | DRAFT \| SENT \| ACCEPTED \| REJECTED |
| createdAt | ISO |
| updatedAt | ISO |

---

### OfferVersion

| veld | type |
|---|---|
| id | string |
| tenantId | string |
| offerId | string |
| version | number |
| title | string? |
| contentJson | object |
| createdAt | ISO |

---

## 4. Uitvoering

### WorkItem

| veld | type |
|---|---|
| id | string |
| tenantId | string |
| type | ORDER \| PROJECT |
| status | DRAFT \| ACTIVE \| DONE \| CANCELLED |
| title | string |
| primaryPartyId | string |
| offerId | string? |
| contacts | WorkItemContact[] |
| createdAt | ISO |
| updatedAt | ISO |

---

### WorkItemContact

| veld | type |
|---|---|
| partyId | string |
| role | string? |

---

## 5. Facturatie

### Invoice

| veld | type |
|---|---|
| id | string |
| tenantId | string |
| workItemId | string? |
| billToPartyId | string |
| type | STANDARD \| DEPOSIT \| CREDIT_NOTE |
| status | DRAFT \| SENT \| PARTIALLY_PAID \| PAID |
| invoiceYear | number |
| invoiceSequence | number |
| invoiceNumber | string |
| ogm | string |
| currency | string |
| totalCents | number |
| issuedAt | ISO? |
| dueAt | ISO? |
| createdAt | ISO |
| updatedAt | ISO |

---

### Payment

| veld | type |
|---|---|
| id | string |
| tenantId | string |
| invoiceId | string |
| method | BANK_TRANSFER \| CASH \| CARD \| OTHER |
| amountCents | number |
| paidAt | ISO |
| reference | string? |
| createdAt | ISO |

---

## 6. Website

### Page

| veld | type |
|---|---|
| id | string |
| tenantId | string |
| slug | string |
| title | string |
| contentJson | object |
| seoTitle | string? |
| seoDescription | string? |
| publishedAt | ISO? |
| createdAt | ISO |
| updatedAt | ISO |

---

### DomainMapping

| veld | type |
|---|---|
| id | string |
| tenantId | string |
| domain | string |
| verifiedAt | ISO? |
| createdAt | ISO |

---

## 7. Financiële regels
1. Factuurnummer = YYYY-000001
2. OGM = mod97(YYYY + sequence)
3. Payments ≤ invoice total
4. Creditnota = aparte Invoice

---

## 8. Consistentie

| regel |
|---|
| Party is enige klantbron |
| OfferVersion immutable |
| Invoice immutable na verzending |
| Payment nooit verwijderen |

---

## 9. Gebruik

Dit document is bindend voor:
- API responses
- service outputs
- exports
- webhooks

Elke afwijking = breaking change.
