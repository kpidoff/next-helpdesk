# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.0.9] - 2024-12-19

### Corrigé
- **StatusSelect** : Correction de l'affichage des labels au lieu des valeurs
  - Ajout de la prop `category` aux composants `StatusChip` dans `StatusSelect`
  - Les statuts affichent maintenant correctement leurs labels au lieu de leurs valeurs
  - Résolution du problème où les statuts personnalisés affichaient "OPEN" au lieu de "Ouvert"

### Technique
- Amélioration de la cohérence entre `StatusSelect` et `StatusChip`
- Utilisation correcte des statuts spécifiques à la catégorie dans tous les composants

## [1.0.8] - 2024-12-19

### Corrigé
- **TicketDetailDialog** : Correction de l'erreur MUI "out-of-range value" pour les statuts personnalisés
  - Ajout de la prop `category={ticket.category}` au composant `StatusSelect`
  - Utilisation des statuts spécifiques à la catégorie au lieu des statuts globaux
  - Résolution du problème où les statuts personnalisés (comme "OPEN") n'étaient pas reconnus

### Amélioré
- **TicketDetailDialog** : Optimisation avec les utilitaires de `@/utils`
  - Remplacement des fonctions hardcodées `getStatusColor` et `getPriorityColor` par les utilitaires centralisés
  - Utilisation de `getStatusColor`, `getStatusLabel`, `getPriorityColor` et `getPriorityLabel` depuis les modules utils
  - Amélioration de la cohérence et de la maintenabilité du code
  - Support des couleurs et labels configurables via la configuration du helpdesk

### Technique
- Suppression du code dupliqué dans `TicketDetailDialog`
- Utilisation des utilitaires centralisés pour une meilleure architecture
- Support complet des statuts personnalisés par catégorie

## [1.0.7] - 2024-12-19

### Corrigé
- **TicketList** : Correction du type TypeScript pour la mise à jour des tickets
  - Changement de `CreateTicketFormData` vers `UpdateTicketFormData` dans l'interface
  - Ajout de la gestion complète des champs `status`, `hoursSpent`, `startDate` et `endDate` dans `handleUpdateTicket`
  - Résolution du problème où les modifications de statut et de suivi du temps n'étaient pas transmises

### Amélioré
- Mise à jour locale complète des tickets après modification
- Meilleure cohérence des types entre les composants

## [1.0.6] - 2024-12-19

### Corrigé
- **useKanbanBoard** : Correction du type TypeScript pour la conversion des tickets en cartes Kanban
  - Ajout de valeurs par défaut pour `comments` et `attachments` lors de la conversion
  - Résolution de l'incompatibilité entre `Comment[] | undefined` et `any[]`
  - Amélioration de la robustesse du code avec des tableaux vides par défaut

## [1.0.5] - 2024-12-19

### Corrigé
- **TicketList** : Correction du type TypeScript pour la mise à jour des tickets
  - Changement de `CreateTicketFormData` vers `UpdateTicketFormData` dans l'interface
  - Ajout de la gestion complète des champs `status`, `hoursSpent`, `startDate` et `endDate` dans `handleUpdateTicket`
  - Résolution du problème où les modifications de statut et de suivi du temps n'étaient pas transmises

### Amélioré
- Mise à jour locale complète des tickets après modification
- Meilleure cohérence des types entre les composants

## [1.0.4] - 2024-12-19

### Corrigé
- **useKanbanBoard** : Correction du type TypeScript pour la conversion des tickets en cartes Kanban
  - Ajout de valeurs par défaut pour `comments` et `attachments` lors de la conversion
  - Résolution de l'incompatibilité entre `Comment[] | undefined` et `any[]`
  - Amélioration de la robustesse du code avec des tableaux vides par défaut

## [1.0.3] - 2024-12-19

### Corrigé
- **TicketDetailDialog** : Amélioration de la gestion asynchrone des opérations
  - Les fonctions `onUpdateTicket`, `onAddComment` et `onCloseTicket` sont maintenant correctement typées comme `Promise<void>`
  - Ajout d'états de chargement spécifiques (`updateLoading`, `closeLoading`, `chatLoading`) pour chaque opération
  - Les boutons affichent des indicateurs de chargement appropriés ("Sauvegarde...", "Clôture...")
  - Prévention des actions multiples pendant les opérations asynchrones
  - Gestion robuste des erreurs avec try/catch/finally

### Amélioré
- **TicketList** : Mise à jour des types d'interface pour correspondre aux nouvelles signatures asynchrones
- Meilleure expérience utilisateur avec des feedback visuels pendant les opérations
- Gestion cohérente des états de chargement dans toute l'application

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