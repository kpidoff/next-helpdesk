import { ReactNode } from 'react';
import { TagConfig } from '../context/HelpdeskContext';

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
  tags?: TagConfig[];
  createdAt: Date;
  updatedAt: Date;
  author: Omit<User, 'role'>;
  assignedTo?: Omit<User, 'role'>;
  comments?: Comment[];
  attachments?: Attachment[];
  estimatedHours?: number;
  hoursSpent?: number;
  startDate?: Date;
  endDate?: Date;
  branchName?: string;
  tests?: TestItem[];
}

export interface TestItem {
  id: string;
  url: string;
  status: 'pending' | 'passed' | 'failed' | 'in_review';
  createdAt: Date;
  createdBy: Omit<User, 'role'>;
  updatedAt?: Date;
  updatedBy?: Omit<User, 'role'>;
  comments?: TestComment[];
}

export interface TestComment {
  id: string;
  testId: string;
  content: string;
  createdAt: Date;
  createdBy: Omit<User, 'role'>;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: Omit<User, 'role'>;
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
  uploadedBy: Omit<User, 'role'>;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
} 