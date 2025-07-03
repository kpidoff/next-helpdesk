import { Control, Controller } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { CreateTicketFormData } from "@/schemas/ticket";
import React from "react";
import { User } from "@/types";
import { useHelpdesk } from "@/context/HelpdeskContext";

interface TicketPriorityFieldProps {
  control: Control<CreateTicketFormData>;
  errors: any;
  currentUser?: User;
}

export const TicketPriorityField: React.FC<TicketPriorityFieldProps> = ({
  control,
  errors,
  currentUser,
}) => {
  const { config } = useHelpdesk();
  const canEditPriority =
    currentUser?.role === "admin" || currentUser?.role === "agent";

  if (canEditPriority) {
    return (
      <Controller
        name="priority"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.priority}>
            <InputLabel>Priorité</InputLabel>
            <Select {...field} label="Priorité">
              {config.priorities.map((priority) => (
                <MenuItem key={priority.value} value={priority.value}>
                  {priority.label}
                </MenuItem>
              ))}
            </Select>
            {errors.priority && (
              <Typography variant="caption" color="error">
                {errors.priority.message}
              </Typography>
            )}
          </FormControl>
        )}
      />
    );
  }

  return (
    <TextField
      label="Priorité"
      value={
        config.priorities.find((p) => p.value === config.defaultPriority)
          ?.label || config.defaultPriority
      }
      fullWidth
      disabled
      helperText="Seuls les agents et admins peuvent modifier la priorité"
    />
  );
};
