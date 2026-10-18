# Flusso di lavoro dev-workflow (attivo in questo repository)

Struttura: epica → task (1 task = 1 PR, anche in stack) → passi del piano (1 passo = 1 commit).

Due fonti di verità:
- PROFILO (`DEV-WORKFLOW.md` alla root del repository, versionato): aree del progetto, comandi di
  verifica, formato delle chiavi, convenzioni, regole e template personalizzati. Il profilo prevale
  sui default del plugin.
- FILE DI LAVORO in WORK_DIR (privati, non versionati): memoria persistente di epiche e task.
  Leggili prima di agire su un task e tienili aggiornati.

WORK_DIR/
  epics/<EPIC-KEY>/      epic.md · analysis.md · tasks.md
  tasks/<TASK-KEY>/      task.md · plan.md · log.md

Convenzioni (se il profilo non ne definisce di diverse nella sezione "Convenzioni"):
- Branch `{tipo}/{key}-{slug}`: la chiave nel branch collega branch e file di lavoro, non ometterla.
- Commit `{key}: {messaggio all'imperativo}`.
- Documenti di lavoro nella lingua indicata da `docs-language` del profilo; nel codice segui le
  convenzioni del file esistente.

Regole durante lo sviluppo:
1. Niente codice per un task senza plan.md: se manca, proponi /dev-workflow:start-task.
2. Un passo alla volta. A fine passo: verifica locale con i comandi delle aree toccate (dal profilo),
   commit, poi la procedura della skill dev-workflow:checkpoint (spunta il passo, aggiorna log.md).
3. Se la verifica locale fallisce non committare: correggi o segnala.
4. Registra subito in log.md (sezione "Decisioni") ogni decisione non ovvia, con la motivazione.
5. Se il piano si rivela sbagliato fermati, proponi la modifica e aggiorna plan.md solo dopo conferma.
6. Dove coesistono pattern diversi (es. codice legacy e nuovo, come indicato nelle note del profilo),
   chiedi quale seguire se non è ovvio; niente refactoring non richiesti (proponili come task
   separati); annota nel log ciò che scopri di non ovvio sul codice.
7. Non modificare DEV-WORKFLOW.md senza conferma: è condiviso con il team. Se scopri qualcosa che
   vale la pena aggiungere alle "Note sul codebase", proponilo.
