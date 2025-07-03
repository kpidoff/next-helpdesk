import { Box, Dialog, Typography } from "@mui/material";

import React from "react";

interface FilePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  previewImage: {
    file: File;
    url: string;
  } | null;
}

export const FilePreviewDialog: React.FC<FilePreviewDialogProps> = ({
  open,
  onClose,
  previewImage,
}) => {
  if (!previewImage) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <Box p={2} display="flex" flexDirection="column" alignItems="center">
        {previewImage.file.type.startsWith("image/") ? (
          <img
            src={previewImage.url}
            alt={previewImage.file.name}
            style={{ maxWidth: 600, maxHeight: 400, borderRadius: 8 }}
          />
        ) : previewImage.file.type === "application/pdf" ? (
          <iframe
            src={previewImage.url}
            width="600"
            height="400"
            style={{ border: "none", borderRadius: 8 }}
            title={previewImage.file.name}
          />
        ) : null}
        <Typography variant="body2" mt={2}>
          {previewImage.file.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {(previewImage.file.size / 1024).toFixed(1)} Ko
        </Typography>
      </Box>
    </Dialog>
  );
};
