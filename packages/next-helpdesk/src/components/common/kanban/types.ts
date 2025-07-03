import { Ticket, User } from "../../../types";

import { Card as KanbanCard } from "@caldwell619/react-kanban";

export interface TicketKanbanProps {
  tickets: Ticket[];
  onUpdateTicket?: (ticketId: string, data: any) => Promise<void>;
  onAddComment?: (ticketId: string, content: string, files?: File[]) => Promise<void>;
  onCloseTicket?: (ticketId: string) => Promise<void>;
  title?: string;
  height?: number;
}

// Extension du type Card pour inclure les propriétés de Ticket
export interface TicketCard extends KanbanCard {
  priority: string;
  category: string;
  author: User;
  assignedTo?: User;
  createdAt: Date;
  updatedAt: Date;
  hoursSpent?: number;
  comments: any[];
  attachments: any[];
}

export interface KanbanCardProps {
  card: TicketCard;
  onCardClick?: (card: TicketCard) => void;
} 