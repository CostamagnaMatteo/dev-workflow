# Regole di scomposizione (default del plugin)

Valgono sempre, salvo quando la sezione "Regole di scomposizione" del profilo le modifica
esplicitamente. Le regole del profilo si aggiungono a queste; in caso di contrasto prevale il profilo.

1. **Un task = una PR** revisionabile in circa 30 minuti (indicativamente fino a ~400 righe
   modificate, esclusi file generati e test). Se è più grande, va diviso.
2. **Ogni task è mergiabile da solo** senza rompere il branch principale. Se serve, prevedi un
   feature flag o rendi la modifica retrocompatibile.
3. **Preferisci fette verticali** che producono qualcosa di verificabile. Quando un'area deve
   esporre un contratto usato da un'altra (es. API usata da un frontend), separa: prima il task che
   introduce il contratto, poi quello che lo consuma, in ordine di stack.
4. **Separa il refactoring preparatorio** dalla modifica funzionale: prima il task "preparare X"
   (senza cambi di comportamento), poi il task funzionale.
5. **Niente task "scrivere i test"**: i test fanno parte di ogni task.
6. **Dipendenze esplicite**: ogni task dichiara da quali dipende; l'ordine deve essere compatibile
   con uno stack di PR.
7. **Titoli parlanti**: verbo all'infinito + oggetto + contesto
   (es. "Aggiungere filtro per stato nella lista ordini", non "Filtri ordini").
