import { Column, KanbanBoard } from "@caldwell619/react-kanban";

import { Ticket } from "../../../../types";
import { TicketCard } from "../types";
import { useMemo } from "react";

export const useKanbanBoard = (
  tickets: Ticket[],
  categories: any[],
  selectedCategory: string
) => {
  // Convertir les tickets en cartes Kanban
  const convertTicketsToCards = (tickets: Ticket[]): TicketCard[] => {
    return tickets.map((ticket) => ({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      category: ticket.category,
      author: ticket.author,
      assignedTo: ticket.assignedTo,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      hoursSpent: ticket.hoursSpent,
      comments: ticket.comments || [],
      attachments: ticket.attachments || [],
    }));
  };

  // Tickets filtrés par catégorie sélectionnée
  const filteredTickets = useMemo(
    () => tickets.filter((t) => t.category === selectedCategory),
    [tickets, selectedCategory]
  );

  // Colonnes dynamiques selon la catégorie sélectionnée
  const kanbanBoard: KanbanBoard<TicketCard> = useMemo(() => {
    const cards = convertTicketsToCards(filteredTickets);
    const cat = categories.find((c) => c.value === selectedCategory);
    const statuses = cat?.statuses || [];
    
    const columns: Column<TicketCard>[] = statuses.map((status: any) => ({
      id: status.value,
      title: status.label,
      cards: cards.filter((card) => {
        const ticket = filteredTickets.find((t) => t.id === card.id);
        return ticket?.status === status.value;
      }),
    }));
    
    return { columns };
  }, [filteredTickets, categories, selectedCategory]);

  return {
    kanbanBoard,
    filteredTickets,
  };
}; 