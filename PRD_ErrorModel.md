# Product Requirements Document — Error Model

## Havona Domain Error Contract

**Versie:** 1.0  
**Datum:** 2026-02-18  
**Status:** Bindend systeemcontract

---

## 1. Doel

Dit document definieert hoe het systeem fouten behandelt, structureert en communiceert.

Het doel is:
- voorspelbare UI-reacties
- reproduceerbare supportgevallen
- veilige API-integraties
- geen leaky database errors

Geen enkele endpoint retourneert ongestructureerde fouten.

---

## 2. Algemene principes
1. Elke mutatie retourneert `Result<T>`
2. Backend gooit geen ongecontroleerde exceptions
3. Client behandelt enkel `error.code`
4. Messages zijn menselijk, codes zijn contractueel
5. Database fouten worden vertaald naar domeinfouten

---

## 3. Result structuur

Succes:

```json
{
  "ok": true,
  "data": {}
}
```

Fout:

```json
{
  "ok": false,
  "error": {
    "type": "BUSINESS_RULE_ERROR",
    "code": "INVALID_STATE_TRANSITION",
    "message": "Invoice cannot be modified after sending"
  }
}
```

---

## 4. Foutcategorieën

| Type | Betekenis | HTTP |
|---|---|---|
| VALIDATION_ERROR | input ongeldig | 400 |
| BUSINESS_RULE_ERROR | domeinregel overtreden | 422 |
| CONFLICT_ERROR | gelijktijdig conflict | 409 |
| NOT_FOUND | resource bestaat niet | 404 |
| PERMISSION_DENIED | onvoldoende rechten | 403 |
| SYSTEM_ERROR | onverwachte fout | 500 |

---

## 5. Error codes (contract)

### Auth & toegang
- AUTH_REQUIRED
- TENANT_REQUIRED
- PERMISSION_DENIED

### Generiek
- VALIDATION_FAILED
- NOT_FOUND
- CONFLICT

### Domeinregels
- INVALID_STATE_TRANSITION
- IMMUTABLE_RESOURCE
- PAYMENT_EXCEEDS_TOTAL
- INVOICE_NOT_SENDABLE
- WORKITEM_NOT_INVOICEABLE
- OFFER_NOT_ACCEPTABLE
- DUPLICATE_RESOURCE

### Infrastructuur
- DB_ERROR
- UNKNOWN

Deze lijst is API-stabiel en versioneerbaar.

---

## 6. Validatiefouten

Validatiefouten bevatten veldinformatie:

```json
{
  "type": "VALIDATION_ERROR",
  "code": "VALIDATION_FAILED",
  "fieldIssues": [
    { "path": "name", "message": "Required" },
    { "path": "addresses[0].postal", "message": "Invalid format" }
  ]
}
```

Regels:
- paden zijn dot-notation
- meerdere fouten toegestaan
- UI mag inline tonen

---

## 7. Domeinfouten

Ontstaan door bedrijfsregels.

Voorbeelden:
- factuur wijzigen na verzending
- betaling groter dan saldo
- status overslaan

Deze fouten bevatten optioneel context:

```json
{
  "code": "INVALID_STATE_TRANSITION",
  "details": {
    "from": "PAID",
    "to": "DRAFT"
  }
}
```

---

## 8. Concurrency fouten

Ontstaan door parallel gebruik.

Voorbeelden:
- dubbele factuurnummers
- gelijktijdige statusupdate

HTTP: 409

---

## 9. System errors

Nooit intern detail tonen.

```json
{
  "type": "SYSTEM_ERROR",
  "code": "UNKNOWN",
  "traceId": "req_9a2f..."
}
```

TraceId verplicht voor logging correlatie.

---

## 10. Logging & audit

| Type | Logniveau |
|---|---|
| VALIDATION | info |
| BUSINESS | warn |
| CONFLICT | warn |
| PERMISSION | warn |
| SYSTEM | error |

SYSTEM_ERROR bevat stacktrace in server logs.

---

## 11. UI gedrag

Frontend mag:

| type | gedrag |
|---|---|
| VALIDATION | veld markeren |
| BUSINESS | toast |
| CONFLICT | reload voorstel |
| PERMISSION | blokkeren |
| SYSTEM | algemene foutmelding |

Frontend mag nooit businesslogica herhalen.

---

## 12. Compatibiliteit

Nieuwe error codes:
- mogen toegevoegd worden
- mogen nooit verwijderd worden

Bestaande codes veranderen = breaking change.

---

## 13. Acceptatiecriteria
1. Geen endpoint retourneert raw error
2. Elke fout heeft type + code
3. UI kan elke fout behandelen zonder parsing
4. Support kan fout traceren via traceId

---

## 14. Samenvatting

Het foutmodel is een kernonderdeel van het domein.

Het systeem beschouwt fouten als data, niet als uitzonderingen.
