import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Control, Controller } from "react-hook-form";

import React from "react";
import { StatusChip } from "./StatusChip";
import { getStatusesForCategory } from "../../utils/status";
import { useHelpdesk } from "../../context/HelpdeskContext";

interface StatusSelectProps {
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
  category?: string;
}

export const StatusSelect: React.FC<StatusSelectProps> = ({
  name,
  control,
  label = "Statut",
  error = false,
  helperText,
  placeholder = "Sélectionner un statut...",
  size = "medium",
  fullWidth = true,
  disabled = false,
  sx,
  category,
}) => {
  const { config } = useHelpdesk();
  const statuses = getStatusesForCategory(category, config);

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
              const selectedStatus = statuses.find(
                (status) => status.value === selected
              );
              if (!selectedStatus) return null;
              return (
                <StatusChip
                  status={selectedStatus.value}
                  size="small"
                  sx={{ fontSize: size === "small" ? "0.7rem" : "0.75rem" }}
                />
              );
            }}
          >
            <MenuItem value="">
              <Typography color="text.secondary">{placeholder}</Typography>
            </MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                <Box display="flex" alignItems="center" gap={1}>
                  <StatusChip
                    status={status.value}
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
