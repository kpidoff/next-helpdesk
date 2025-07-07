import { Chip, ChipProps, IconButton } from "@mui/material";

import { Close } from "@mui/icons-material";
import React from "react";
import { TagConfig } from "../../context/HelpdeskContext";
import { useHelpdesk } from "../../context/HelpdeskContext";

interface TagChipProps extends Omit<ChipProps, "label"> {
  tag: TagConfig;
  showValue?: boolean;
  size?: "small" | "medium";
  category?: string;
  onDelete?: (tagValue: string) => void;
  deletable?: boolean;
  globalDelete?: boolean; // true = suppression de la DB, false = suppression locale
}

export const TagChip: React.FC<TagChipProps> = ({
  tag,
  showValue = false,
  size = "small",
  category,
  onDelete,
  deletable = false,
  globalDelete = false,
  ...chipProps
}) => {
  const { isAdmin, removeTagFromCategory } = useHelpdesk();

  const label = showValue ? `${tag.value}: ${tag.label}` : tag.label;

  const handleDelete = () => {
    if (onDelete) {
      // Suppression locale (dans le formulaire)
      onDelete(tag.value);
    } else if (globalDelete && category && isAdmin) {
      // Suppression globale (de la base de données)
      removeTagFromCategory(category, tag.value);
    }
  };

  const canDelete =
    deletable && (onDelete || (globalDelete && isAdmin && category));

  return (
    <Chip
      label={label}
      color={tag.color || "default"}
      size={size}
      onDelete={canDelete ? handleDelete : undefined}
      {...chipProps}
    />
  );
};
