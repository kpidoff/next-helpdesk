import { Ticket, User } from "../../../types";

import { Card as KanbanCard } from "@caldwell619/react-kanban";
import { TagConfig } from "../../../context/HelpdeskContext";
import { UpdateTicketFormData } from "@/schemas/ticket";

export interface TicketKanbanProps {
  tickets: Ticket[];
  onUpdateTicket?: (ticketId: string, data: Partial<UpdateTicketFormData>) => Promise<void>;
  onAddComment?: (ticketId: string, content: string, files?: File[]) => Promise<void>;
  onCloseTicket?: (ticketId: string) => Promise<void>;
  
  // Callbacks spécifiques pour les tests
  onAddTest?: (ticketId: string, test: Omit<any, 'id' | 'createdAt' | 'createdBy'>) => Promise<void>;
  onUpdateTest?: (ticketId: string, testId: string, updates: Partial<any>) => Promise<void>;
  onDeleteTest?: (ticketId: string, testId: string) => Promise<void>;
  onAddTestComment?: (ticketId: string, testId: string, comment: Omit<any, 'id' | 'testId' | 'createdAt' | 'createdBy'>) => Promise<void>;
  
  title?: string;
  description?: string;
  height?: number;
}

// Extension du type Card pour inclure les propriétés de Ticket
export interface TicketCard extends KanbanCard {
  priority: string;
  category: string;
  tags?: TagConfig[];
  author: Omit<User, "role">;
  assignedTo?: Omit<User, "role">;
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