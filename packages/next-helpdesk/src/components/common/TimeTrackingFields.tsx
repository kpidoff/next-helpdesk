import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Control, Controller, useWatch } from "react-hook-form";

import React from "react";

interface TimeTrackingFieldsProps {
  control: Control<any>;
  errors?: any;
  disabled?: boolean;
}

export const TimeTrackingFields: React.FC<TimeTrackingFieldsProps> = ({
  control,
  errors,
  disabled = false,
}) => {
  // Surveiller les valeurs du formulaire
  const startDate = useWatch({ control, name: "startDate" });
  const hoursSpent = useWatch({ control, name: "hoursSpent" });

  // Calculer automatiquement la date de fin
  const calculateEndDate = (
    start: Date | undefined,
    hours: number | undefined
  ): string => {
    if (!start || !hours || hours <= 0) return "";

    const endDate = new Date(start.getTime() + hours * 60 * 60 * 1000);
    return endDate.toISOString().slice(0, 16); // Format datetime-local
  };

  // Formater la date pour l'input datetime-local
  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return "";
    return date.toISOString().slice(0, 16);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Date de début"
                type="datetime-local"
                fullWidth
                disabled={disabled}
                error={!!errors?.startDate}
                helperText={errors?.startDate?.message}
                InputLabelProps={{
                  shrink: true,
                }}
                value={formatDateForInput(field.value)}
                onChange={(e) => {
                  const date = e.target.value
                    ? new Date(e.target.value)
                    : undefined;
                  field.onChange(date);
                }}
                size="small"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Controller
            name="hoursSpent"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Heures passées"
                type="number"
                fullWidth
                disabled={disabled}
                error={!!errors?.hoursSpent}
                helperText={errors?.hoursSpent?.message}
                inputProps={{
                  min: 0,
                  max: 1000,
                  step: 0.5,
                }}
                value={field.value || ""}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  field.onChange(value);
                }}
                size="small"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Date de fin (calculée)"
                type="datetime-local"
                fullWidth
                disabled={true} // Toujours désactivé car calculé automatiquement
                InputLabelProps={{
                  shrink: true,
                }}
                value={calculateEndDate(startDate, hoursSpent)}
                helperText="Calculée automatiquement"
                size="small"
              />
            )}
          />
        </Grid>
      </Grid>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, display: "block" }}
      >
        La date de fin est calculée automatiquement en ajoutant les heures
        passées à la date de début.
      </Typography>
    </Box>
  );
};
