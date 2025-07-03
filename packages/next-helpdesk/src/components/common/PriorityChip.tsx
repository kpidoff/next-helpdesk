import { Chip, ChipProps } from "@mui/material";

import React from "react";
import { getPriorityColor } from "../../utils/priority";
import { useHelpdesk } from "../../context/HelpdeskContext";

interface PriorityChipProps extends Omit<ChipProps, "label" | "color"> {
  priority: string;
  showValue?: boolean;
  size?: "small" | "medium";
}

export const PriorityChip: React.FC<PriorityChipProps> = ({
  priority,
  showValue = false,
  size = "small",
  ...chipProps
}) => {
  const { config } = useHelpdesk();

  const priorityConfig = config.priorities.find((p) => p.value === priority);
  const color = getPriorityColor(priority, config.priorities);

  const label = showValue
    ? `${priority}: ${priorityConfig?.label || priority}`
    : priorityConfig?.label || priority;

  return <Chip label={label} color={color} size={size} {...chipProps} />;
};
