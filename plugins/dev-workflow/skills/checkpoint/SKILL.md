---
name: checkpoint
description: Aggiorna plan.md e log.md del task corrente con lo stato reale del lavoro. Usare dopo ogni commit di un passo del piano e prima di chiudere una sessione di lavoro.
argument-hint: "[nota libera da aggiungere al diario]"
---

# Checkpoint del task corrente

Nota opzionale dell'utente: `$ARGUMENTS`

1. **Identifica il task**: estrai la chiave dal branch corrente (`git branch --show-current`) con
   `ticket-pattern` del profilo (riportato nella sezione "Percorsi" del contesto). WORK_DIR è nella
   stessa sezione. Se il branch non contiene una chiave o la cartella del task non esiste, dillo e
   fermati.

2. **Raccogli lo stato reale** (non fidarti della memoria della conversazione):
   - commit del task: `git log --oneline <branch-base>..HEAD` (la base è indicata in `plan.md`);
   - modifiche non committate: `git status --short`.

3. **Aggiorna `plan.md`**: spunta i passi il cui commit esiste. Non spuntare passi senza commit.

4. **Aggiorna `log.md`** (nella lingua `docs-language` del profilo, mantenendo i titoli di sezione):
   - **Stato attuale**: riscrivi la sezione per intero. La "Prossima azione" deve essere concreta
     ed eseguibile a freddo, ad esempio "Implementare il metodo `X` in `path/file`, poi aggiungere
     il test in `path/test`". Evita formule vaghe come "continuare il passo 3". Se ci sono modifiche
     non committate, descrivi cosa contengono e se sono complete.
   - **Decisioni**: aggiungi le decisioni non ovvie prese dall'ultimo checkpoint, con motivazione.
   - **Diario**: aggiungi sotto la data odierna (creandola se manca) una o due righe su cosa è
     stato fatto, con gli hash dei commit, più la nota dell'utente se presente.

5. **Rispondi in una riga**: passo completato, prossima azione.

Il log deve restare compatto: "Stato attuale" non supera le 10 righe, il diario usa frasi brevi.
Il log serve a riprendere il lavoro, non a raccontarlo.
