---
name: refine-task
description: Trasforma un task vago (solo titolo o poche righe) in una specifica completa, analizzando il codice delle aree coinvolte. Usare per task già esistenti sul tracker che non sono passati da breakdown.
argument-hint: "<TASK-KEY> [EPIC-KEY] (poi incolla titolo ed eventuale descrizione)"
disable-model-invocation: true
---

# Raffinamento di un task esistente

Argomenti: `$ARGUMENTS` (primo = TASK-KEY, secondo opzionale = EPIC-KEY).

Obiettivo: produrre il testo definitivo del task, pronto per il tracker e utilizzabile come
specifica di sviluppo. **Non scrivere codice.**

PROFILO, WORK_DIR e DEFAULT DEL PLUGIN sono nella sezione "Percorsi" del contesto di sessione.
Se mancano, proponi `/dev-workflow:init` e fermati. Scrivi nella lingua `docs-language` del profilo.

1. **Raccogli l'input.** Se l'utente non ha incollato titolo/descrizione, chiediglieli e fermati.
   Se è indicata un'epica e `WORK_DIR/epics/<EPIC-KEY>/` esiste, leggi `epic.md` e `analysis.md`.
2. **Chiarisci.** Riformula in 2-3 righe cosa pensi che il task debba ottenere. Fai al massimo
   4 domande mirate, ognuna con la tua ipotesi di default. Fermati e attendi le risposte.
3. **Analizza il codice** con `dev-workflow:codebase-analyst` (sola lettura), un'istanza per ogni
   area del profilo coinvolta, passando nel prompt la scheda dell'area e domande precise.
4. **Valuta la dimensione** con le regole di scomposizione (`DEFAULT DEL PLUGIN/slicing-rules.md`
   più la sezione del profilo). Se il task supera una PR, proponi come dividerlo (titoli e
   dipendenze) invece di scrivere un unico task enorme.
5. **Scrivi la specifica** in `WORK_DIR/tasks/<TASK-KEY>/task.md` usando il "Template task" del
   profilo se presente, altrimenti `DEFAULT DEL PLUGIN/task-template.md`.
6. **Mostra all'utente** solo Obiettivo, Criteri di accettazione e Rischi/domande aperte, e chiedi
   conferma. Il testo completo è nel file.
