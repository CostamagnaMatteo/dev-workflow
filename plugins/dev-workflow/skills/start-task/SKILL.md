---
name: start-task
description: Avvia il lavoro su un task - prepara branch secondo le convenzioni del profilo, file di lavoro e piano a passi (1 passo = 1 commit). Usare all'inizio dello sviluppo di un task.
argument-hint: "<TASK-KEY> [branch-base]"
disable-model-invocation: true
---

# Avvio di un task

Argomenti: `$ARGUMENTS` (primo = TASK-KEY, secondo opzionale = branch base).

PROFILO e WORK_DIR sono nella sezione "Percorsi" del contesto di sessione; se mancano, proponi
`/dev-workflow:init` e fermati. Cartella del task: `WORK_DIR/tasks/<TASK-KEY>/`.
Scrivi i documenti nella lingua `docs-language` del profilo.

## 1. Recupera la specifica

- Verifica che TASK-KEY rispetti `ticket-pattern` del profilo; se no, segnalalo e chiedi come procedere.
- In ordine: se esiste `task.md` nella cartella del task, usalo; altrimenti cerca TASK-KEY nei file
  `WORK_DIR/epics/*/tasks.md` e copia la sezione del task in `task.md`; altrimenti chiedi
  all'utente di incollare il testo. Se è vago (solo titolo o poche righe), proponi prima
  `/dev-workflow:refine-task` e fermati.
- Se la cartella contiene già `plan.md` e `log.md`, **non ricrearla**: il task è già avviato,
  segui invece la procedura della skill `dev-workflow:resume`.

## 2. Prepara il branch

- Controlla `git status`: se ci sono modifiche non committate, fermati e chiedi cosa farne.
- Branch base: quello indicato negli argomenti; altrimenti, se il task dipende da un altro task
  ("Dipende da"), proponi il branch di quel task (stack di PR); altrimenti `main-branch` del
  profilo. Chiedi conferma della base.
- Nome del branch: formato della sezione "Convenzioni" del profilo (default `{tipo}/{key}-{slug}`),
  con slug di 3-5 parole dal titolo. Il nome deve contenere la chiave in modo che `ticket-pattern`
  la riconosca.

## 3. Pianifica

Entra in plan mode. Partendo da `task.md` (e da `analysis.md` dell'epica, se esiste), esplora il
codice e proponi un piano in cui:
- ogni passo è **un commit atomico** che lascia il codice compilabile e i test verdi;
- ogni passo indica come verificarlo, usando i comandi delle aree toccate dal profilo;
- i passi seguono l'ordine: preparazione → modifica principale → test → rifiniture;
- l'ultimo passo verifica i criteri di accettazione.

## 4. Salva il piano e il log

Dopo l'approvazione crea i due file (intestazioni nella lingua `docs-language`).

**`plan.md`**
```
# Piano <TASK-KEY> — <titolo>
Branch: <nome-branch> (base: <branch-base>)

## Passi
- [ ] 1. <titolo del passo>
      Commit: `<messaggio nel formato commit del profilo>`
      Verifica: <comando o controllo>
- [ ] 2. …

## Criteri di accettazione
(copiati da task.md, si spuntano alla fine)
```

**`log.md`**
```
# Log <TASK-KEY>

## Stato attuale
- Aggiornato: <data e ora>
- Passo corrente: 1 — <titolo>
- Prossima azione: <azione concreta ed eseguibile>
- Modifiche non committate: nessuna
- Bloccanti / domande aperte: nessuno

## Decisioni
<!-- AAAA-MM-GG — decisione — motivazione -->

## Diario
### <AAAA-MM-GG>
- Task avviato, piano approvato (<N> passi).
```

Mantieni sempre i titoli di sezione `## Passi` e `## Stato attuale` così come sono, anche se i
documenti sono in un'altra lingua: l'hook di avvio li usa per leggere lo stato.

Poi chiedi se iniziare dal passo 1.
