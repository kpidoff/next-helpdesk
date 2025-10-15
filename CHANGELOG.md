# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.5.2] - 2025-10-15

### Documentation
- **CHANGELOG** : Ajout de la documentation complète pour la version 1.4.0
  - Documentation détaillée du système de suivi du temps
  - Documentation du composant TestsTable et de ses fonctionnalités
  - Documentation du système d'alertes anti-doublons
  - Section Architecture expliquant l'API simplifiée

- **README** : Ajout d'une section "Architecture & API"
  - Explication détaillée du principe de l'API simplifiée avec un seul callback
  - Exemples de code montrant comment les opérations internes fonctionnent
  - Documentation des avantages de cette approche (API simple, pas de breaking changes, flexibilité, encapsulation)
  - Exemple complet d'implémentation avec Prisma
  - Ajout d'une section "Nouvelles fonctionnalités (v1.4.0+)" dans les features
  - Documentation du suivi du temps et de la gestion des tests

## [1.5.1] - 2025-10-15

### Corrigé
- **TestsTable** : Correction du mode édition/visualisation pour les tests
  - Le bouton "Ajouter un test" est maintenant visible uniquement en mode édition
  - Les boutons "Ajouter un commentaire" et "Supprimer le test" sont masqués en mode visualisation
  - Le chip de statut n'est plus cliquable en mode visualisation (pas d'effet hover, curseur normal)
  - Le bouton "Ouvrir le test" reste visible en mode visualisation pour consultation
  - Meilleure distinction visuelle entre les modes édition et visualisation

### Technique
- Utilisation de la prop `disabled` pour contrôler l'affichage des actions
- Gestion conditionnelle du onClick et des styles du chip de statut

## [1.5.0] - 2025-10-15

### Ajouté
- **Champ "Nom de la branche"** : Nouveau champ de texte libre dans la section Administrateur
  - Ajout du champ `branchName` dans l'interface `Ticket` et le schéma de validation
  - Champ positionné juste au-dessus de la liste des tests
  - Affichage en mode édition (TextField) et visualisation (texte simple)
  - Placeholder et helper text pour guider l'utilisateur (ex: "feature/ticket-123")
  - Validation : maximum 100 caractères

- **Suppression des tests** : Nouvelle fonctionnalité de gestion des tests
  - Ajout d'un bouton rouge avec icône de suppression pour chaque test
  - Confirmation avant suppression avec dialog natif
  - Nouvelle prop `onDeleteTest` dans `TestsTable` et `TimeTrackingFields`
  - Fonction `handleDeleteTest` dans `TicketDetailDialog` qui filtre le tableau des tests
  - Bouton désactivé en mode `disabled`

### Amélioré
- **Interface utilisateur des statuts** : Remplacement des popups par des menus déroulants
  - **TimeTrackingFields** : Le dialog de changement de statut lors de la saisie du temps passé a été remplacé par un `Collapse` avec menu déroulant inline
    - Apparence plus moderne avec fond bleu clair et bordure
    - Animation fluide avec `Collapse` (timeout 300ms)
    - Changement immédiat du statut lors de la sélection
  - **TestsTable** : Le dialog de changement de statut des tests a été remplacé par un `Menu` contextuel
    - S'ouvre au clic sur le chip de statut
    - Menu déroulant positionné à côté du chip
    - Liste des statuts avec emojis (⏳ En attente, 👁 En cours, ✓ Validé, ✗ Échoué)

- **Système anti-doublons pour les alertes**
  - Implémentation d'un système de debounce avec `useRef`
  - Les alertes identiques ne s'affichent pas si elles sont déclenchées dans un intervalle de 1 seconde
  - Résolution du problème d'alertes en double lors de l'ajout de commentaires sur les tests
  - Fonction `showAlert` réutilisable pour toutes les alertes de l'application

- **Améliorations visuelles des commentaires de tests**
  - Utilisation de `Stack` avec espacement approprié entre l'avatar et le nom de l'utilisateur
  - Augmentation de l'espace entre l'en-tête du commentaire et son contenu (mb: 2)
  - Meilleure lisibilité et cohérence visuelle

### Technique
- Suppression des imports `Dialog`, `DialogTitle`, `DialogContent`, `DialogActions` et `Button` non utilisés dans `TimeTrackingFields`
- Ajout de l'import `Collapse` dans `TimeTrackingFields`
- Ajout de l'import `Menu` dans `TestsTable`
- Ajout de l'import `Delete` dans `TestsTable`
- Optimisation des re-renders avec gestion d'état améliorée
- Code plus maintenable avec moins de popups modaux

## [1.4.0] - 2025-10-15

### Ajouté
- **Système de suivi du temps (Time Tracking)** : Nouveaux champs pour gérer le temps et la planification
  - `estimatedHours` : Temps estimé pour compléter le ticket (en heures)
  - `hoursSpent` : Temps réellement passé sur le ticket (en heures)
  - `startDate` : Date et heure de début du travail sur le ticket
  - `endDate` : Date et heure de fin du travail (calculée automatiquement)
  - Calcul automatique de l'écart entre temps estimé et temps passé
  - Indicateurs visuels : rouge pour dépassement, vert pour en avance
  - Proposition de changement de statut lors de la saisie du temps passé

- **Composant TestsTable** : Gestion complète des tests pour les tickets
  - Ajout de tests avec URL, statut et commentaires
  - Suivi de la progression des tests (⏳ En attente, 👁 En cours, ✓ Validé, ✗ Échoué)
  - Système de commentaires pour chaque test
  - Affichage de l'auteur et de la date de création
  - Accordéon pour afficher/masquer les commentaires
  - Bouton pour ouvrir directement les URL de test
  - Support complet des tests dans l'interface Ticket

- **Composant TimeTrackingFields** : Interface complète pour le suivi du temps
  - Champs de date de début et de fin avec sélecteur datetime-local
  - Calcul automatique de la date de fin basé sur le temps passé
  - Affichage de l'écart temps estimé vs temps passé
  - Messages informatifs sur le calcul automatique
  - Interface responsive avec grille Material-UI

### Amélioré  
- **Système d'alertes** : Prévention des notifications redondantes
  - Les alertes identiques ne s'affichent plus plusieurs fois
  - Amélioration de l'expérience utilisateur
  - Réduction de la pollution visuelle

- **TicketDetailDialog** : Intégration complète des nouveaux composants
  - Section "Administrateur" avec TimeTrackingFields
  - Affichage des informations de suivi du temps en mode visualisation
  - Gestion des tests avec TestsTable intégré
  - Handlers pour ajouter, mettre à jour et commenter les tests

### Technique
- Extension du schéma `updateTicketSchema` avec les nouveaux champs
- Ajout des types `TestItem` et `TestComment` dans les types
- Export des nouveaux composants dans l'index principal
- +968 lignes de code ajoutées pour ces fonctionnalités
- Compatibilité avec Prisma et autres ORM

### Architecture
- **API simplifiée** : Aucun nouveau callback requis pour gérer les tests
  - Toutes les opérations de tests (ajout, modification, suppression, commentaires) passent par le callback `onUpdateTicket` existant
  - Le composant `TicketDetailDialog` gère en interne la logique de manipulation du tableau de tests
  - L'utilisateur du package reçoit simplement le tableau de tests mis à jour via `onUpdateTicket(ticketId, { tests: updatedTests })`
  - **Aucune breaking change** : Le code existant continue de fonctionner sans modification
  - Encapsulation complète de la logique métier des tests dans les composants

## [1.3.5] - 2024-12-19

### Corrigé
- **Exports** : Ajout de `TagChip` et `TagSelect` dans les exports principaux
  - `TagChip` et `TagSelect` sont maintenant disponibles pour l'import direct depuis `@next-helpdesk/core`
  - Correction de l'export manquant qui empêchait l'utilisation de ces composants

## [1.3.4] - 2024-12-19

### Corrigé
- **TicketDetailDialog** : Correction du problème de flash lors de la sauvegarde des tickets
  - Le `useEffect` ne réinitialise plus le formulaire si l'utilisateur est en train d'éditer
  - Utilisation de `useMemo` pour mémoriser les valeurs par défaut et éviter les recalculs inutiles
  - Réinitialisation explicite du formulaire avec les nouvelles données après la sauvegarde
  - Élimination du "flash" où les anciennes données s'affichaient brièvement avant les nouvelles

### Amélioré
- **TicketList** : Optimisation de la mise à jour locale du ticket sélectionné
  - Ajout de `updatedAt` dans la mise à jour locale pour une meilleure cohérence
  - Amélioration de la gestion d'état pour éviter les re-renders inutiles

- **Page principale** : Optimisation de la fonction `handleUpdateTicket`
  - Création d'un objet de mise à jour optimisé avec seulement les champs modifiés
  - Réduction des mises à jour d'état inutiles

### Technique
- Amélioration des performances avec moins de re-renders
- Code optimisé avec `useMemo` et mises à jour conditionnelles
- Meilleure expérience utilisateur avec des transitions fluides

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