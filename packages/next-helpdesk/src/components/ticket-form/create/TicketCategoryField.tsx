import { Control, Controller } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import { CreateTicketFormData } from "@/schemas/ticket";
import React from "react";
import { useHelpdesk } from "@/context/HelpdeskContext";

interface TicketCategoryFieldProps {
  control: Control<CreateTicketFormData>;
  errors: any;
}

export const TicketCategoryField: React.FC<TicketCategoryFieldProps> = ({
  control,
  errors,
}) => {
  const { config } = useHelpdesk();

  return (
    <Controller
      name="category"
      control={control}
      render={({ field }) => (
        <FormControl fullWidth error={!!errors.category}>
          <InputLabel>Catégorie</InputLabel>
          <Select {...field} label="Catégorie">
            {config.categories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
          {errors.category && (
            <Typography variant="caption" color="error">
              {errors.category.message}
            </Typography>
          )}
        </FormControl>
      )}
    />
  );
};
