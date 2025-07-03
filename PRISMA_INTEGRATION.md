# Intégration Prisma avec @next-helpdesk/core

Ce guide vous montre comment intégrer votre base de données Prisma avec la librairie Next-Helpdesk.

## 📋 Prérequis

- Node.js 16+ 
- Prisma CLI installé : `npm install -g prisma`
- Base de données PostgreSQL, MySQL ou SQLite

## 🗄️ Schéma de base de données

Le fichier `prisma-schema-example.prisma` contient un schéma complet qui correspond exactement aux types de la librairie Next-Helpdesk :

### Modèles principaux

- **User** : Utilisateurs du système (user, agent, admin)
- **Ticket** : Tickets de support avec toutes leurs propriétés
- **Comment** : Commentaires sur les tickets
- **Attachment** : Pièces jointes des tickets
- **CommentAttachment** : Pièces jointes des commentaires
- **Category** : Catégories de tickets

### Enums

- **Priority** : `LOW`, `MEDIUM`, `HIGH`
- **Status** : `OPEN`, `IN_PROGRESS`, `IN_TEST`, `RESOLVED`, `CLOSED`
- **UserRole** : `USER`, `AGENT`, `ADMIN`

## 🚀 Installation et configuration

### 1. Installer les dépendances

```bash
npm install prisma @prisma/client
npm install @next-helpdesk/core
```

### 2. Configurer Prisma

```bash
# Initialiser Prisma
npx prisma init

# Copier le schéma d'exemple
cp prisma-schema-example.prisma prisma/schema.prisma
```

### 3. Configurer la base de données

Modifiez le fichier `.env` :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/helpdesk_db"
# ou pour MySQL
# DATABASE_URL="mysql://user:password@localhost:3306/helpdesk_db"
# ou pour SQLite
# DATABASE_URL="file:./dev.db"
```

### 4. Générer et migrer

```bash
# Générer le client Prisma
npx prisma generate

# Créer la première migration
npx prisma migrate dev --name init

# Appliquer les migrations
npx prisma migrate deploy
```

## 🔧 Utilisation

### Fonctions de transformation

Le fichier `prisma-integration-example.ts` contient toutes les fonctions nécessaires pour :

- Transformer les données Prisma vers les types de la librairie
- Récupérer les tickets avec toutes leurs relations
- Créer, modifier et supprimer des tickets
- Gérer les commentaires et pièces jointes

### Exemple d'API Route (Next.js)

```typescript
// pages/api/tickets/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getAllTickets, createTicket } from '../../../lib/prisma-integration';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const tickets = await getAllTickets();
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des tickets' });
    }
  } else if (req.method === 'POST') {
    try {
      const ticket = await createTicket(req.body);
      res.status(201).json(ticket);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la création du ticket' });
    }
  }
}
```

### Exemple de composant React

```typescript
// components/TicketList.tsx
import { useEffect, useState } from 'react';
import { TicketList, Ticket } from '@next-helpdesk/core';
import { getAllTickets } from '../lib/prisma-integration';

export default function TicketListPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      try {
        const ticketsData = await getAllTickets();
        setTickets(ticketsData);
      } catch (error) {
        console.error('Erreur lors du chargement des tickets:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTickets();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <TicketList
      tickets={tickets}
      onViewTicket={(ticket) => console.log('Voir ticket:', ticket)}
      onEditTicket={(ticket) => console.log('Modifier ticket:', ticket)}
      onDeleteTicket={(ticket) => console.log('Supprimer ticket:', ticket)}
    />
  );
}
```

## 🔄 Fonctions disponibles

### Récupération de données

- `getAllTickets()` : Tous les tickets avec relations
- `getTicketById(id)` : Ticket spécifique
- `getAllUsers()` : Tous les utilisateurs
- `getUserById(id)` : Utilisateur spécifique
- `getTicketsByStatus(status)` : Tickets par statut
- `getTicketsByCategory(category)` : Tickets par catégorie
- `getTicketsAssignedToUser(userId)` : Tickets assignés

### Modification de données

- `createTicket(data)` : Créer un ticket
- `updateTicket(id, data)` : Modifier un ticket
- `addCommentToTicket(ticketId, data)` : Ajouter un commentaire
- `addAttachmentToTicket(ticketId, data)` : Ajouter une pièce jointe

## 🎯 Correspondance des types

| Type Next-Helpdesk | Type Prisma | Notes |
|-------------------|-------------|-------|
| `Priority` | `Priority` enum | `low` ↔ `LOW` |
| `UserRole` | `UserRole` enum | `user` ↔ `USER` |
| `User` | `User` model | Transformation automatique |
| `Ticket` | `Ticket` model | Avec relations |
| `Comment` | `Comment` model | Avec relations |
| `Attachment` | `Attachment` model | Avec relations |

## 🔒 Sécurité et permissions

Le schéma Prisma inclut des contraintes de sécurité :

- **Cascade** : Suppression en cascade des commentaires et pièces jointes
- **SetNull** : Réassignation automatique si un utilisateur est supprimé
- **Unique** : Email unique pour les utilisateurs
- **Required** : Champs obligatoires marqués

## 🚀 Déploiement

### Variables d'environnement

```env
# Production
DATABASE_URL="postgresql://user:password@prod-host:5432/helpdesk_db"
NODE_ENV="production"

# Développement
DATABASE_URL="postgresql://user:password@localhost:5432/helpdesk_dev"
NODE_ENV="development"
```

### Migration en production

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# Vérifier la base de données
npx prisma studio
```

## 🧪 Tests

```bash
# Tester la connexion
npx prisma db push

# Ouvrir Prisma Studio
npx prisma studio

# Réinitialiser la base de test
npx prisma migrate reset
```

## 📚 Ressources

- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Next-Helpdesk](https://github.com/kpidoff/next-helpdesk)
- [Types TypeScript](https://www.typescriptlang.org/docs)

## 🤝 Support

Pour toute question sur l'intégration :

1. Consultez la documentation de la librairie
2. Vérifiez les exemples fournis
3. Ouvrez une issue sur GitHub si nécessaire 