# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.0.2] - 2024-12-19

### Corrigé
- **CreateTicketForm** : Correction de la gestion asynchrone du formulaire de création de ticket
  - La fonction `onSubmit` est maintenant correctement typée comme `Promise<void>`
  - Ajout d'un état de chargement local (`isSubmitting`) pour gérer l'état du bouton de création
  - Le bouton de création affiche maintenant "Création..." et reste désactivé pendant l'exécution de la fonction asynchrone
  - Gestion appropriée des erreurs avec try/catch/finally
  - Le `reset()` du formulaire n'est appelé qu'après la réussite de l'opération

### Amélioré
- Meilleure expérience utilisateur avec des indicateurs de chargement appropriés
- Gestion plus robuste des erreurs dans le processus de création de ticket

## [1.0.1] - Version précédente

### Ajouté
- Fonctionnalités de base du système de helpdesk
- Composants de formulaire de ticket
- Interface Kanban pour la gestion des tickets
- Diagrammes de Gantt
- Système de gestion des fichiers 