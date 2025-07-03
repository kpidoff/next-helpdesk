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
});

export type CreateTicketFormData = z.infer<typeof createTicketSchema>;
export type UpdateTicketFormData = z.infer<typeof updateTicketSchema>; 