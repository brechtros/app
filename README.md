# Havona

Sprint 0/1 bootstrap voor een domain-gedreven, multi-tenant platform.

## Inhoud

- PRD documentatie (`PRD_v4.md`, `PRD_DataContracts.md`, `PRD_ErrorModel.md`, `SERVICE_CONTRACTS.md`, `audit.prd`)
- TypeScript/Zod contractlaag voor kernentiteiten
- Service interfaces voor Party, Opportunity, Offer, WorkItem, Invoice, Page en Domain
- Contracttests met `vitest`

## Installatievolgorde

1. Zorg dat je npm-registry bereikbaar is (standaard: `https://registry.npmjs.org/`).
2. Voer `npm install` uit.

> Je hoeft normaal **niet** eerst apart `npm install next.js` te doen.
> Omdat `next`, `react` en `react-dom` in `package.json` staan, installeert `npm install` alles in één stap.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run typecheck`
- `npm test`
