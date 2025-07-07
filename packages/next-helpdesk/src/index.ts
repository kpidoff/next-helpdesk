// Composants principaux
export { HelpdeskApp } from './components/app';
export { TicketList } from './components/ticket';
export { Dashboard } from './components/dashboard';
export { CreateTicketButton } from './components/ticket-form';
export { CreateTicketForm } from './components/ticket-form';
export { TicketCard } from './components/ticket';
export { TicketDetailDialog } from './components/ticket-form';
export { TicketChat } from './components/ticket-form';

// Composants communs
export { UserAvatar, UserSelect, StatusSelect, StatusChip, TagChip, TagSelect, PrioritySelect, PriorityChip, TimeTrackingFields, TicketGanttChart, TicketKanban } from './components/common';

// Contexte et hooks
export { HelpdeskProvider, useHelpdesk } from './context/HelpdeskContext';

// Types
export type { 
  Ticket, 
  User, 
  Priority, 
  Comment,
  Attachment
} from './types';

export type { 
  HelpdeskConfig,
  UserRole
} from './context/HelpdeskContext';

// Schémas de validation
export { createTicketSchema, updateTicketSchema } from './schemas/ticket';
export type { CreateTicketFormData, UpdateTicketFormData } from './schemas/ticket';

// Utilitaires
export * from './utils';
