# dev-workflow

Plugin per Claude Code che struttura il lavoro in **epica → task → piano → commit** e rende
facile riprendere il lavoro tra una sessione e l'altra. È indipendente dallo stack: ogni progetto
si descrive in un file `DEV-WORKFLOW.md` alla root del repository.

Questo repository è un piccolo marketplace con un solo plugin (`plugins/dev-workflow`).

## Installazione

Da una cartella locale:
```
/plugin marketplace add /percorso/di/dev-workflow-marketplace
/plugin install dev-workflow@matteo-tools
```

Da GitHub (consigliato, anche con repository privato):
```
/plugin marketplace add <owner>/<repo>
/plugin install dev-workflow@matteo-tools
```
Per gli aggiornamenti: incrementa `version` in `plugins/dev-workflow/.claude-plugin/plugin.json`,
fai push, poi `/plugin marketplace update matteo-tools`.

Per sviluppare il plugin: `claude --plugin-dir /percorso/plugins/dev-workflow`.

Requisito: `node` nel PATH.

## Il profilo del progetto: `DEV-WORKFLOW.md`

È il file che rende il plugin adattabile. Sta alla root del repository ed è **versionato**, quindi
è condiviso con il team. Il plugin si attiva solo nei repository che lo contengono.

```markdown
---
ticket-pattern: '[A-Z][A-Z0-9]+-\d+'   # regex della chiave nel nome del branch
main-branch: main
docs-language: italiano                # lingua di task, piani e log
---
# Nome progetto

## Aree                                 # una per parte analizzabile/verificabile
### Backend
- Percorso: src/Backend
- Stack: C# / ASP.NET Core
- Build: `dotnet build`
- Test: `dotnet test`
- Note: …

## Convenzioni                          # formato di branch, commit, PR
## Regole di scomposizione              # opzionale: si aggiunge ai default
## Template task                        # opzionale: sostituisce il default
## Note sul codebase                    # conoscenza condivisa sul codice
```

Cosa usa il plugin dal profilo:

| Elemento | Dove viene usato |
|---|---|
| Aree | `breakdown` e `refine-task` lanciano un'analisi per ogni area toccata; il campo "Area" dei task prende i valori da qui |
| Comandi di build/lint/test | Verifica locale prima di ogni commit e nei piani |
| `ticket-pattern` | Collegamento branch ↔ file di lavoro (hook, `resume`, `checkpoint`) |
| `main-branch`, Convenzioni | Nome e base dei branch, formato dei commit, stack di PR |
| Regole di scomposizione, Template task | Personalizzano `breakdown` e `refine-task` |
| `docs-language` | Lingua di tutti i documenti generati |

Il modello completo è in `plugins/dev-workflow/skills/init/references/profile-template.md`; un esempio
compilato (Angular + .NET) è in `profile-example.md` nella stessa cartella.

## Primo utilizzo in un repository

```
/dev-workflow:init
```
Claude rileva le aree (Node, .NET, Python, JVM, Go, Rust, PHP, Ruby…), ricava i comandi dai workflow
di CI, deduce le convenzioni dai branch e dai commit esistenti, ti chiede conferma e scrive
`DEV-WORKFLOW.md`. Poi verifica che `.claude/work/` sia ignorata da git (proponendo `.gitignore`
oppure `.git/info/exclude`) e prepara le cartelle di lavoro.

Se il repository ha già un `DEV-WORKFLOW.md`, `init` lo controlla e propone gli aggiornamenti.
Se arrivi dalla versione 0.1 con `.claude/work/config.md`, `init` lo usa per creare il profilo.

## Comandi

| Comando | A cosa serve |
|---|---|
| `/dev-workflow:init` | Crea o aggiorna il profilo e prepara la cartella di lavoro |
| `/dev-workflow:breakdown <EPIC-KEY>` | Da epica a task pronti per il tracker, con analisi per area |
| `/dev-workflow:refine-task <TASK-KEY> [EPIC-KEY]` | Da task vago a specifica completa |
| `/dev-workflow:start-task <TASK-KEY> [base]` | Branch + piano a passi (1 passo = 1 commit) + log |
| `/dev-workflow:checkpoint [nota]` | Aggiorna piano e log con lo stato reale di git |
| `/dev-workflow:resume [TASK-KEY]` | Briefing per riprendere il lavoro |

Il plugin include anche il subagent `codebase-analyst` (analisi in sola lettura di un'area) e un hook
`SessionStart` che, all'avvio, dopo `/clear` e dopo la compattazione, carica regole del flusso,
profilo e stato del task del branch corrente.

## Ciclo tipico

1. `/dev-workflow:breakdown PROJ-500` + testo dell'epica → rivedi `tasks.md` → crea i task sul tracker
   → comunica le chiavi ("T1 = PROJ-501…").
2. `/dev-workflow:start-task PROJ-501` → piano approvato.
3. Un passo alla volta: verifica locale, commit, checkpoint automatico.
   **Prima di chiudere la sessione: `/dev-workflow:checkpoint`.**
4. Il giorno dopo: checkout del branch, `claude`, `/dev-workflow:resume`.

## File di lavoro (privati, non versionati)
```
.claude/work/
  epics/<EPIC-KEY>/   epic.md · analysis.md · tasks.md
  tasks/<TASK-KEY>/   task.md · plan.md · log.md
```
Stanno sempre nel repository principale: l'hook li trova anche da un git worktree. Le chiavi
diventano nomi di cartella, quindi devono essere compatibili con il file system (per GitHub Issues
usa un prefisso, es. `GH-123`, con `ticket-pattern: 'GH-\d+'`).
