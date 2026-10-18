---
name: init
description: Attiva il flusso dev-workflow nel repository corrente generando o aggiornando il profilo DEV-WORKFLOW.md (aree, comandi di verifica, convenzioni) e preparando la cartella di lavoro privata. Usare una volta per repository o per aggiornare il profilo.
argument-hint: ""
disable-model-invocation: true
---

# Inizializzazione di dev-workflow

Il profilo `DEV-WORKFLOW.md` sta alla root del repository ed è **versionato**: lo leggerà tutto il
team. I file di lavoro stanno invece in `WORK_DIR = <root del repo principale>/.claude/work` e
**non devono essere versionati**.

## 1. Orientati

- Root del checkout: `git rev-parse --show-toplevel`. Root del repo principale: la cartella che
  contiene il risultato di `git rev-parse --path-format=absolute --git-common-dir`.
  Se non sei in un repository git, dillo e fermati.
- Se `DEV-WORKFLOW.md` esiste già: leggilo, verifica che rispetti la struttura di
  `references/profile-template.md` (nella cartella base di questa skill), segnala sezioni mancanti
  o comandi non più validi e chiedi cosa aggiornare. Poi salta al passo 5.
- Se esiste `WORK_DIR/config.md` (versione precedente del plugin), usalo come fonte principale per
  il nuovo profilo e, a profilo creato, proponi di eliminarlo.

## 2. Rileva il progetto (sola lettura)

- **Aree**: cerca i marcatori degli stack più comuni e raggruppali per cartella. Ad esempio
  `package.json`, `angular.json`, `vite.config.*`, `next.config.*` (JS/TS) · `*.sln`, `*.csproj`
  (.NET) · `pyproject.toml`, `requirements.txt` (Python) · `pom.xml`, `build.gradle*` (JVM) ·
  `go.mod` · `Cargo.toml` · `composer.json` · `Gemfile` · migrazioni o schemi di database.
  In un monorepo ogni applicazione o servizio con comandi propri è un'area distinta; librerie
  condivise piccole possono confluire nell'area che le usa.
- **Comandi**: la fonte più affidabile sono i workflow di CI (`.github/workflows/`,
  `.gitlab-ci.yml`, `azure-pipelines.yml`…), poi gli script di `package.json`, `Makefile`, README.
- **Convenzioni**: branch principale (`git symbolic-ref refs/remotes/origin/HEAD`), formato delle
  chiavi e dei branch dai branch esistenti (`git branch -a`), formato dei commit da `git log -30 --oneline`,
  template di PR (`.github/pull_request_template.md`).
- **Note**: segnali di codice legacy o pattern coesistenti, se evidenti.

## 3. Proponi e conferma

Mostra all'utente in forma compatta: aree rilevate (con percorso, stack e comandi), formato chiavi,
branch principale, convenzioni. Chiedi correzioni, in particolare su: aree mancanti o da unire,
comandi di test rapidi per singolo modulo, lingua dei documenti (default italiano).

## 4. Scrivi il profilo

Crea `DEV-WORKFLOW.md` alla root seguendo `references/profile-template.md`. Rimuovi i commenti
segnaposto nelle sezioni compilate; lascia vuote ma presenti le sezioni opzionali
("Regole di scomposizione", "Template task", "Note sul codebase"). Ricorda all'utente che il file va
committato e che è leggibile dal team.

## 5. Prepara WORK_DIR

- Verifica che sia ignorata: dalla root del repo principale, `git check-ignore -q .claude/work/x`.
  Se non lo è, chiedi se aggiungere `.claude/work/` al `.gitignore` (condiviso) oppure a
  `.git/info/exclude` (solo locale). Non procedere senza risposta.
- Crea `WORK_DIR/epics/` e `WORK_DIR/tasks/`.

## 6. Concludi

Due righe: il flusso è attivo dalla prossima sessione (o subito dopo `/clear`); il punto di partenza è
`/dev-workflow:breakdown <EPIC-KEY>`.
