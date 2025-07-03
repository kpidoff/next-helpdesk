import { Control, Controller } from "react-hook-form";

import { CreateTicketFormData } from "@/schemas/ticket";
import React from "react";
import { TextField } from "@mui/material";
import { capitalizeFirstChar } from "@/utils";

interface TicketBasicFieldsProps {
  control: Control<CreateTicketFormData>;
  errors: any;
}

export const TicketBasicFields: React.FC<TicketBasicFieldsProps> = ({
  control,
  errors,
}) => {
  return (
    <>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Titre du ticket"
            fullWidth
            error={!!errors.title}
            helperText={errors.title?.message}
            placeholder="Ex: Problème de connexion à l'application"
            onChange={(e) => {
              const capitalizedValue = capitalizeFirstChar(e.target.value);
              field.onChange(capitalizedValue);
            }}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Description"
            fullWidth
            multiline
            rows={4}
            error={!!errors.description}
            helperText={errors.description?.message}
            placeholder="Décrivez votre problème en détail..."
            onChange={(e) => {
              const capitalizedValue = capitalizeFirstChar(e.target.value);
              field.onChange(capitalizedValue);
            }}
          />
        )}
      />
    </>
  );
};
