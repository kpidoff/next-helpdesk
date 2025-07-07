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

  // Vérifier si la fonction de suppression est disponible pour la suppression globale
  if (globalDelete && !removeTagFromCategory) {
    // Si on veut une suppression globale mais que la fonction n'est pas disponible,
    // on désactive la suppression
    deletable = false;
    globalDelete = false;
  }

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
      color="default"
      size={size}
      onDelete={canDelete ? handleDelete : undefined}
      sx={{
        bgcolor: tag.color?.startsWith("#") ? tag.color : undefined,
        color: tag.color?.startsWith("#") ? "white" : undefined,
        ...chipProps.sx,
      }}
      {...chipProps}
    />
  );
};
