import { z } from 'zod';

export const createTicketSchema = z.object({
  title: z
    .string()
    .min(5, 'Le titre doit contenir au moins 5 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  description: z
    .string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(1000, 'La description ne peut pas dépasser 1000 caractères'),
  category: z
    .string()
    .min(1, 'Veuillez sélectionner une catégorie'),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Veuillez sélectionner une priorité',
  }),
  assignedTo: z
    .string()
    .optional(),
  tags: z
    .array(z.object({
      id: z.string(),
      label: z.string(),
      color: z.string().optional(), // Support des couleurs hexadécimales
    }))
    .optional(),
  files: z
    .any()
    .optional()
    .refine(
      (files) =>
        !files ||
        (Array.isArray(files) && files.every((f) => f instanceof File)),
      {
        message: 'Les fichiers doivent être de type File',
      }
    ),
});

export const updateTicketSchema = createTicketSchema.extend({
  status: z.string().optional(),
  estimatedHours: z
    .number()
    .min(0, 'Le nombre d\'heures ne peut pas être négatif')
    .max(1000, 'Le nombre d\'heures ne peut pas dépasser 1000')
    .optional(),
  hoursSpent: z
    .number()
    .min(0, 'Le nombre d\'heures ne peut pas être négatif')
    .max(1000, 'Le nombre d\'heures ne peut pas dépasser 1000')
    .optional(),
  startDate: z
    .date()
    .optional(),
  endDate: z
    .date()
    .optional(),
  branchName: z
    .string()
    .max(100, 'Le nom de la branche ne peut pas dépasser 100 caractères')
    .optional(),
  tests: z.array(z.object({
    id: z.string(),
    url: z.string().url(),
    status: z.enum(['pending', 'passed', 'failed', 'in_review']),
    createdAt: z.date(),
    createdBy: z.any(),
    updatedAt: z.date().optional(),
    updatedBy: z.any().optional(),
    comments: z.array(z.object({
      id: z.string(),
      testId: z.string(),
      content: z.string(),
      createdAt: z.date(),
      createdBy: z.any(),
    })).optional(),
  })).optional(),
});

export type CreateTicketFormData = z.infer<typeof createTicketSchema>;
export type UpdateTicketFormData = z.infer<typeof updateTicketSchema>; 