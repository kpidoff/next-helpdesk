import { Avatar, Box, IconButton, Typography } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import React from "react";
import TableChartIcon from "@mui/icons-material/TableChart";

export interface FilePreviewProps {
  file: File;
  onPreview?: (file: File, url: string) => void;
  onRemove?: (file: File) => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onPreview,
  onRemove,
}) => {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const getFileIcon = () => {
    if (file.type === "application/pdf") {
      return <PictureAsPdfIcon color="error" />;
    } else if (
      file.type.includes("spreadsheet") ||
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls")
    ) {
      return <TableChartIcon color="success" />;
    } else if (
      file.type.includes("document") ||
      file.name.endsWith(".docx") ||
      file.name.endsWith(".doc")
    ) {
      return <DescriptionIcon color="primary" />;
    } else {
      return <InsertDriveFileIcon color="action" />;
    }
  };

  const canPreview =
    file.type.startsWith("image/") || file.type === "application/pdf";

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      sx={{ position: "relative" }}
    >
      {previewUrl && file.type.startsWith("image/") ? (
        <Avatar
          src={previewUrl}
          alt={file.name}
          variant="rounded"
          sx={{
            width: 40,
            height: 40,
            cursor: onPreview ? "pointer" : undefined,
          }}
          onClick={() => onPreview && previewUrl && onPreview(file, previewUrl)}
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
          onClick={() =>
            canPreview && onPreview && previewUrl && onPreview(file, previewUrl)
          }
        >
          {getFileIcon()}
        </Avatar>
      )}
      <Box flex={1}>
        <Typography variant="body2" noWrap maxWidth={120} title={file.name}>
          {file.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {(file.size / 1024).toFixed(1)} Ko
        </Typography>
      </Box>
      {onRemove && (
        <IconButton
          size="small"
          onClick={() => onRemove(file)}
          sx={{
            color: "error.main",
            "&:hover": { backgroundColor: "error.light" },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};
