---
name: breakdown
description: Scompone un'epica in task ben definiti, pronti da incollare sul tracker, analizzando il codice delle aree del progetto definite in DEV-WORKFLOW.md. Usare quando l'utente incolla un'epica da suddividere.
argument-hint: "<EPIC-KEY> (poi incolla titolo e descrizione dell'epica)"
disable-model-invocation: true
---

# Scomposizione di un'epica in task

Epica: `$ARGUMENTS`

Obiettivo: trasformare un'epica in un insieme di task chiari, ordinati e verificabili, ognuno
realizzabile come una singola PR (eventualmente in uno stack). **Non scrivere codice e non
modificare file del progetto**: produci solo documenti in `WORK_DIR/epics/<EPIC-KEY>/`.

## Prerequisiti

PROFILO, WORK_DIR e DEFAULT DEL PLUGIN sono nella sezione "Percorsi" del contesto di sessione.
Se mancano, il repository non ha un profilo: proponi `/dev-workflow:init` e fermati.

Dal profilo usa:
- **Aree**: per l'analisi (passo 3) e per il campo "Area" dei task;
- **Regole di scomposizione**: le regole in `DEFAULT DEL PLUGIN/slicing-rules.md` più quelle del
  profilo (prevale il profilo);
- **Template task**: quello del profilo se la sezione non è vuota, altrimenti
  `DEFAULT DEL PLUGIN/task-template.md`;
- **docs-language**: lingua di tutti i documenti prodotti.

## Passo 1 — Raccogli l'epica

- Se l'utente non ha incollato titolo e descrizione dell'epica, chiediglieli e fermati.
- Crea `WORK_DIR/epics/<EPIC-KEY>/epic.md` con il testo **originale, senza modifiche**, sotto
  `## Testo originale`. Se la cartella esiste già, leggila e chiedi se ripartire o continuare.

## Passo 2 — Comprendi e chiarisci

- Riformula in 3-5 righe cosa deve essere vero alla fine dell'epica (risultato, non attività).
- Elenca ambiguità, assunzioni implicite e casi limite non coperti.
- Fai **al massimo 5 domande mirate**, numerate, ognuna con la tua ipotesi di risposta
  ("Se non specifichi, assumo che…"). Fermati e attendi le risposte.
- Registra domande e risposte in `epic.md` sotto `## Chiarimenti`.

## Passo 3 — Analizza il codice impattato

Individua quali aree del profilo sono toccate dall'epica (in caso di dubbio includila). Lancia in
parallelo un subagent `dev-workflow:codebase-analyst` **per ogni area toccata**. Nel prompt di
ciascuno includi:
- la scheda dell'area copiata dal profilo (percorso, stack, comandi, note);
- le note sul codebase del profilo, se pertinenti;
- domande precise, ad esempio: cosa implementa oggi la funzionalità toccata, come scorre il dato
  attraverso l'area e verso le altre aree, quali parti seguono pattern diversi (es. legacy/nuovo),
  quali test esistono, quali punti sono fragili.

Sintetizza i risultati in `WORK_DIR/epics/<EPIC-KEY>/analysis.md`:

```
# Analisi <EPIC-KEY>
## Flusso attuale            (end-to-end, attraverso le aree)
## Aree impattate
| Area | File / componenti (percorsi reali) | Pattern | Note |
## Contratti tra aree        (API, eventi, schemi condivisi che cambiano)
## Test esistenti
## Rischi e punti fragili
## Lavoro preparatorio consigliato
```

## Passo 4 — Scomponi in task

Applica le regole di scomposizione (default + profilo). Usa ID provvisori `T1`, `T2`, … finché
l'utente non fornisce le chiavi del tracker.

## Passo 5 — Scrivi `tasks.md`

Crea `WORK_DIR/epics/<EPIC-KEY>/tasks.md` con:

1. Una tabella riassuntiva:

| # | ID | Titolo | Area | Taglia | Dipende da | Stack |
|---|----|--------|------|--------|------------|-------|

   Nella colonna Stack indica il raggruppamento in stack (es. "Stack A, posizione 2").

2. Per ogni task, il testo completo secondo il template scelto. Il testo deve essere comprensibile
   **senza conoscere la conversazione**: è ciò che il team leggerà sul tracker e ciò che una
   sessione futura userà come specifica.

## Passo 6 — Revisione con l'utente

Mostra la tabella riassuntiva e un commento di poche righe sulle scelte di scomposizione (cosa hai
separato e perché, dove vedi più rischio). Non ristampare tutti i task in chat: sono nel file.
Itera sulle osservazioni dell'utente aggiornando `tasks.md`.

Quando l'utente comunica le chiavi create sul tracker (es. "T1 = PROJ-501"), sostituisci gli ID
provvisori in `tasks.md` e aggiungi in fondo una sezione `## Mappatura chiavi`. Verifica che ogni
chiave rispetti `ticket-pattern` del profilo; se no, segnalalo (il collegamento con i branch non
funzionerebbe).
