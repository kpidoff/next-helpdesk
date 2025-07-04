import { Box, Chip, Divider, Stack, Typography } from "@mui/material";

import { PriorityChip } from "../PriorityChip";
import React from "react";
import { TicketCard } from "./types";
import { UserAvatar } from "../UserAvatar";
import { useHelpdesk } from "../../../context/HelpdeskContext";

interface KanbanCardProps {
  card: TicketCard;
  onCardClick?: (card: TicketCard) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  card,
  onCardClick,
}) => {
  const { config } = useHelpdesk();

  const getCategoryLabel = (category: string) => {
    const categoryConfig = config.categories?.find((c) => c.value === category);
    return categoryConfig?.label || category;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <Box
      onClick={() => onCardClick?.(card)}
      sx={{
        p: 2,
        border: "1px solid #e0e0e0",
        borderRadius: 1,
        backgroundColor: "white",
        maxWidth: 300,
        minWidth: 220,
        mx: "auto",
        cursor: "pointer",
        "&:hover": {
          boxShadow: 2,
          borderColor: "primary.main",
        },
      }}
    >
      {/* En-tête de la carte */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          {card.title}
        </Typography>

        {/* Priorité et catégorie */}
        <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
          <PriorityChip priority={card.priority} size="small" />
        </Box>
      </Box>

      {/* Description */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {card.description && card.description.length > 100
          ? `${card.description.substring(0, 100)}...`
          : card.description || "Aucune description"}
      </Typography>

      {/* Informations de la carte */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
          p: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Créé par
        </Typography>
        <UserAvatar user={card.author} size={16} />
      </Box>

      {/* Métadonnées et assignation */}
      <Box sx={{ mt: 2 }}>
        {/* Assignation - Section dédiée */}
        {card.assignedTo && (
          <>
            <Divider />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
                p: 1,
                pt: 2,
                pb: 2,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Assigné à
              </Typography>
              <UserAvatar user={card.assignedTo} size={16} />
            </Box>
          </>
        )}

        {/* Divider */}
        <Box sx={{ my: 1 }}>
          <Divider />
        </Box>

        {/* Indicateurs et date */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            {card.hoursSpent && (
              <Chip
                label={`⏱️ ${card.hoursSpent}h`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem", height: 20 }}
              />
            )}
            {card.comments.length > 0 && (
              <Chip
                label={`💬 ${card.comments.length}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem", height: 20 }}
              />
            )}
            {card.attachments.length > 0 && (
              <Chip
                label={`📎 ${card.attachments.length}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem", height: 20 }}
              />
            )}
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
          >
            {formatDate(card.createdAt)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
