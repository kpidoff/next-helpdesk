import {
  Box,
  Collapse,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Control, Controller, useWatch } from "react-hook-form";

import React, { useState } from "react";
import { useHelpdesk } from "../../context/HelpdeskContext";
import { getStatusesForCategory } from "../../utils/status";
import { TestsTable } from "./TestsTable";

interface TimeTrackingFieldsProps {
  control: Control<any>;
  errors?: any;
  disabled?: boolean;
  category?: string;
  currentStatus?: string;
  onStatusChange?: (newStatus: string) => void;
  tests?: import("../../types").TestItem[];
  currentUser: import("../../types").User;
  onAddTest?: (test: Omit<import("../../types").TestItem, 'id' | 'createdAt' | 'createdBy'>) => void;
  onUpdateTest?: (testId: string, updates: Partial<import("../../types").TestItem>) => void;
  onDeleteTest?: (testId: string) => void;
  onAddTestComment?: (testId: string, comment: Omit<import("../../types").TestComment, 'id' | 'testId' | 'createdAt' | 'createdBy'>) => void;
}

export const TimeTrackingFields: React.FC<TimeTrackingFieldsProps> = ({
  control,
  errors,
  disabled = false,
  category,
  currentStatus,
  onStatusChange,
  tests = [],
  currentUser,
  onAddTest,
  onUpdateTest,
  onDeleteTest,
  onAddTestComment,
}) => {
  const { config } = useHelpdesk();
  const [showStatusSelect, setShowStatusSelect] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  // Surveiller les valeurs du formulaire
  const startDate = useWatch({ control, name: "startDate" });
  const estimatedHours = useWatch({ control, name: "estimatedHours" });
  const hoursSpent = useWatch({ control, name: "hoursSpent" });
  
  // Stocker la valeur précédente pour détecter le changement
  const [previousHoursSpent, setPreviousHoursSpent] = useState<number | undefined>(hoursSpent);

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

  // Calculer la différence entre temps passé et temps estimé
  const calculateTimeDifference = (
    estimated: number | undefined,
    spent: number | undefined
  ): { value: number; label: string; color: string } => {
    if (!estimated || !spent) {
      return { value: 0, label: "0h", color: "text.secondary" };
    }

    const difference = spent - estimated;
    const absValue = Math.abs(difference);
    
    if (difference > 0) {
      // Dépassement (en retard)
      return { 
        value: difference, 
        label: `+${difference.toFixed(1)}h`, 
        color: "error.main" 
      };
    } else if (difference < 0) {
      // En avance
      return { 
        value: difference, 
        label: `-${absValue.toFixed(1)}h`, 
        color: "success.main" 
      };
    } else {
      // Pile dans les temps
      return { 
        value: 0, 
        label: "±0h", 
        color: "success.main" 
      };
    }
  };

  const timeDiff = calculateTimeDifference(estimatedHours, hoursSpent);

  // Gérer le blur du champ temps passé
  const handleHoursSpentBlur = () => {
    if (
      hoursSpent !== undefined &&
      hoursSpent > 0 &&
      previousHoursSpent !== undefined &&
      hoursSpent !== previousHoursSpent &&
      !disabled &&
      category &&
      onStatusChange &&
      currentStatus !== "closed" // Ne pas afficher si le ticket est clôturé
    ) {
      setShowStatusSelect(true);
      setSelectedStatus(currentStatus || "");
    }
    setPreviousHoursSpent(hoursSpent);
  };

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  const statuses = category ? getStatusesForCategory(category, config) : [];

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
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

        <Grid item xs={12} md={3}>
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

        <Grid item xs={12} md={3}>
          <Controller
            name="estimatedHours"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Temps estimé (h)"
                type="number"
                fullWidth
                disabled={disabled}
                error={!!errors?.estimatedHours}
                helperText={errors?.estimatedHours?.message}
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
      </Grid>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, mb: 1, display: "block" }}
      >
        La date de fin est calculée automatiquement en ajoutant les heures
        passées à la date de début.
      </Typography>

      {/* Menu déroulant de changement de statut */}
      <Collapse in={showStatusSelect} timeout={300}>
        <Box sx={{ mb: 2, p: 2, border: 1, borderColor: "primary.main", borderRadius: 1, backgroundColor: "primary.light", bgcolor: "rgba(25, 118, 210, 0.08)" }}>
          <Typography variant="body2" gutterBottom color="primary.dark">
            Temps passé renseigné - Voulez-vous changer le statut du ticket ?
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Nouveau statut</InputLabel>
            <Select
              value={selectedStatus}
              label="Nouveau statut"
              onChange={(e) => {
                const newStatus = e.target.value;
                handleStatusChange(newStatus);
                setShowStatusSelect(false);
              }}
            >
              {statuses.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Collapse>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Controller
            name="hoursSpent"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Temps passé (h)"
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
                onBlur={handleHoursSpentBlur}
                size="small"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Écart"
            fullWidth
            disabled
            value={timeDiff.label}
            size="small"
            InputProps={{
              sx: {
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: timeDiff.color,
                  color: timeDiff.color,
                  fontWeight: "bold",
                },
              },
            }}
            FormHelperTextProps={{
              sx: {
                color: timeDiff.color,
                fontWeight: "medium",
                "&.Mui-disabled": {
                  color: timeDiff.color,
                },
              },
            }}
            helperText={
              timeDiff.value > 0
                ? "⚠️ Dépassement du temps estimé"
                : timeDiff.value < 0
                ? "✓ En avance sur le temps estimé"
                : "Temps estimé respecté"
            }
          />
        </Grid>
      </Grid>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, mb: 2, display: "block" }}
      >
        L'écart est calculé automatiquement (positif = dépassement en rouge, négatif = en avance en vert). 
        Lors de la saisie du temps passé, un changement de statut vous sera proposé.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Controller
          name="branchName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nom de la branche"
              type="text"
              fullWidth
              disabled={disabled}
              error={!!errors?.branchName}
              helperText={errors?.branchName?.message || "Ex: feature/ticket-123"}
              placeholder="feature/mon-ticket"
              value={field.value || ""}
              size="small"
            />
          )}
        />
      </Box>

      <TestsTable
        tests={tests}
        disabled={disabled}
        currentUser={currentUser}
        onAddTest={onAddTest}
        onUpdateTest={onUpdateTest}
        onDeleteTest={onDeleteTest}
        onAddComment={onAddTestComment}
      />

    </Box>
  );
};
