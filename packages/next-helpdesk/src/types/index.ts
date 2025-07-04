import { ReactNode } from 'react';

export type Priority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | ReactNode | null;
  role: 'user' | 'admin' | 'agent';
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  author: Omit<User, 'role'>;
  assignedTo?: Omit<User, 'role'>;
  comments?: Comment[];
  attachments?: Attachment[];
  hoursSpent?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: User;
  ticketId: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
  uploadedBy: User;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
} 