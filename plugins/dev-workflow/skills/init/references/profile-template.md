---
# Espressione regolare che riconosce la chiave di un task nel nome del branch.
# Esempi: Jira/Linear '[A-Z][A-Z0-9]+-\d+' · GitHub Issues con prefisso 'GH-\d+'
ticket-pattern: '[A-Z][A-Z0-9]+-\d+'
main-branch: main
docs-language: italiano
---
# <Nome del progetto>

<Una o due righe su cosa fa il progetto e per chi.>

Tracker: <Jira | Linear | GitHub Issues | …> · Review: <es. 2 approvazioni richieste>

## Aree

<!-- Un'area per ogni parte del sistema analizzabile e verificabile in modo indipendente.
     Campi: Percorso e Stack obbligatori; Build/Lint/Test quando esistono; Note libere. -->

### <Nome area>
- Percorso: <cartella>
- Stack: <linguaggio / framework / versione>
- Build: `<comando>`
- Lint: `<comando>`
- Test: `<comando>` (singolo progetto/modulo: `<comando con segnaposto>`)
- Note: <pattern da seguire, parti legacy, insidie>

## Convenzioni
- Branch: `{tipo}/{key}-{slug}` (tipo: feature, fix, refactor)
- Commit: `{key}: {messaggio}`
- PR: <es. stack con gh-stack, titolo "{key} {titolo}">

## Regole di scomposizione
<!-- Opzionale. Si aggiungono alle regole di default del plugin e prevalgono in caso di contrasto. -->

## Template task
<!-- Opzionale. Se presente sostituisce interamente il template di default del plugin. -->

## Note sul codebase
<!-- Conoscenza utile a chiunque lavori sul progetto: moduli fragili, dipendenze nascoste, convenzioni implicite. -->
