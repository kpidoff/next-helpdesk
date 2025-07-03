import { Avatar, Box, IconButton, Typography } from "@mui/material";

import { Attachment } from "@/types";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import Download from "@mui/icons-material/Download";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import React from "react";
import TableChartIcon from "@mui/icons-material/TableChart";

export interface AttachmentPreviewProps {
  attachment: Attachment;
  onPreview?: (attachment: Attachment) => void;
  onRemove?: (attachment: Attachment) => void;
  showRemove?: boolean;
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachment,
  onPreview,
  onRemove,
  showRemove = false,
}) => {
  const getFileIcon = () => {
    if (attachment.type === "application/pdf") {
      return <PictureAsPdfIcon color="error" />;
    } else if (
      attachment.type.includes("spreadsheet") ||
      attachment.filename.endsWith(".xlsx") ||
      attachment.filename.endsWith(".xls")
    ) {
      return <TableChartIcon color="success" />;
    } else if (
      attachment.type.includes("document") ||
      attachment.filename.endsWith(".docx") ||
      attachment.filename.endsWith(".doc")
    ) {
      return <DescriptionIcon color="primary" />;
    } else if (attachment.type.startsWith("image/")) {
      return <PictureAsPdfIcon color="primary" />;
    } else {
      return <InsertDriveFileIcon color="action" />;
    }
  };

  const canPreview =
    attachment.type.startsWith("image/") ||
    attachment.type === "application/pdf";

  const handlePreview = () => {
    if (canPreview && onPreview) {
      onPreview(attachment);
    }
  };

  const handleDownload = () => {
    // Créer un lien temporaire pour le téléchargement
    const link = document.createElement("a");
    link.href = attachment.url;
    link.download = attachment.filename;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    // Déclencher le téléchargement
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      sx={{ position: "relative" }}
    >
      {attachment.type.startsWith("image/") ? (
        <Avatar
          src={attachment.url}
          alt={attachment.filename}
          variant="rounded"
          sx={{
            width: 40,
            height: 40,
            cursor: onPreview ? "pointer" : undefined,
          }}
          onClick={handlePreview}
        />
      ) : (
        <Avatar
          variant="rounded"
          sx={{
            width: 40,
            height: 40,
            bgcolor: "grey.200",
            cursor: canPreview && onPreview ? "pointer" : undefined,
          }}
          onClick={handlePreview}
        >
          {getFileIcon()}
        </Avatar>
      )}
      <Box flex={1}>
        <Typography
          variant="body2"
          noWrap
          maxWidth={120}
          title={attachment.filename}
        >
          {attachment.filename}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {(attachment.size / 1024).toFixed(1)} Ko
        </Typography>
      </Box>
      <Box display="flex" gap={0.5}>
        {/* Bouton de téléchargement */}
        <IconButton
          size="small"
          onClick={handleDownload}
          sx={{
            color: "primary.main",
            "&:hover": { backgroundColor: "primary.light" },
          }}
          title="Télécharger"
        >
          <Download fontSize="small" />
        </IconButton>

        {/* Bouton de suppression (si activé) */}
        {showRemove && onRemove && (
          <IconButton
            size="small"
            onClick={() => onRemove(attachment)}
            sx={{
              color: "error.main",
              "&:hover": { backgroundColor: "error.light" },
            }}
            title="Supprimer"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};
