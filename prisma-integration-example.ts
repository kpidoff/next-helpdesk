// Exemple d'intégration Prisma avec @next-helpdesk/core
// Ce fichier montre comment connecter votre base de données Prisma à la librairie

import { Attachment, Comment, Priority, Ticket, User } from '@next-helpdesk/core';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================================
// FONCTIONS DE TRANSFORMATION DES DONNÉES
// ============================================================================

/**
 * Transforme un utilisateur Prisma en User de la librairie
 */
function transformPrismaUserToUser(prismaUser: any): User {
  return {
    id: prismaUser.id,
    name: prismaUser.name,
    email: prismaUser.email,
    avatar: prismaUser.avatar,
    role: prismaUser.role.toLowerCase() as 'user' | 'admin' | 'agent'
  };
}

/**
 * Transforme un ticket Prisma en Ticket de la librairie
 */
function transformPrismaTicketToTicket(prismaTicket: any): Ticket {
  return {
    id: prismaTicket.id,
    title: prismaTicket.title,
    description: prismaTicket.description,
    priority: prismaTicket.priority.toLowerCase() as Priority,
    status: prismaTicket.status.toLowerCase() as string,
    category: prismaTicket.category,
    tags: prismaTicket.tags || [],
    createdAt: prismaTicket.createdAt,
    updatedAt: prismaTicket.updatedAt,
    author: transformPrismaUserToUser(prismaTicket.author),
    assignedTo: prismaTicket.assignedTo ? transformPrismaUserToUser(prismaTicket.assignedTo) : undefined,
    comments: prismaTicket.comments?.map(transformPrismaCommentToComment) || [],
    attachments: prismaTicket.attachments?.map(transformPrismaAttachmentToAttachment) || [],
    hoursSpent: prismaTicket.hoursSpent,
    startDate: prismaTicket.startDate,
    endDate: prismaTicket.endDate
  };
}

/**
 * Transforme un commentaire Prisma en Comment de la librairie
 */
function transformPrismaCommentToComment(prismaComment: any): Comment {
  return {
    id: prismaComment.id,
    content: prismaComment.content,
    createdAt: prismaComment.createdAt,
    author: transformPrismaUserToUser(prismaComment.author),
    ticketId: prismaComment.ticketId,
    attachments: prismaComment.attachments?.map(transformPrismaCommentAttachmentToAttachment) || []
  };
}

/**
 * Transforme une pièce jointe Prisma en Attachment de la librairie
 */
function transformPrismaAttachmentToAttachment(prismaAttachment: any): Attachment {
  return {
    id: prismaAttachment.id,
    filename: prismaAttachment.filename,
    url: prismaAttachment.url,
    size: prismaAttachment.size,
    type: prismaAttachment.type,
    uploadedAt: prismaAttachment.uploadedAt,
    uploadedBy: transformPrismaUserToUser(prismaAttachment.uploadedBy)
  };
}

/**
 * Transforme une pièce jointe de commentaire Prisma en Attachment de la librairie
 */
function transformPrismaCommentAttachmentToAttachment(prismaAttachment: any): Attachment {
  return {
    id: prismaAttachment.id,
    filename: prismaAttachment.filename,
    url: prismaAttachment.url,
    size: prismaAttachment.size,
    type: prismaAttachment.type,
    uploadedAt: prismaAttachment.uploadedAt,
    uploadedBy: transformPrismaUserToUser(prismaAttachment.uploadedBy)
  };
}

// ============================================================================
// FONCTIONS DE RÉCUPÉRATION DES DONNÉES
// ============================================================================

/**
 * Récupère tous les tickets avec leurs relations
 */
export async function getAllTickets(): Promise<Ticket[]> {
  const prismaTickets = await prisma.ticket.findMany({
    include: {
      author: true,
      assignedTo: true,
      comments: {
        include: {
          author: true,
          attachments: {
            include: {
              uploadedBy: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      },
      attachments: {
        include: {
          uploadedBy: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return prismaTickets.map(transformPrismaTicketToTicket);
}

/**
 * Récupère un ticket par son ID
 */
export async function getTicketById(id: string): Promise<Ticket | null> {
  const prismaTicket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      author: true,
      assignedTo: true,
      comments: {
        include: {
          author: true,
          attachments: {
            include: {
              uploadedBy: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      },
      attachments: {
        include: {
          uploadedBy: true
        }
      }
    }
  });

  return prismaTicket ? transformPrismaTicketToTicket(prismaTicket) : null;
}

/**
 * Récupère tous les utilisateurs
 */
export async function getAllUsers(): Promise<User[]> {
  const prismaUsers = await prisma.user.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  return prismaUsers.map(transformPrismaUserToUser);
}

/**
 * Récupère un utilisateur par son ID
 */
export async function getUserById(id: string): Promise<User | null> {
  const prismaUser = await prisma.user.findUnique({
    where: { id }
  });

  return prismaUser ? transformPrismaUserToUser(prismaUser) : null;
}

// ============================================================================
// FONCTIONS DE MODIFICATION DES DONNÉES
// ============================================================================

/**
 * Crée un nouveau ticket
 */
export async function createTicket(ticketData: {
  title: string;
  description: string;
  priority: Priority;
  category: string;
  tags?: Array<{
    value: string;
    label: string;
    color?: string;
  }>;
  authorId: string;
  assignedToId?: string;
}): Promise<Ticket> {
  const prismaTicket = await prisma.ticket.create({
    data: {
      title: ticketData.title,
      description: ticketData.description,
      priority: ticketData.priority.toUpperCase() as any,
      category: ticketData.category,
      tags: ticketData.tags || [],
      authorId: ticketData.authorId,
      assignedToId: ticketData.assignedToId
    },
    include: {
      author: true,
      assignedTo: true,
      comments: {
        include: {
          author: true,
          attachments: {
            include: {
              uploadedBy: true
            }
          }
        }
      },
      attachments: {
        include: {
          uploadedBy: true
        }
      }
    }
  });

  return transformPrismaTicketToTicket(prismaTicket);
}

/**
 * Met à jour un ticket
 */
export async function updateTicket(
  id: string,
  updateData: {
    title?: string;
    description?: string;
    priority?: Priority;
    status?: string;
    category?: string;
    tags?: Array<{
      value: string;
      label: string;
      color?: string;
    }>;
    assignedToId?: string;
    hoursSpent?: number;
    startDate?: Date;
    endDate?: Date;
  }
): Promise<Ticket> {
  const prismaTicket = await prisma.ticket.update({
    where: { id },
    data: {
      ...updateData,
      priority: updateData.priority?.toUpperCase() as any,
      status: updateData.status?.toUpperCase() as any,
      tags: updateData.tags,
      updatedAt: new Date()
    },
    include: {
      author: true,
      assignedTo: true,
      comments: {
        include: {
          author: true,
          attachments: {
            include: {
              uploadedBy: true
            }
          }
        }
      },
      attachments: {
        include: {
          uploadedBy: true
        }
      }
    }
  });

  return transformPrismaTicketToTicket(prismaTicket);
}

/**
 * Ajoute un commentaire à un ticket
 */
export async function addCommentToTicket(
  ticketId: string,
  commentData: {
    content: string;
    authorId: string;
  }
): Promise<Comment> {
  const prismaComment = await prisma.comment.create({
    data: {
      content: commentData.content,
      authorId: commentData.authorId,
      ticketId: ticketId
    },
    include: {
      author: true,
      attachments: {
        include: {
          uploadedBy: true
        }
      }
    }
  });

  return transformPrismaCommentToComment(prismaComment);
}

/**
 * Ajoute une pièce jointe à un ticket
 */
export async function addAttachmentToTicket(
  ticketId: string,
  attachmentData: {
    filename: string;
    url: string;
    size: number;
    type: string;
    uploadedById: string;
  }
): Promise<Attachment> {
  const prismaAttachment = await prisma.attachment.create({
    data: {
      filename: attachmentData.filename,
      url: attachmentData.url,
      size: attachmentData.size,
      type: attachmentData.type,
      uploadedById: attachmentData.uploadedById,
      ticketId: ticketId
    },
    include: {
      uploadedBy: true
    }
  });

  return transformPrismaAttachmentToAttachment(prismaAttachment);
}

// ============================================================================
// FONCTIONS DE FILTRAGE ET RECHERCHE
// ============================================================================

/**
 * Récupère les tickets par statut
 */
export async function getTicketsByStatus(status: string): Promise<Ticket[]> {
  const prismaTickets = await prisma.ticket.findMany({
    where: {
      status: status.toUpperCase() as any
    },
    include: {
      author: true,
      assignedTo: true,
      comments: {
        include: {
          author: true,
          attachments: {
            include: {
              uploadedBy: true
            }
          }
        }
      },
      attachments: {
        include: {
          uploadedBy: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return prismaTickets.map(transformPrismaTicketToTicket);
}

/**
 * Récupère les tickets par catégorie
 */
export async function getTicketsByCategory(category: string): Promise<Ticket[]> {
  const prismaTickets = await prisma.ticket.findMany({
    where: {
      category: category
    },
    include: {
      author: true,
      assignedTo: true,
      comments: {
        include: {
          author: true,
          attachments: {
            include: {
              uploadedBy: true
            }
          }
        }
      },
      attachments: {
        include: {
          uploadedBy: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return prismaTickets.map(transformPrismaTicketToTicket);
}

/**
 * Récupère les tickets assignés à un utilisateur
 */
export async function getTicketsAssignedToUser(userId: string): Promise<Ticket[]> {
  const prismaTickets = await prisma.ticket.findMany({
    where: {
      assignedToId: userId
    },
    include: {
      author: true,
      assignedTo: true,
      comments: {
        include: {
          author: true,
          attachments: {
            include: {
              uploadedBy: true
            }
          }
        }
      },
      attachments: {
        include: {
          uploadedBy: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return prismaTickets.map(transformPrismaTicketToTicket);
}

/**
 * Récupère les tickets par tags
 */
export async function getTicketsByTags(tagValues: string[]): Promise<Ticket[]> {
  const prismaTickets = await prisma.ticket.findMany({
    where: {
      tags: {
        some: {
          value: {
            in: tagValues
          }
        }
      }
    },
    include: {
      author: true,
      assignedTo: true,
      comments: {
        include: {
          author: true,
          attachments: {
            include: {
              uploadedBy: true
            }
          }
        }
      },
      attachments: {
        include: {
          uploadedBy: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return prismaTickets.map(transformPrismaTicketToTicket);
}

/**
 * Récupère tous les tags utilisés dans les tickets
 */
export async function getAllTags(): Promise<Array<{
  value: string;
  label: string;
  color?: string;
  count: number;
}>> {
  const tickets = await getAllTickets();
  const tagCounts: Record<string, { value: string; label: string; color?: string; count: number }> = {};

  tickets.forEach(ticket => {
    ticket.tags?.forEach(tag => {
      if (tagCounts[tag.value]) {
        tagCounts[tag.value].count++;
      } else {
        tagCounts[tag.value] = {
          value: tag.value,
          label: tag.label,
          color: tag.color,
          count: 1
        };
      }
    });
  });

  return Object.values(tagCounts).sort((a, b) => b.count - a.count);
}

/**
 * Supprime un tag d'une catégorie
 */
export async function removeTagFromCategory(
  category: string,
  tagValue: string
): Promise<void> {
  // Supprimer le tag de la configuration de la catégorie
  // Cette fonction devrait être implémentée selon votre logique métier
  
  // Exemple : supprimer le tag de tous les tickets de cette catégorie
  const tickets = await getTicketsByCategory(category);
  
  for (const ticket of tickets) {
    if (ticket.tags) {
      const updatedTags = ticket.tags.filter(tag => tag.value !== tagValue);
      await updateTicket(ticket.id, { tags: updatedTags });
    }
  }
  
  console.log(`Tag "${tagValue}" supprimé de la catégorie "${category}"`);
}

// ============================================================================
// EXEMPLE D'UTILISATION DANS UNE API ROUTE (Next.js)
// ============================================================================

/*
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
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// pages/api/tickets/with-tags.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createTicket, updateTicket, removeTagFromCategory } from '../../../lib/prisma-integration';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Exemple de création d'un ticket avec des tags
      const ticket = await createTicket({
        title: "Problème de connexion",
        description: "Impossible de se connecter à l'application",
        priority: "high",
        category: "technical",
        tags: [
          { value: "urgent", label: "Urgent", color: "error" },
          { value: "bug", label: "Bug", color: "error" },
          { value: "connexion", label: "Connexion", color: "primary" }
        ],
        authorId: "user-123",
        assignedToId: "agent-456"
      });
      res.status(201).json(ticket);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la création du ticket' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, ...updateData } = req.body;
      // Exemple de mise à jour d'un ticket avec de nouveaux tags
      const ticket = await updateTicket(id, {
        ...updateData,
        tags: [
          { value: "resolu", label: "Résolu", color: "success" },
          { value: "teste", label: "Testé", color: "info" }
        ]
      });
      res.status(200).json(ticket);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour du ticket' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { category, tagValue } = req.body;
      // Exemple de suppression d'un tag d'une catégorie
      await removeTagFromCategory(category, tagValue);
      res.status(200).json({ message: `Tag "${tagValue}" supprimé de la catégorie "${category}"` });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression du tag' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
*/

// ============================================================================
// EXEMPLE D'UTILISATION DANS UN COMPOSANT REACT
// ============================================================================

/*
// components/TicketList.tsx
import { useEffect, useState } from 'react';
import { TicketList } from '@next-helpdesk/core';
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
*/ 