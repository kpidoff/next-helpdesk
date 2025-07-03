import { Chip, ChipProps } from "@mui/material";
import { getStatusColor, getStatusLabel } from "../../utils/status";

import React from "react";
import { Status } from "../../types";
import { useHelpdesk } from "../../context/HelpdeskContext";

interface StatusChipProps extends Omit<ChipProps, "label"> {
  status: Status;
  category?: string; // Catégorie optionnelle pour obtenir les statuts spécifiques
  showValue?: boolean;
  size?: "small" | "medium";
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  category,
  showValue = false,
  size = "small",
  ...chipProps
}) => {
  const { config, getStatusesForCategory } = useHelpdesk();

  // Utiliser les statuts de la catégorie si fournie, sinon les statuts globaux
  const statuses = category
    ? getStatusesForCategory(category)
    : config.statuses || [];

  const statusConfig = statuses.find((s) => s.value === status);
  const color = getStatusColor(status, statuses);

  const label = showValue
    ? `${status}: ${statusConfig?.label || status}`
    : statusConfig?.label || status;

  return <Chip label={label} color={color} size={size} {...chipProps} />;
};
