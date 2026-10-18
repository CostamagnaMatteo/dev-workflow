---
ticket-pattern: '[A-Z][A-Z0-9]+-\d+'
main-branch: main
docs-language: italiano
---
# Gestionale (esempio: Angular + .NET con codice legacy)

Applicazione web gestionale con frontend Angular e backend ASP.NET.

Tracker: Jira (epiche definite dallo scrum master) · Review: 2 approvazioni richieste

## Aree

### Backend
- Percorso: src/Backend
- Stack: C# / ASP.NET Core
- Build: `dotnet build src/Backend/Backend.sln`
- Test: `dotnet test src/Backend/Backend.sln` (singolo progetto: `dotnet test <percorso .csproj>`)
- Note: coesistono moduli legacy e moduli nuovi con pattern diversi; seguire il pattern del modulo
  che si sta modificando e chiedere in caso di dubbio.

### Frontend
- Percorso: src/Frontend
- Stack: Angular
- Lint: `npx ng lint`
- Test: `npx ng test --watch=false`
- Note: verificare se il componente usa il pattern legacy o quello nuovo prima di estenderlo.

## Convenzioni
- Branch: `{tipo}/{key}-{slug}` (tipo: feature, fix, refactor)
- Commit: `{key}: {messaggio}`
- PR: stacked PR con l'estensione gh-stack; prima il task che introduce un contratto API, poi quello che lo consuma.

## Regole di scomposizione
- Le modifiche allo schema del database vanno in un task dedicato, prima di quelli che le usano.

## Template task

## Note sul codebase
