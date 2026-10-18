# Template di un task (default del plugin)

Si usa quando il profilo non definisce una sezione "Template task". Le intestazioni vanno tradotte
nella lingua indicata da `docs-language` del profilo. Le sezioni vuote si omettono solo se davvero
non pertinenti.

---

### [<ID>] <Titolo: verbo all'infinito + oggetto + contesto>

**Tipo:** Feature | Refactoring preparatorio | Bugfix | Debito tecnico
**Area:** <una o più aree definite nel profilo>
**Taglia:** S (≤ ½ giorno) | M (≤ 2 giorni) | L (da spezzare se possibile)
**Dipende da:** <ID o —>
**Epica:** <EPIC-KEY>

#### Contesto
Perché serve questo task e come si collega all'epica. 2-4 righe, comprensibili da chi non ha seguito l'analisi.

#### Obiettivo
Cosa sarà vero dopo il merge, in 1-2 frasi. Descrive un risultato osservabile, non un'attività.

#### Ambito
- Cosa è incluso.

#### Fuori ambito
- Cosa è escluso esplicitamente (e, se utile, in quale task verrà fatto).

#### Criteri di accettazione
- [ ] Ogni criterio è verificabile da un revisore o da un test.
- [ ] Formula preferita: "Dato <situazione>, quando <azione>, allora <risultato>".
- [ ] Includere almeno un caso limite o di errore se pertinente.

#### Note tecniche
- File, componenti, endpoint, tabelle coinvolti (percorsi reali dal codice).
- Approccio suggerito e pattern da seguire.
- Vincoli: retrocompatibilità, feature flag, migrazioni.

#### Test attesi
- Unit / integrazione / e2e: cosa deve essere coperto.

#### Rischi e domande aperte
- Punti incerti da chiarire prima o durante lo sviluppo.
