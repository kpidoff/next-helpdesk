import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Control, Controller } from "react-hook-form";

import React from "react";
import { getPriorityColor } from "../../utils/priority";
import { useHelpdesk } from "../../context/HelpdeskContext";

interface PrioritySelectProps {
  name: string;
  control: Control<any>;
  label?: string;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  size?: "small" | "medium";
  fullWidth?: boolean;
  disabled?: boolean;
  sx?: any;
}

export const PrioritySelect: React.FC<PrioritySelectProps> = ({
  name,
  control,
  label = "Priorité",
  error = false,
  helperText,
  placeholder = "Sélectionner une priorité...",
  size = "medium",
  fullWidth = true,
  disabled = false,
  sx,
}) => {
  const { config } = useHelpdesk();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl
          fullWidth={fullWidth}
          error={error}
          size={size}
          disabled={disabled}
          sx={sx}
        >
          <InputLabel>{label}</InputLabel>
          <Select
            {...field}
            label={label}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <Typography color="text.secondary">{placeholder}</Typography>
                );
              }
              const selectedPriority = config.priorities.find(
                (priority) => priority.value === selected
              );
              if (!selectedPriority) return null;
              return (
                <Chip
                  label={selectedPriority.label}
                  color={getPriorityColor(
                    selectedPriority.value,
                    config.priorities
                  )}
                  size="small"
                  sx={{ fontSize: size === "small" ? "0.7rem" : "0.75rem" }}
                />
              );
            }}
          >
            <MenuItem value="">
              <Typography color="text.secondary">{placeholder}</Typography>
            </MenuItem>
            {config.priorities.map((priority) => (
              <MenuItem key={priority.value} value={priority.value}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip
                    label={priority.label}
                    color={getPriorityColor(priority.value, config.priorities)}
                    size="small"
                    sx={{ fontSize: size === "small" ? "0.7rem" : "0.75rem" }}
                  />
                </Box>
              </MenuItem>
            ))}
          </Select>
          {helperText && (
            <Typography variant="caption" color="error">
              {helperText}
            </Typography>
          )}
        </FormControl>
      )}
    />
  );
};
