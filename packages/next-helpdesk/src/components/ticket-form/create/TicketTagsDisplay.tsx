import { Box, Typography } from "@mui/material";

import React from "react";
import { TagChip } from "../../common/TagChip";
import { useHelpdesk } from "../../../context/HelpdeskContext";

interface TicketTagsDisplayProps {
  category: string;
}

export const TicketTagsDisplay: React.FC<TicketTagsDisplayProps> = ({
  category,
}) => {
  const { getTagsForCategory } = useHelpdesk();
  const availableTags = getTagsForCategory(category);

  if (availableTags.length === 0) {
    return (
      <Box
        sx={{
          p: 2,
          bgcolor: "grey.50",
          borderRadius: 1,
          border: 1,
          borderColor: "grey.200",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          📋 <strong>Tags disponibles :</strong> Aucun tag défini pour cette
          catégorie.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "grey.50",
        borderRadius: 1,
        border: 1,
        borderColor: "grey.200",
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        📋 <strong>Tags disponibles pour cette catégorie :</strong>
      </Typography>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {availableTags.map((tag) => (
          <TagChip
            key={tag.value}
            tag={tag}
            size="small"
            category={category}
            deletable={true}
            globalDelete={true}
          />
        ))}
      </Box>
    </Box>
  );
};
