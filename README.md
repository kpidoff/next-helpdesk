# Next-Helpdesk

Une application de helpdesk moderne et complète construite avec Next.js 14 et Material-UI pour la gestion des tickets de support.

## 🌟 Fonctionnalités

- Interface utilisateur moderne et responsive
- Gestion complète des tickets de support
- **Système de rôles et permissions** (Utilisateur, Agent, Administrateur)
- **Formulaire de création de tickets** avec validation Zod
- **Vue Kanban interactive** avec glisser-déposer
- **Diagramme de Gantt** pour la visualisation temporelle
- **Composants communs réutilisables** (StatusChip, StatusSelect, PriorityChip, PrioritySelect)
- **Contexte global** pour la gestion d'état partagé
- **Avatars personnalisables** (URL, ReactNode, badges, initiales automatiques)
- **Configuration dynamique** des catégories, statuts et priorités
- **Système de commentaires** avec pièces jointes
- **Gestion des assignations** de tickets
- **Suivi du temps** (heures passées, dates de début/fin)
- Tableau de bord administrateur
- Notifications en temps réel
- Support des pièces jointes
- Système de catégorisation des tickets
- Thème personnalisable via Material-UI
- Support TypeScript complet
- Optimisé pour les performances

## 📦 Installation

```bash
# Installation des dépendances
pnpm install

# Développement
pnpm dev

# Build
pnpm build
```

## 🚀 Utilisation rapide

```tsx
import { HelpdeskApp } from '@next-helpdesk/core';

const App = () => {
  const config = {
    categories: [
      { value: 'technical', label: 'Support technique' },
      { value: 'billing', label: 'Facturation' },
    ],
    priorities: [
      { value: 'low', label: 'Basse' },
      { value: 'medium', label: 'Moyenne' },
      { value: 'high', label: 'Élevée' },
    ],
  };

  return (
    <HelpdeskApp 
      config={config} 
      userRole="admin" 
    />
  );
};
```

## 🎯 Contexte Global (HelpdeskContext)

Le contexte global gère l'état partagé de l'application, incluant la configuration, l'utilisateur actuel et la liste des utilisateurs.

### Configuration du contexte

```tsx
import { HelpdeskProvider } from '@next-helpdesk/core';

const App = () => {
  const config = {
    categories: [
      {
        value: "technical_support",
        label: "Support technique",
        statuses: [
          { value: "open", label: "Déposé", color: "primary" },
          { value: "in_progress", label: "Pris en charge", color: "warning" },
          { value: "resolved", label: "Traité", color: "success" },
          { value: "closed", label: "Fermé", color: "default" },
        ],
        defaultStatus: "open",
      },
      // ... autres catégories
    ],
    priorities: [
      { value: "low", label: "Faible", color: "success" },
      { value: "medium", label: "Normale", color: "warning" },
      { value: "high", label: "Urgente", color: "error" },
    ],
    defaultPriority: "medium",
    allowFileUpload: true,
    maxFileSize: 5,
    enableNotifications: true,
  };

  const currentUser = {
    id: "1",
    name: "Jean Dupont",
    email: "jean@example.com",
    role: "admin",
    avatar: "https://example.com/avatar.jpg"
  };

  const users = [
    currentUser,
    // ... autres utilisateurs
  ];

  return (
    <HelpdeskProvider
      config={config}
      userRole={currentUser.role}
      currentUser={currentUser}
      users={users}
    >
      {/* Vos composants */}
    </HelpdeskProvider>
  );
};
```

### Utilisation du contexte

```tsx
import { useHelpdesk } from '@next-helpdesk/core';

const MyComponent = () => {
  const { 
    config, 
    currentUser, 
    users, 
    isAdmin, 
    isAgent, 
    userRole 
  } = useHelpdesk();

  return (
    <div>
      <p>Utilisateur actuel: {currentUser.name}</p>
      <p>Rôle: {userRole}</p>
      {/* Utilisation des données du contexte */}
    </div>
  );
};
```

## 👥 Système de rôles et permissions

### 🔐 Hiérarchie des rôles

#### 👤 **Utilisateur (User)**
- **Niveau le plus bas** dans la hiérarchie
- **Peut** :
  - Créer des tickets
  - Voir ses propres tickets
  - Répondre à ses tickets
  - Fermer ses propres tickets résolus
- **Ne peut pas** :
  - Voir les tickets des autres utilisateurs
  - Assigner des tickets
  - Changer le statut des tickets
  - Accéder aux statistiques globales

#### 🛠️ **Agent**
- **Niveau intermédiaire** - personnel de support
- **Peut tout ce qu'un utilisateur peut** +
  - Voir tous les tickets
  - Assigner des tickets à d'autres agents
  - Changer le statut des tickets (ouvert → en cours → résolu)
  - Répondre à tous les tickets
  - Voir les statistiques de base
  - Gérer les catégories de tickets
- **Ne peut pas** :
  - Supprimer des tickets
  - Modifier la configuration système
  - Gérer les utilisateurs
  - Accéder aux logs système

#### 🎯 **Administrateur (Admin)**
- **Niveau le plus élevé** - accès complet
- **Peut tout ce qu'un agent peut** +
  - Supprimer des tickets
  - Modifier la configuration système
  - Gérer les utilisateurs et leurs rôles
  - Voir tous les logs et statistiques
  - Créer/modifier/supprimer des catégories
  - Gérer les priorités et statuts
  - Accéder aux rapports avancés
  - Configurer les notifications
  - Gérer les intégrations

### 🔧 Utilisation des rôles

```tsx
import { useHelpdesk } from '@next-helpdesk/core';

const MyComponent = () => {
  const { isAdmin, isAgent, userRole } = useHelpdesk();

  return (
    <div>
      {/* Affichage conditionnel */}
      {isAdmin && <AdminPanel />}
      {isAgent && <AgentTools />}
      
      {/* Logique métier */}
      {isAgent && <button>Assigner le ticket</button>}
      {isAdmin && <button>Supprimer le ticket</button>}
    </div>
  );
};
```

## 🎫 Création de tickets

### Formulaire avec validation

Le système utilise `react-hook-form` et `zod` pour la validation des formulaires :

```tsx
import { CreateTicketButton } from '@next-helpdesk/core';

const MyApp = () => {
  const handleCreateTicket = async (data) => {
    // data contient :
    // - title: string
    // - description: string  
    // - category: string (value de la catégorie)
    // - priority: 'low' | 'medium' | 'high'
    // - assignedTo?: string (ID de l'utilisateur assigné)
    
    console.log('Nouveau ticket:', data);
    // Envoyer à votre API/BDD
  };

  return (
    <CreateTicketButton
      onSubmit={handleCreateTicket}
      variant="button" // ou "fab"
      buttonText="Nouveau ticket"
      loading={false}
    />
  );
};
```

## 📋 Affichage des tickets

### Composant TicketList indépendant

Le composant `TicketList` peut être utilisé de manière complètement indépendante. Il suffit qu'il soit dans le `HelpdeskProvider` :

```tsx
import { TicketList, HelpdeskProvider } from '@next-helpdesk/core';

const MyApp = () => {
  const [tickets, setTickets] = useState([]);
  
  const handleViewTicket = (ticket) => {
    console.log('Voir le ticket:', ticket);
    // Navigation vers la page de détail
  };
  
  const handleEditTicket = (ticket) => {
    console.log('Modifier le ticket:', ticket);
    // Ouvrir le formulaire d'édition
  };
  
  const handleDeleteTicket = (ticket) => {
    console.log('Supprimer le ticket:', ticket);
    // Confirmer la suppression
  };

  const handleUpdateTicket = async (ticketId, data) => {
    console.log('Mise à jour du ticket:', ticketId, data);
    // Mettre à jour le ticket
  };

  const handleAddComment = async (ticketId, content, files) => {
    console.log('Nouveau commentaire:', ticketId, content, files);
    // Ajouter le commentaire
  };

  const handleCloseTicket = async (ticketId) => {
    console.log('Clôturer le ticket:', ticketId);
    // Clôturer le ticket
  };

  return (
    <HelpdeskProvider config={config} userRole="agent" currentUser={currentUser} users={users}>
      <TicketList
        tickets={tickets}
        onViewTicket={handleViewTicket}
        onEditTicket={handleEditTicket}
        onDeleteTicket={handleDeleteTicket}
        onUpdateTicket={handleUpdateTicket}
        onAddComment={handleAddComment}
        onCloseTicket={handleCloseTicket}
        title="Mes Tickets"
        loading={false}
      />
    </HelpdeskProvider>
  );
};
```

### Fonctionnalités du TicketList

- **Affichage responsive** : Tableau sur desktop, cartes sur mobile
- **Gestion des rôles** : Actions conditionnelles selon les permissions
- **Labels automatiques** : Affichage des labels au lieu des valeurs
- **Modes de vue** : Basculement entre tableau et cartes
- **Actions personnalisables** : Callbacks pour voir, modifier, supprimer
- **Dialog de détail intégré** : Popup pour voir/modifier les tickets
- **Gestion des commentaires** : Ajout de commentaires avec pièces jointes
- **Avatars personnalisés** : Affichage des avatars des utilisateurs

### Props du TicketList

```tsx
interface TicketListProps {
  tickets: Ticket[];                    // Liste des tickets
  onViewTicket?: (ticket: Ticket) => void;    // Callback pour voir un ticket
  onEditTicket?: (ticket: Ticket) => void;    // Callback pour modifier (agents+)
  onDeleteTicket?: (ticket: Ticket) => void;  // Callback pour supprimer (admins)
  onUpdateTicket?: (ticketId: string, data: Partial<UpdateTicketFormData>) => void;
  onAddComment?: (ticketId: string, content: string, files?: File[]) => Promise<void>;
  onCloseTicket?: (ticketId: string) => void;
  loading?: boolean;                    // État de chargement
  title?: string;                       // Titre de la liste
}
```

## 📊 Vue Kanban

### Composant TicketKanban

Le composant `TicketKanban` offre une vue Kanban interactive avec glisser-déposer :

```tsx
import { TicketKanban, HelpdeskProvider } from '@next-helpdesk/core';

const MyApp = () => {
  const [tickets, setTickets] = useState([]);

  const handleUpdateTicket = async (ticketId, data) => {
    console.log('Mise à jour du ticket:', ticketId, data);
    // Mettre à jour le ticket
  };

  const handleAddComment = async (ticketId, content, files) => {
    console.log('Nouveau commentaire:', ticketId, content, files);
    // Ajouter le commentaire
  };

  const handleCloseTicket = async (ticketId) => {
    console.log('Clôturer le ticket:', ticketId);
    // Clôturer le ticket
  };

  return (
    <HelpdeskProvider config={config} userRole="agent" currentUser={currentUser} users={users}>
      <TicketKanban
        tickets={tickets}
        onUpdateTicket={handleUpdateTicket}
        onAddComment={handleAddComment}
        onCloseTicket={handleCloseTicket}
        title="Vue Kanban des Tickets"
        height={600}
      />
    </HelpdeskProvider>
  );
};
```

### Fonctionnalités du Kanban

- **Onglets par catégorie** : Sélection de la catégorie à afficher
- **Onglets intelligents** : Seules les catégories avec des tickets sont affichées
- **Glisser-déposer** : Déplacer les tickets entre les colonnes de statut
- **Cartes interactives** : Double-clic pour ouvrir le détail du ticket
- **Dialog de détail intégré** : Popup pour voir/modifier les tickets
- **Statuts dynamiques** : Utilise la configuration des statuts par catégorie
- **Responsive** : Adaptation automatique sur mobile

### Props du TicketKanban

```tsx
interface TicketKanbanProps {
  tickets: Ticket[];                    // Liste des tickets
  onUpdateTicket?: (ticketId: string, data: Partial<UpdateTicketFormData>) => void;
  onAddComment?: (ticketId: string, content: string, files?: File[]) => Promise<void>;
  onCloseTicket?: (ticketId: string) => void;
  title?: string;                       // Titre du Kanban
  height?: number;                      // Hauteur du Kanban
}
```

## 📈 Diagramme de Gantt

### Composant TicketGanttChart

Le composant `TicketGanttChart` offre une visualisation temporelle des tickets :

```tsx
import { TicketGanttChart, HelpdeskProvider } from '@next-helpdesk/core';

const MyApp = () => {
  const [tickets, setTickets] = useState([]);

  return (
    <HelpdeskProvider config={config} userRole="agent" currentUser={currentUser} users={users}>
      <TicketGanttChart
        tickets={tickets}
        title="Planning des Tickets"
        height={400}
        width={1300}
      />
    </HelpdeskProvider>
  );
};
```

### Fonctionnalités du Gantt

- **Visualisation temporelle** : Affichage des tickets selon leurs dates
- **Interactivité** : Clic sur les barres pour voir le détail
- **Dialog de détail intégré** : Popup pour voir/modifier les tickets
- **Responsive** : Adaptation automatique de la taille
- **Personnalisation** : Hauteur et largeur configurables

### Props du TicketGanttChart

```tsx
interface TicketGanttChartProps {
  tickets: Ticket[];                    // Liste des tickets
  title?: string;                       // Titre du diagramme
  height?: number;                      // Hauteur du diagramme
  width?: number;                       // Largeur du diagramme
}
```

## 🧩 Composants Communs

### StatusChip

Composant d'affichage de statut qui utilise automatiquement la configuration du contexte :

```tsx
import { StatusChip } from '@next-helpdesk/core';

// Affichage simple
<StatusChip status="open" size="small" />

// Avec valeur affichée
<StatusChip status="in_progress" showValue={true} />

// Variante outlined
<StatusChip status="resolved" variant="outlined" />

// Le composant utilise automatiquement la configuration du contexte
// et affiche le bon label et la bonne couleur
```

### StatusSelect

Composant de sélection de statut avec configuration dynamique :

```tsx
import { StatusSelect } from '@next-helpdesk/core';

<StatusSelect
  name="status"
  control={control}
  label="Statut"
  placeholder="Sélectionner un statut..."
/>

// Le composant utilise automatiquement la configuration du contexte
// et affiche les statuts avec les bonnes couleurs
```

### PriorityChip

Composant d'affichage de priorité :

```tsx
import { PriorityChip } from '@next-helpdesk/core';

<PriorityChip priority="high" size="small" />
<PriorityChip priority="medium" showValue={true} />
<PriorityChip priority="low" variant="outlined" />
```

### PrioritySelect

Composant de sélection de priorité :

```tsx
import { PrioritySelect } from '@next-helpdesk/core';

<PrioritySelect
  name="priority"
  control={control}
  label="Priorité"
  placeholder="Sélectionner une priorité..."
/>
```

## 👤 Avatars Personnalisés

Le système supporte plusieurs types d'avatars pour les utilisateurs :

### Types d'avatars supportés

```tsx
// Avatar avec URL
const user1: User = {
  id: '1',
  name: 'Jean Dupont',
  email: 'jean@example.com',
  role: 'user',
  avatar: 'https://example.com/avatar.jpg'
};

// Avatar avec ReactNode
const user2: User = {
  id: '2',
  name: 'Marie Martin',
  email: 'marie@example.com',
  role: 'agent',
  avatar: (
    <Avatar sx={{ bgcolor: 'success.main', width: 40, height: 40 }}>
      🏢
    </Avatar>
  )
};

// Avatar avec badge spécial
const user3: User = {
  id: '3',
  name: 'Pierre Durand',
  email: 'pierre@example.com',
  role: 'admin',
  avatar: (
    <Box sx={{ position: 'relative' }}>
      <Avatar sx={{ bgcolor: 'error.main', width: 40, height: 40 }}>
        ⭐
      </Avatar>
      <Chip label="Admin" size="small" color="error" />
    </Box>
  )
};

// Pas d'avatar - initiales automatiques
const user4: User = {
  id: '4',
  name: 'Lucas Moreau',
  email: 'lucas@example.com',
  role: 'agent',
  avatar: undefined // Affiche "LM"
};
```

### Composant UserAvatar

```tsx
import { UserAvatar } from '@next-helpdesk/core';

<UserAvatar user={user} size={32} />
```

## ⚙️ Configuration Dynamique

### Configuration complète

```tsx
const config: HelpdeskConfig = {
  categories: [
    {
      value: "technical_support",
      label: "Support technique",
      statuses: [
        { value: "open", label: "Déposé", color: "primary" },
        { value: "in_progress", label: "Pris en charge", color: "warning" },
        { value: "resolved", label: "Traité", color: "success" },
        { value: "closed", label: "Fermé", color: "default" },
      ],
      defaultStatus: "open",
    },
    {
      value: "billing",
      label: "Facturation",
      statuses: [
        { value: "open", label: "Déposé", color: "primary" },
        { value: "in_progress", label: "À l'étude", color: "info" },
        { value: "resolved", label: "Traité", color: "success" },
        { value: "closed", label: "Fermé", color: "default" },
      ],
      defaultStatus: "open",
    },
    // ... autres catégories
  ],
  priorities: [
    { value: "low", label: "Faible", color: "success" },
    { value: "medium", label: "Normale", color: "warning" },
    { value: "high", label: "Urgente", color: "error" },
  ],
  // Statuts globaux pour la compatibilité (optionnel)
  statuses: [
    { value: "open", label: "Déposé", color: "primary" },
    { value: "in_progress", label: "Pris en charge", color: "warning" },
    { value: "resolved", label: "Traité", color: "success" },
    { value: "closed", label: "Fermé", color: "default" },
  ],
  defaultPriority: "medium",
  allowFileUpload: true,
  maxFileSize: 5, // MB
  enableNotifications: true,
};
```

### Avantages de la configuration dynamique

- **Personnalisation complète** des statuts selon vos besoins métier
- **Couleurs cohérentes** dans toute l'application
- **Pas besoin de modifier le code** des composants
- **Configuration centralisée** et réutilisable
- **Support de toutes les couleurs** Material-UI

## 🏗️ Structure du projet

```
next-helpdesk/
├── packages/
│   └── next-helpdesk/     # Bibliothèque principale
│       ├── src/
│       │   ├── components/   # Composants React
│       │   │   ├── common/   # Composants communs
│       │   │   │   ├── kanban/  # Composants Kanban
│       │   │   │   │   ├── TicketKanban.tsx
│       │   │   │   │   ├── KanbanCard.tsx
│       │   │   │   │   ├── types.ts
│       │   │   │   │   └── hooks/
│       │   │   │   │       └── useKanbanBoard.ts
│       │   │   │   ├── StatusChip.tsx
│       │   │   │   ├── StatusSelect.tsx
│       │   │   │   ├── PriorityChip.tsx
│       │   │   │   ├── PrioritySelect.tsx
│       │   │   │   └── UserAvatar.tsx
│       │   │   ├── ticket/   # Composants de tickets
│       │   │   │   ├── TicketList.tsx
│       │   │   │   └── TicketGanttChart.tsx
│       │   │   ├── ticket-form/  # Formulaires
│       │   │   │   ├── create/
│       │   │   │   │   ├── CreateTicketButton.tsx
│       │   │   │   │   └── CreateTicketForm.tsx
│       │   │   │   └── edit/
│       │   │   │       └── TicketDetailDialog.tsx
│       │   │   └── Dashboard.tsx
│       │   ├── context/      # Contexte global
│       │   │   └── HelpdeskContext.tsx
│       │   ├── schemas/      # Schémas de validation
│       │   │   └── ticket.ts
│       │   ├── types/        # Types TypeScript
│       │   │   └── index.ts
│       │   └── utils/        # Utilitaires
│       │       ├── index.ts
│       │       └── permissions.ts
│       └── package.json
└── apps/
    └── helpdesk-app/      # Application de démonstration
        ├── src/
        │   └── app/          # Pages Next.js
        └── package.json
```

## 🛠️ Développement

### Bibliothèque

```bash
# Dans le dossier packages/next-helpdesk
pnpm dev
```

### Application de démonstration

```bash
# Dans le dossier apps/helpdesk-app
pnpm dev
```

## 🎨 Personnalisation

La bibliothèque utilise Material-UI pour le style, vous pouvez donc personnaliser l'apparence en utilisant le système de thème de MUI :

```tsx
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <HelpdeskProvider config={config} userRole="admin" currentUser={currentUser} users={users}>
      {/* Vos composants */}
    </HelpdeskProvider>
  </ThemeProvider>
);
```

## 🧪 Tests

```bash
# Exécuter les tests
pnpm test

# Exécuter les tests en mode watch
pnpm test:watch
```

## 📚 Technologies utilisées

- [Next.js 14](https://nextjs.org/) - Framework React
- [Material-UI](https://mui.com/) - Bibliothèque de composants UI
- [TypeScript](https://www.typescriptlang.org/) - Typage statique
- [React Hook Form](https://react-hook-form.com/) - Gestion des formulaires
- [Zod](https://zod.dev/) - Validation des schémas
- [@caldwell619/react-kanban](https://github.com/caldwell619/react-kanban) - Composant Kanban
- [recharts](https://recharts.org/) - Diagrammes et graphiques
- [tsup](https://github.com/egoist/tsup) - Build de la bibliothèque
- [pnpm](https://pnpm.io/) - Gestionnaire de paquets

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📧 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub. 