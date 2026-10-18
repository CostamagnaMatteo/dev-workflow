---
name: resume
description: Riprende il lavoro su un task ricostruendo lo stato da task.md, plan.md, log.md e git. Usare all'inizio di una sessione su un task già avviato.
argument-hint: "[TASK-KEY]"
disable-model-invocation: true
---

# Ripresa del lavoro

Argomento opzionale: `$ARGUMENTS` (TASK-KEY).

WORK_DIR e `ticket-pattern` sono nella sezione "Percorsi" del contesto di sessione; se mancano,
proponi `/dev-workflow:init` e fermati. Scrivi il briefing nella lingua `docs-language` del profilo.

## 1. Individua il task

- Se è indicata una TASK-KEY, usa quella. Se il branch corrente non corrisponde, chiedi se passare
  al branch indicato in `plan.md` (solo con working tree pulito).
- Altrimenti estrai la chiave dal branch corrente con `ticket-pattern`.
- Se non c'è nessuna chiave, elenca i task attivi: le cartelle in `WORK_DIR/tasks/` con almeno un
  passo non spuntato in `plan.md`, mostrando per ognuno titolo, branch e "Prossima azione" dal log.
  Chiedi quale riprendere e fermati.

## 2. Ricostruisci lo stato

Leggi `task.md`, `plan.md` e `log.md`, poi confrontali con la realtà:
- `git log --oneline <branch-base>..HEAD`
- `git status --short` e `git diff --stat`

Segnala ogni incoerenza: passi spuntati senza commit, commit non riflessi nel piano, modifiche non
committate non descritte nel log, branch base avanzato (in uno stack: il branch del task precedente
ha nuovi commit o è stato mergiato).

## 3. Briefing

Presenta un briefing di **massimo 15 righe**:

```
<TASK-KEY> — <titolo>
Obiettivo: <1 riga>
Avanzamento: <passi fatti>/<totali>
Ultimo lavoro: <dal diario, con data>
In sospeso: <modifiche non committate, se ci sono>
Decisioni da ricordare: <solo quelle che influenzano il prossimo passo>
Prossima azione: <concreta>
Attenzione: <incoerenze o bloccanti, se ci sono>
```

Poi chiedi conferma per procedere con la prossima azione. Se hai trovato incoerenze, proponi prima
come sistemarle (di solito con `/dev-workflow:checkpoint`).
