import "@caldwell619/react-kanban/dist/styles.css";

import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import { KanbanCard } from "./KanbanCard";
import { Ticket } from "../../../types";
import { TicketDetailDialog } from "../../ticket-form/edit";
import type { TicketKanbanProps } from "./types";
import { UncontrolledBoard } from "@caldwell619/react-kanban";
import { useHelpdesk } from "../../../context/HelpdeskContext";
import { useKanbanBoard } from "./hooks/useKanbanBoard";

export const TicketKanban: React.FC<TicketKanbanProps> = ({
  tickets,
  onUpdateTicket,
  onAddComment,
  onCloseTicket,
  title = "Vue Kanban des Tickets",
  height = 600,
}) => {
  const { config, currentUser, users } = useHelpdesk();
  const categories = config.categories || [];
  const [selectedCategory, setSelectedCategory] = useState(() => {
    // Trouver la première catégorie qui a des tickets
    const categoryWithTickets = categories.find((cat) => {
      const ticketCount = tickets.filter(
        (t) => t.category === cat.value
      ).length;
      return ticketCount > 0;
    });
    return categoryWithTickets?.value || "";
  });
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { kanbanBoard } = useKanbanBoard(tickets, categories, selectedCategory);

  // Mettre à jour le ticket sélectionné quand les tickets changent
  useEffect(() => {
    if (selectedTicket) {
      const updatedTicket = tickets.find((t) => t.id === selectedTicket.id);
      if (updatedTicket) {
        setSelectedTicket(updatedTicket);
      }
    }
  }, [tickets, selectedTicket]);

  // Composant personnalisé pour rendre les cartes
  const renderCard = (card: any) => {
    return (
      <KanbanCard
        card={card}
        onCardClick={(card) => {
          // Trouver le ticket correspondant et ouvrir le dialog
          const ticket = tickets.find((t) => t.id === card.id);
          if (ticket) {
            setSelectedTicket(ticket);
            setDialogOpen(true);
          }
        }}
      />
    );
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Vue Kanban des tickets organisés par statut. Glissez-déposez les tickets
        pour changer leur statut.
      </Typography>

      {/* Sélecteur d'onglets de catégorie */}
      <Tabs
        value={selectedCategory}
        onChange={(_, v) => setSelectedCategory(v)}
        sx={{ mb: 2 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {categories
          .filter((cat) => {
            const ticketCount = tickets.filter(
              (t) => t.category === cat.value
            ).length;
            return ticketCount > 0;
          })
          .map((cat) => {
            const ticketCount = tickets.filter(
              (t) => t.category === cat.value
            ).length;
            return (
              <Tab
                key={cat.value}
                value={cat.value}
                label={`${cat.label} (${ticketCount})`}
              />
            );
          })}
      </Tabs>

      <Box sx={{ height: height, overflow: "hidden" }}>
        <UncontrolledBoard
          key={selectedCategory}
          initialBoard={kanbanBoard}
          renderCard={renderCard}
          allowAddCard={false}
          allowRemoveCard={false}
          onCardDragEnd={(board: any, source: any, destination: any) => {
            // Trouver la nouvelle colonne de la carte dans le board mis à jour
            if (onUpdateTicket && source?.id) {
              let newStatus = null;

              // Parcourir toutes les colonnes pour trouver où se trouve maintenant la carte
              for (const column of board.columns) {
                const cardInColumn = column.cards.find(
                  (card: any) => card.id === source.id
                );
                if (cardInColumn) {
                  newStatus = column.id;
                  break;
                }
              }

              if (newStatus) {
                onUpdateTicket(String(source.id), {
                  status: newStatus,
                });
              } else {
                console.warn("Could not find card in any column after move");
              }
            } else {
              console.warn("Missing required data for update:", {
                hasOnUpdateTicket: !!onUpdateTicket,
                hasSourceId: !!source?.id,
                destination,
              });
            }
          }}
        />
      </Box>

      {/* Dialog de détail du ticket */}
      {selectedTicket && currentUser && (
        <TicketDetailDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setSelectedTicket(null);
          }}
          ticket={selectedTicket}
          currentUser={currentUser}
          users={users}
          onUpdateTicket={onUpdateTicket}
          onAddComment={onAddComment}
          onCloseTicket={onCloseTicket}
          mode="view"
        />
      )}
    </Paper>
  );
};
