# Crypto Tax Calculator

Ce projet sert d'utilitaire pour calculer les plus-values liées à la cession d'actifs numériques, en accord avec les règles de l'administration fiscale française.

:warning: Les informations en sortie de ce programme :

- ne constituent en aucune manière un conseil fiscal ou en investissement
- ne sont exactes que dans la mesure où les informations fournies en entrée du programme sont exactes

## Utilisation

Le projet ne permet actuellement que de gérer les transactions effectuées sur Coinbase.

Pour les fournir en entrée au programme, il faut :

- obtenir auprès de Coinbase l'historique des transactions au format csv
- le placer dans le projet au chemin suivant : `data/coinbase.csv`

Pour démarrer le programme :

```bash
npm run build && npm start
```
