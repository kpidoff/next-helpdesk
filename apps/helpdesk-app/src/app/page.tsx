"use client";

import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  CreateTicketButton,
  CreateTicketFormData,
  HelpdeskApp,
  HelpdeskConfig,
  HelpdeskProvider,
  PriorityChip,
  PrioritySelect,
  StatusChip,
  StatusSelect,
  Ticket,
  TicketGanttChart,
  TicketKanban,
  TicketList,
  UpdateTicketFormData,
  User,
} from "@next-helpdesk/core";

import { useState } from "react";

// Configuration personnalisée pour l'application de démonstration
const customConfig: HelpdeskConfig = {
  categories: [
    {
      value: "technical_support",
      label: "Support technique",
      statuses: [
        { value: "open", label: "Déposé", color: "primary" },
        { value: "in_progress", label: "Pris en charge", color: "warning" },
        // { value: "resolved", label: "Traité", color: "success" },
        // { value: "closed", label: "Fermé", color: "default" },
      ],
      defaultStatus: "open",
      tags: [
        {
          id: "tag_urgent",
          label: "Urgent",
          color: "#d32f2f",
        },
        { id: "tag_bug", label: "Bug", color: "#f44336" },
        {
          id: "tag_connexion",
          label: "Connexion",
          color: "#1976d2",
        },
        {
          id: "tag_performance",
          label: "Performance",
          color: "#ed6c02",
        },
      ],
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
      tags: [
        {
          id: "tag_remboursement",
          label: "Remboursement",
          color: "#ed6c02",
        },
        {
          id: "tag_facturation",
          label: "Facturation",
          color: "#9c27b0",
        },
        {
          id: "tag_paiement",
          label: "Paiement",
          color: "#0288d1",
        },
      ],
    },
    {
      value: "user_account",
      label: "Compte utilisateur",
      statuses: [
        { value: "open", label: "Déposé", color: "primary" },
        { value: "in_progress", label: "Pris en charge", color: "warning" },
        { value: "resolved", label: "Traité", color: "success" },
        { value: "closed", label: "Fermé", color: "default" },
      ],
      defaultStatus: "open",
    },
    {
      value: "feature_request",
      label: "Nouvelle fonctionnalité",
      statuses: [
        { value: "open", label: "Déposé", color: "primary" },
        { value: "in_progress", label: "À l'étude", color: "info" },
        { value: "resolved", label: "Approuvé", color: "success" },
        { value: "closed", label: "Refusé", color: "error" },
      ],
      defaultStatus: "open",
    },
    {
      value: "bug_report",
      label: "Signalement de bug",
      statuses: [
        { value: "open", label: "Déposé", color: "error" },
        { value: "in_progress", label: "Pris en charge", color: "warning" },
        { value: "resolved", label: "Traité", color: "success" },
        { value: "closed", label: "Fermé", color: "default" },
      ],
      defaultStatus: "open",
      tags: [
        { id: "tag_ui", label: "Interface", color: "#0288d1" },
        {
          id: "tag_mobile",
          label: "Mobile",
          color: "#1976d2",
        },
        {
          id: "tag_resolu",
          label: "Résolu",
          color: "#2e7d32",
        },
        {
          id: "tag_critique",
          label: "Critique",
          color: "#d32f2f",
        },
      ],
    },
    {
      value: "information_request",
      label: "Demande d'information",
      statuses: [
        { value: "open", label: "Déposé", color: "primary" },
        { value: "in_progress", label: "À l'étude", color: "info" },
        { value: "resolved", label: "Traité", color: "success" },
        { value: "closed", label: "Fermé", color: "default" },
      ],
      defaultStatus: "open",
    },
    {
      value: "other",
      label: "Autre",
      statuses: [
        { value: "open", label: "Déposé", color: "primary" },
        { value: "in_progress", label: "Pris en charge", color: "warning" },
        { value: "resolved", label: "Traité", color: "success" },
        { value: "closed", label: "Fermé", color: "default" },
      ],
      defaultStatus: "open",
    },
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
  maxFileSize: 5,
  enableNotifications: true,
};

// Données de démonstration avec avatars personnalisés
const mockUsers: User[] = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    role: "user",
    // Avatar URL classique
    avatar: "https://via.placeholder.com/150/1976d2/ffffff?text=JD",
  },
  {
    id: "2",
    name: "Marie Martin",
    email: "marie.martin@example.com",
    role: "agent",
    // Avatar ReactNode personnalisé avec icône et couleur
    avatar: (
      <Avatar sx={{ bgcolor: "success.main", width: 40, height: 40 }}>
        🏢
      </Avatar>
    ),
  },
  {
    id: "3",
    name: "Pierre Durand",
    email: "pierre.durand@example.com",
    role: "admin",
    // Avatar ReactNode avec badge spécial
    avatar: (
      <Avatar sx={{ bgcolor: "error.main", width: 40, height: 40 }}>⭐</Avatar>
    ),
  },
  {
    id: "4",
    name: "Sophie Bernard",
    email: "sophie.bernard@example.com",
    role: "user",
    // Avatar ReactNode avec icône personnalisée
    avatar: (
      <Avatar sx={{ bgcolor: "secondary.main", width: 40, height: 40 }}>
        ❤️
      </Avatar>
    ),
  },
  {
    id: "5",
    name: "Lucas Moreau",
    email: "lucas.moreau@example.com",
    role: "agent",
    // Pas d'avatar - utilisera les initiales
    avatar: undefined,
  },
];

const mockTickets: Ticket[] = [
  {
    id: "1",
    title: "Problème de connexion à l'application",
    description:
      "Je n'arrive pas à me connecter à l'application depuis ce matin. J'ai essayé de redémarrer mon ordinateur mais le problème persiste.",
    priority: "high",
    status: "open",
    category: "technical_support",
    tags: [
      { id: "tag_urgent", label: "Urgent", color: "#d32f2f" },
      { id: "tag_bug", label: "Bug", color: "#f44336" },
      { id: "tag_connexion", label: "Connexion", color: "#1976d2" },
    ],
    createdAt: new Date("2025-07-15"),
    updatedAt: new Date("2025-07-15"),
    author: mockUsers[0],
    hoursSpent: 2.5,
    startDate: new Date("2025-07-15T09:00:00"),
    endDate: new Date("2025-07-15T11:30:00"),
    comments: [
      {
        id: "1",
        content:
          "Bonjour, pouvez-vous me donner plus de détails sur l'erreur que vous voyez ?",
        createdAt: new Date("2025-07-15T10:30:00"),
        author: mockUsers[2],
        ticketId: "1",
      },
      {
        id: "2",
        content:
          "Je vois une page blanche avec le message 'Erreur de connexion'. Ça fait 2 heures que ça dure.",
        createdAt: new Date("2025-07-15T11:15:00"),
        author: mockUsers[0],
        ticketId: "1",
      },
    ],
    attachments: [
      {
        id: "1",
        filename: "screenshot-erreur.png",
        url: "https://via.placeholder.com/800x600/ff6b6b/ffffff?text=Screenshot+Erreur",
        size: 245760, // 240 KB
        type: "image/png",
        uploadedAt: new Date("2025-07-15T11:20:00"),
        uploadedBy: mockUsers[0],
      },
      {
        id: "2",
        filename: "log-erreur.txt",
        url: "https://via.placeholder.com/400x200/4ecdc4/ffffff?text=Log+Erreur",
        size: 15360, // 15 KB
        type: "text/plain",
        uploadedAt: new Date("2025-07-15T11:25:00"),
        uploadedBy: mockUsers[0],
      },
    ],
  },
  {
    id: "2",
    title: "Demande de remboursement",
    description:
      "Bonjour, j'aimerais demander un remboursement pour ma dernière facturation car le service n'était pas conforme à mes attentes.",
    priority: "medium",
    status: "in_progress",
    category: "billing",
    tags: [
      { id: "tag_remboursement", label: "Remboursement", color: "#ed6c02" },
      { id: "tag_facturation", label: "Facturation", color: "#9c27b0" },
    ],
    createdAt: new Date("2025-07-14"),
    updatedAt: new Date("2025-07-15"),
    author: mockUsers[1],
    assignedTo: mockUsers[2],
    hoursSpent: 1.0,
    startDate: new Date("2025-07-15T08:00:00"),
    endDate: new Date("2025-07-15T09:00:00"),
    comments: [
      {
        id: "3",
        content:
          "Je vais examiner votre demande de remboursement. Pouvez-vous me fournir le numéro de facture ?",
        createdAt: new Date("2025-07-15T09:00:00"),
        author: mockUsers[2],
        ticketId: "2",
      },
    ],
    attachments: [
      {
        id: "3",
        filename: "facture-janvier-2024.pdf",
        url: "https://via.placeholder.com/600x800/ff9ff3/ffffff?text=Facture+PDF",
        size: 512000, // 500 KB
        type: "application/pdf",
        uploadedAt: new Date("2025-07-14T16:45:00"),
        uploadedBy: mockUsers[1],
      },
    ],
  },
  {
    id: "3",
    title: "Bug dans l'interface utilisateur",
    description:
      "Il y a un problème d'affichage sur la page de profil. Les informations ne s'affichent pas correctement sur mobile.",
    priority: "low",
    status: "resolved",
    category: "bug_report",
    tags: [
      { id: "tag_ui", label: "Interface", color: "#0288d1" },
      { id: "tag_mobile", label: "Mobile", color: "#1976d2" },
      { id: "tag_resolu", label: "Résolu", color: "#2e7d32" },
    ],
    createdAt: new Date("2025-07-13"),
    updatedAt: new Date("2025-07-14"),
    author: mockUsers[3],
    assignedTo: mockUsers[1],
    hoursSpent: 4.0,
    startDate: new Date("2025-07-14T10:00:00"),
    endDate: new Date("2025-07-14T14:00:00"),
    comments: [
      {
        id: "4",
        content:
          "Le problème a été identifié et corrigé. La mise à jour sera déployée ce soir.",
        createdAt: new Date("2025-07-14T16:30:00"),
        author: mockUsers[1],
        ticketId: "3",
      },
      {
        id: "5",
        content: "Parfait, merci beaucoup !",
        createdAt: new Date("2025-07-14T17:00:00"),
        author: mockUsers[3],
        ticketId: "3",
      },
    ],
    attachments: [
      {
        id: "4",
        filename: "bug-mobile-screenshot.png",
        url: "https://via.placeholder.com/400x800/54a0ff/ffffff?text=Bug+Mobile",
        size: 184320, // 180 KB
        type: "image/png",
        uploadedAt: new Date("2025-07-13T14:20:00"),
        uploadedBy: mockUsers[3],
      },
      {
        id: "5",
        filename: "correction-patch.zip",
        url: "https://via.placeholder.com/300x200/5f27cd/ffffff?text=Patch+Correction",
        size: 102400, // 100 KB
        type: "application/zip",
        uploadedAt: new Date("2025-07-14T16:35:00"),
        uploadedBy: mockUsers[1],
      },
    ],
  },
  {
    id: "4",
    title: "Nouvelle fonctionnalité demandée",
    description:
      "Serait-il possible d'ajouter une fonctionnalité d'export des données en format CSV ? Cela m'aiderait beaucoup pour mes rapports.",
    priority: "medium",
    status: "open",
    category: "feature_request",
    tags: [
      {
        id: "tag_nouvelle_fonctionnalite",
        label: "Nouvelle fonctionnalité",
        color: "#0288d1",
      },
      { id: "tag_export", label: "Export", color: "#9c27b0" },
      { id: "tag_csv", label: "CSV", color: "#1976d2" },
    ],
    createdAt: new Date("2025-07-12"),
    updatedAt: new Date("2025-07-12"),
    author: mockUsers[4],
    assignedTo: mockUsers[2], // Assigné à l'admin Pierre Durand
    comments: [],
    attachments: [
      {
        id: "6",
        filename: "specifications-csv-export.docx",
        url: "https://via.placeholder.com/500x700/00d2d3/ffffff?text=Specifications+CSV",
        size: 307200, // 300 KB
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        uploadedAt: new Date("2025-07-12T10:15:00"),
        uploadedBy: mockUsers[4],
      },
    ],
  },
  {
    id: "5",
    title: "Problème de facturation récurrent",
    description:
      "Je reçois des factures en double depuis 3 mois. Pouvez-vous vérifier mon compte et corriger ce problème ?",
    priority: "high",
    status: "in_progress",
    category: "billing",
    tags: [
      { id: "tag_facturation", label: "Facturation", color: "#9c27b0" },
      { id: "tag_recurrent", label: "Récurrent", color: "#ed6c02" },
      { id: "tag_urgent", label: "Urgent", color: "#d32f2f" },
    ],
    createdAt: new Date("2025-07-10"),
    updatedAt: new Date("2025-07-14"),
    author: mockUsers[0],
    assignedTo: mockUsers[1], // Assigné à l'agent Marie Martin
    hoursSpent: 3.5,
    startDate: new Date("2025-07-14T08:00:00"),
    endDate: new Date("2025-07-14T11:30:00"),
    comments: [
      {
        id: "6",
        content:
          "Je vais examiner votre historique de facturation pour identifier la cause du problème.",
        createdAt: new Date("2025-07-14T09:00:00"),
        author: mockUsers[1],
        ticketId: "5",
      },
      {
        id: "7",
        content:
          "J'ai identifié le problème. Il y a un doublon dans la configuration de facturation automatique.",
        createdAt: new Date("2025-07-14T11:00:00"),
        author: mockUsers[1],
        ticketId: "5",
      },
    ],
    attachments: [
      {
        id: "7",
        filename: "factures-doubles.pdf",
        url: "https://via.placeholder.com/600x800/ff6b6b/ffffff?text=Factures+Doubles",
        size: 245760, // 240 KB
        type: "application/pdf",
        uploadedAt: new Date("2025-07-10T14:30:00"),
        uploadedBy: mockUsers[0],
      },
    ],
  },
];

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[2]); // Admin par défaut

  const handleViewTicket = (ticket: Ticket) => {
    console.log("🔍 Voir le ticket:", ticket);
  };

  const handleEditTicket = (ticket: Ticket) => {
    console.log("✏️ Modifier le ticket:", ticket);
  };

  const handleDeleteTicket = (ticket: Ticket) => {
    console.log("🗑️ Supprimer le ticket:", ticket);
    if (
      confirm(
        `Êtes-vous sûr de vouloir supprimer le ticket "${ticket.title}" ?`
      )
    ) {
      setTickets((prev) => prev.filter((t) => t.id !== ticket.id));
      alert("Ticket supprimé !");
    }
  };

  const handleCreateTicket = async (data: CreateTicketFormData) => {
    console.log("Nouveau ticket créé:", data);

    // Trouver l'utilisateur assigné si spécifié
    const assignedUser = data.assignedTo
      ? mockUsers.find((user) => user.id === data.assignedTo)
      : undefined;

    // Créer un nouveau ticket avec les données du formulaire
    const newTicket: Ticket = {
      id: Date.now().toString(), // ID simple pour la démo
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: "open",
      category: data.category,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: currentUser, // Utilise l'utilisateur actuel
      assignedTo: assignedUser,
      comments: [],
      attachments: [],
    };

    // Ajouter le nouveau ticket à la liste
    setTickets((prev) => [newTicket, ...prev]);

    alert(
      `Ticket créé avec succès !\nTitre: ${data.title}\nCatégorie: ${
        data.category
      }\nPriorité: ${data.priority}${
        assignedUser ? `\nAssigné à: ${assignedUser.name}` : ""
      }`
    );
  };

  const handleUpdateTicket = async (
    ticketId: string,
    data: Partial<UpdateTicketFormData>
  ) => {
    console.log("✏️ Mise à jour du ticket:", ticketId, data);

    // Créer l'objet de mise à jour avec seulement les champs modifiés
    const updateData: Partial<Ticket> = {
      updatedAt: new Date(),
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.assignedTo !== undefined) {
      const assignedUser = mockUsers.find((u) => u.id === data.assignedTo);
      updateData.assignedTo = assignedUser;
    }
    if (data.hoursSpent !== undefined) updateData.hoursSpent = data.hoursSpent;
    if (data.startDate !== undefined) updateData.startDate = data.startDate;
    if (data.endDate !== undefined) updateData.endDate = data.endDate;

    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          return { ...ticket, ...updateData };
        }
        return ticket;
      })
    );

    alert("Ticket mis à jour avec succès !");
  };

  const handleAddComment = async (
    ticketId: string,
    content: string,
    files?: File[]
  ) => {
    console.log("💬 Nouveau commentaire ajouté:", ticketId, content, files);

    // Simuler l'upload des fichiers si présents
    let attachments: any[] = [];
    if (files && files.length > 0) {
      console.log("📎 Upload de", files.length, "fichier(s)...");

      // Simuler un délai d'upload
      await new Promise((resolve) => setTimeout(resolve, 2000));

      attachments = files.map((file, index) => ({
        id: `attachment-${Date.now()}-${index}`,
        filename: file.name,
        url: URL.createObjectURL(file), // Créer une URL temporaire pour la démo
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        uploadedBy: currentUser,
      }));

      console.log("✅ Fichiers uploadés avec succès");
    }

    const newComment = {
      id: Date.now().toString(),
      content,
      createdAt: new Date(),
      author: currentUser, // Utilise l'utilisateur actuel
      ticketId,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            comments: [...(ticket.comments || []), newComment],
            updatedAt: new Date(),
          };
        }
        return ticket;
      })
    );

    console.log("Commentaire ajouté avec succès !");
  };

  const handleCloseTicket = async (ticketId: string) => {
    console.log("🔒 Clôture du ticket:", ticketId);

    if (currentUser.role !== "admin" && currentUser.role !== "agent") {
      alert("Vous n'avez pas les permissions pour clôturer un ticket.");
      return;
    }

    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            status: "closed",
            updatedAt: new Date(),
          };
        }
        return ticket;
      })
    );

    alert("Ticket clôturé avec succès !");
  };

  // Gestion de la suppression de tags
  const handleTagRemoved = async (category: string, tagId: string) => {
    console.log("🗑️ Suppression de tag:", { category, tagId });

    // Ici vous pouvez ajouter votre logique de suppression en base de données
    // Par exemple :
    // await fetch('/api/tags', {
    //   method: 'DELETE',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ category, tagId })
    // });

    console.log(`✅ Tag "${tagId}" supprimé de la catégorie "${category}"`);
  };

  // Gestion de l'ajout de tags
  const handleTagAdded = async (category: string, tag: any): Promise<any> => {
    console.log("➕ Ajout de tag:", { category, tag });

    // Ici vous pouvez ajouter votre logique d'ajout en base de données
    // Par exemple :
    // const response = await fetch('/api/tags', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     category,
    //     label: tag.label,
    //     color: tag.color
    //   })
    // });
    // const savedTag = await response.json();

    // Simuler un délai d'ajout en base
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Retourner le tag avec l'ID généré par le serveur
    const savedTag = {
      id: `tag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      label: tag.label,
      color: tag.color,
    };

    console.log(
      `✅ Tag "${tag.label}" ajouté à la catégorie "${category}" avec l'ID: ${savedTag.id}`
    );
    return savedTag;
  };

  return (
    <HelpdeskProvider
      config={customConfig}
      userRole={currentUser.role}
      currentUser={currentUser}
      users={mockUsers}
      onTagAdded={handleTagAdded}
      onTagRemoved={handleTagRemoved}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
          Next-Helpdesk - Démonstration
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          align="center"
          paragraph
        >
          Bibliothèque React/Next.js pour systèmes de support/ticketing
        </Typography>

        {/* Sélecteur d'utilisateur actuel */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            👤 Sélectionner l'utilisateur actuel
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Changez d'utilisateur pour tester les différentes permissions selon
            les rôles.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {mockUsers.map((user) => (
              <Box
                key={user.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1.5,
                  border: 2,
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  bgcolor:
                    currentUser.id === user.id
                      ? "primary.light"
                      : "background.paper",
                  borderColor:
                    currentUser.id === user.id ? "primary.main" : "divider",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "primary.light",
                  },
                }}
                onClick={() => setCurrentUser(user)}
              >
                {typeof user.avatar === "string" ? (
                  <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                ) : user.avatar ? (
                  <Box sx={{ display: "flex" }}>{user.avatar}</Box>
                ) : (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: "grey.300" }}>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </Avatar>
                )}
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {user.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.role}
                  </Typography>
                </Box>
                {currentUser.id === user.id && (
                  <Chip
                    label="Actuel"
                    size="small"
                    color="primary"
                    sx={{ fontSize: "0.7rem", height: 20 }}
                  />
                )}
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Permissions actuelles ({currentUser.role}) :
            </Typography>
            <Typography variant="body2" component="ul" sx={{ m: 0, pl: 2 }}>
              {currentUser.role === "user" && (
                <>
                  <li>Peut créer des tickets</li>
                  <li>Peut voir ses propres tickets</li>
                  <li>Peut ajouter des commentaires</li>
                  <li>Ne peut pas modifier les tickets</li>
                  <li>Ne peut pas supprimer les tickets</li>
                </>
              )}
              {currentUser.role === "agent" && (
                <>
                  <li>Peut créer des tickets</li>
                  <li>Peut voir tous les tickets</li>
                  <li>Peut modifier les tickets</li>
                  <li>Peut modifier le statut des tickets</li>
                  <li>Peut ajouter des commentaires</li>
                  <li>Peut assigner des tickets</li>
                  <li>Peut clôturer les tickets</li>
                  <li>Ne peut pas supprimer les tickets</li>
                </>
              )}
              {currentUser.role === "admin" && (
                <>
                  <li>Peut créer des tickets</li>
                  <li>Peut voir tous les tickets</li>
                  <li>Peut modifier tous les tickets</li>
                  <li>Peut modifier le statut des tickets</li>
                  <li>Peut ajouter des commentaires</li>
                  <li>Peut assigner des tickets</li>
                  <li>Peut clôturer les tickets</li>
                  <li>Peut supprimer les tickets</li>
                  <li>Accès complet à toutes les fonctionnalités</li>
                </>
              )}
            </Typography>
          </Box>
        </Paper>

        <Stack spacing={4}>
          {/* Section Démonstration des Tags */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              🏷️ Démonstration des Tags
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Les tickets de démonstration incluent maintenant des tags avec des
              couleurs hexadécimales personnalisées. Lors de la création d'un
              nouveau tag, vous pouvez choisir une couleur parmi une palette
              prédéfinie ou utiliser un sélecteur de couleur personnalisé.
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Tags des Tickets de Démonstration
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Voici les tags utilisés dans les tickets de démonstration :
              </Typography>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                <Chip
                  label="Urgent"
                  sx={{ bgcolor: "#d32f2f", color: "white" }}
                  size="small"
                />
                <Chip
                  label="Bug"
                  sx={{ bgcolor: "#f44336", color: "white" }}
                  size="small"
                />
                <Chip
                  label="Connexion"
                  sx={{ bgcolor: "#1976d2", color: "white" }}
                  size="small"
                />
                <Chip
                  label="Remboursement"
                  sx={{ bgcolor: "#ed6c02", color: "white" }}
                  size="small"
                />
                <Chip
                  label="Facturation"
                  sx={{ bgcolor: "#9c27b0", color: "white" }}
                  size="small"
                />
                <Chip
                  label="Interface"
                  sx={{ bgcolor: "#0288d1", color: "white" }}
                  size="small"
                />
                <Chip
                  label="Mobile"
                  sx={{ bgcolor: "#1976d2", color: "white" }}
                  size="small"
                />
                <Chip
                  label="Résolu"
                  sx={{ bgcolor: "#2e7d32", color: "white" }}
                  size="small"
                />
                <Chip
                  label="Nouvelle fonctionnalité"
                  sx={{ bgcolor: "#0288d1", color: "white" }}
                  size="small"
                />
                <Chip
                  label="Export"
                  sx={{ bgcolor: "#9c27b0", color: "white" }}
                  size="small"
                />
                <Chip
                  label="CSV"
                  sx={{ bgcolor: "#1976d2", color: "white" }}
                  size="small"
                />
                <Chip
                  label="Récurrent"
                  sx={{ bgcolor: "#ed6c02", color: "white" }}
                  size="small"
                />
              </Box>

              <Typography variant="body2" color="text.secondary" paragraph>
                Ces tags apparaîtront dans les cartes Kanban et les listes de
                tickets avec leurs couleurs personnalisées.
              </Typography>

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
                🎨 Nouveau : Sélection de couleur lors de la création de tags
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Lorsque vous créez un nouveau tag, un dialog s'ouvre pour vous
                permettre de :
              </Typography>
              <Typography
                variant="body2"
                component="ul"
                sx={{ m: 0, pl: 2, mb: 2 }}
              >
                <li>Choisir parmi 8 couleurs prédéfinies</li>
                <li>Utiliser un sélecteur de couleur personnalisé</li>
                <li>Voir un aperçu en temps réel du tag</li>
                <li>Personnaliser complètement l'apparence de vos tags</li>
              </Typography>
            </Box>
          </Paper>

          {/* Section Composants Communs */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              🧩 Composants Communs Réutilisables
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Composants réutilisables qui se basent sur la configuration du
              contexte Helpdesk.
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                StatusChip
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Composant d'affichage de statut qui utilise automatiquement la
                configuration du contexte :
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="body2">Affichage simple :</Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {(customConfig.statuses || []).map((status) => (
                    <StatusChip
                      key={status.value}
                      status={status.value}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="body2">Avec valeur affichée :</Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {(customConfig.statuses || []).map((status) => (
                    <StatusChip
                      key={status.value}
                      status={status.value}
                      showValue={true}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2">Variante outlined :</Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {(customConfig.statuses || []).map((status) => (
                    <StatusChip
                      key={status.value}
                      status={status.value}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                StatusSelect
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Composant de sélection de statut qui utilise automatiquement la
                configuration du contexte. Voici les statuts disponibles dans la
                configuration actuelle :
              </Typography>

              <HelpdeskProvider
                config={customConfig}
                userRole={currentUser.role}
                currentUser={currentUser}
                users={mockUsers}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">Statuts disponibles :</Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {(customConfig.statuses || []).map((status) => (
                      <StatusChip
                        key={status.value}
                        status={status.value}
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Le composant StatusSelect utilise automatiquement cette
                  configuration et affiche les statuts avec les bonnes couleurs.
                </Typography>
              </HelpdeskProvider>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Personnalisation Dynamique
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Vous pouvez personnaliser les statuts avec vos propres valeurs,
                labels et couleurs :
              </Typography>

              <Box
                component="pre"
                sx={{
                  p: 2,
                  bgcolor: "grey.50",
                  borderRadius: 1,
                  overflow: "auto",
                  fontSize: "0.875rem",
                }}
              >
                {`const customConfig: HelpdeskConfig = {
  // ... autres configurations
  statuses: [
    { value: "new", label: "Nouveau", color: "info" },
    { value: "assigned", label: "Assigné", color: "secondary" },
    { value: "working", label: "En travail", color: "warning" },
    { value: "testing", label: "En test", color: "info" },
    { value: "done", label: "Terminé", color: "success" },
    { value: "cancelled", label: "Annulé", color: "error" },
  ],
  // ... autres configurations
};`}
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Avatars Personnalisés
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Exemples d'avatars avec différents types : URL, ReactNode,
                badges, et initiales automatiques.
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                {mockUsers.map((user, index) => (
                  <Box key={user.id} sx={{ textAlign: "center" }}>
                    <Box sx={{ mb: 1 }}>
                      {typeof user.avatar === "string" ? (
                        <Avatar
                          src={user.avatar}
                          sx={{ width: 50, height: 50, mx: "auto" }}
                        />
                      ) : user.avatar ? (
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          {user.avatar}
                        </Box>
                      ) : (
                        <Avatar
                          sx={{
                            width: 50,
                            height: 50,
                            mx: "auto",
                            bgcolor: "grey.300",
                          }}
                        >
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </Avatar>
                      )}
                    </Box>
                    <Typography variant="caption" display="block">
                      {user.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {user.role}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>

          {/* Section Diagramme de Gantt */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              📊 Diagramme de Gantt des Tickets
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Visualisation des tickets avec leurs dates de début et durées dans
              un diagramme de Gantt interactif.
            </Typography>

            <TicketGanttChart
              tickets={tickets}
              title="Planning des Tickets"
              height={400}
              width={1300}
            />
          </Paper>

          {/* Section Vue Kanban */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              📋 Vue Kanban des Tickets
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Vue Kanban des tickets organisés par statut. Glissez-déposez les
              tickets pour changer leur statut.
            </Typography>

            <TicketKanban
              tickets={tickets}
              onUpdateTicket={handleUpdateTicket}
              onAddComment={handleAddComment}
              onCloseTicket={handleCloseTicket}
              title="Vue Kanban des Tickets"
              height={600}
            />
          </Paper>

          {/* Section TicketList indépendant */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              �� TicketList (Composant indépendant)
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Le composant TicketList peut être utilisé de manière complètement
              indépendante. Il suffit qu'il soit dans le HelpdeskProvider.
              Observez les avatars personnalisés dans la liste des tickets.
            </Typography>

            {/* Bouton de création de ticket */}
            <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
              <CreateTicketButton
                onSubmit={handleCreateTicket}
                variant="button"
                buttonText="Créer un nouveau ticket"
                loading={false}
              />
            </Box>

            <TicketList
              tickets={tickets}
              onViewTicket={handleViewTicket}
              onEditTicket={handleEditTicket}
              onDeleteTicket={handleDeleteTicket}
              onUpdateTicket={handleUpdateTicket}
              onAddComment={handleAddComment}
              onCloseTicket={handleCloseTicket}
              title="Liste des Tickets (Composant indépendant)"
              loading={false}
            />
          </Paper>

          {/* Instructions */}
          <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
            <Typography variant="h6" gutterBottom>
              📖 Instructions de test
            </Typography>
            <Typography variant="body2" component="ul">
              <li>
                Testez les composants StatusChip et StatusSelect dans la section
                "Composants Communs"
              </li>
              <li>
                Observez la personnalisation dynamique des statuts avec valeurs,
                labels et couleurs
              </li>
              <li>
                Observez les différents types d'avatars dans la section "Avatars
                Personnalisés"
              </li>
              <li>
                Cliquez sur "Créer un nouveau ticket" pour tester le formulaire
                de création avec upload de fichiers
              </li>
              <li>
                Utilisez les boutons de vue pour basculer entre tableau et
                cartes
              </li>
              <li>
                Testez les actions (voir, modifier, supprimer) selon votre rôle
              </li>
              <li>
                Testez la modification du statut des tickets (admin/agent
                uniquement)
              </li>
              <li>Observez l'affichage responsive sur mobile</li>
              <li>
                Vérifiez que les labels s'affichent correctement (pas les
                valeurs brutes)
              </li>
            </Typography>
          </Paper>

          {/* Code d'exemple */}
          <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
            <Typography variant="h6" gutterBottom>
              💻 Code d'utilisation des Composants Communs
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
              StatusChip - Affichage de Statut
            </Typography>
            <Box
              component="pre"
              sx={{
                p: 2,
                bgcolor: "white",
                borderRadius: 1,
                overflow: "auto",
                fontSize: "0.875rem",
                mb: 3,
              }}
            >
              {`import { StatusChip } from '@next-helpdesk/core';

// Affichage simple
<StatusChip status="open" size="small" />

// Avec valeur affichée
<StatusChip status="in_progress" showValue={true} />

// Variante outlined
<StatusChip status="resolved" variant="outlined" />

// Le composant utilise automatiquement la configuration du contexte
// et affiche le bon label et la bonne couleur`}
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              StatusSelect avec Configuration Dynamique
            </Typography>
            <Box
              component="pre"
              sx={{
                p: 2,
                bgcolor: "white",
                borderRadius: 1,
                overflow: "auto",
                fontSize: "0.875rem",
                mb: 3,
              }}
            >
              {`import { StatusSelect, HelpdeskConfig } from '@next-helpdesk/core';

// Configuration personnalisée avec statuts dynamiques
const config: HelpdeskConfig = {
  statuses: [
    { value: "new", label: "Nouveau", color: "info" },
    { value: "assigned", label: "Assigné", color: "secondary" },
    { value: "working", label: "En travail", color: "warning" },
    { value: "testing", label: "En test", color: "info" },
    { value: "done", label: "Terminé", color: "success" },
    { value: "cancelled", label: "Annulé", color: "error" },
  ],
  // ... autres configurations
};

// Utilisation du composant
<StatusSelect
  name="status"
  control={control}
  label="Statut"
  placeholder="Sélectionner un statut..."
/>

// Le composant utilise automatiquement la configuration du contexte
// et affiche les statuts avec les bonnes couleurs`}
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              Avatars Personnalisés
            </Typography>
            <Box
              component="pre"
              sx={{
                p: 2,
                bgcolor: "white",
                borderRadius: 1,
                overflow: "auto",
                fontSize: "0.875rem",
              }}
            >
              {`// Avatar avec URL
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
    <Avatar sx={{ bgcolor: 'success.main' }}>
      <Business />
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
      <Avatar sx={{ bgcolor: 'error.main' }}>
        <Star />
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
};`}
            </Box>
          </Paper>

          {/* Démonstration Interactive - Configuration Dynamique */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              🎛️ Démonstration Interactive - Configuration Dynamique
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Testez la personnalisation dynamique des statuts en temps réel.
              Modifiez la configuration et observez les changements.
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Configuration Actuelle des Statuts
              </Typography>
              <HelpdeskProvider
                config={customConfig}
                userRole={currentUser.role}
                currentUser={currentUser}
                users={mockUsers}
              >
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                  {(customConfig.statuses || []).map((status) => (
                    <StatusChip
                      key={status.value}
                      status={status.value}
                      showValue={true}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </HelpdeskProvider>
              <Typography variant="body2" color="text.secondary">
                Cette configuration est utilisée automatiquement par tous les
                composants StatusSelect dans l'application.
              </Typography>
            </Box>

            <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                💡 Avantages de la Configuration Dynamique
              </Typography>
              <Typography variant="body2" component="ul" sx={{ m: 0, pl: 2 }}>
                <li>
                  Personnalisation complète des statuts selon vos besoins métier
                </li>
                <li>Couleurs cohérentes dans toute l'application</li>
                <li>Pas besoin de modifier le code des composants</li>
                <li>Configuration centralisée et réutilisable</li>
                <li>Support de toutes les couleurs Material-UI</li>
              </Typography>
            </Box>
          </Paper>
        </Stack>
      </Container>
    </HelpdeskProvider>
  );
}
