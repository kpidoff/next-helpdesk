import { Box, Button, Typography } from "@mui/material";
import { Control, useFormContext, useWatch } from "react-hook-form";
import React, { useRef } from "react";

import { CreateTicketFormData } from "@/schemas/ticket";
import { FilePreview } from "./FilePreview";
import { useHelpdesk } from "@/context/HelpdeskContext";

interface TicketFileUploadProps {
  control: Control<CreateTicketFormData>;
  errors: any;
  loading?: boolean;
  onPreview: (file: File, url: string) => void;
  onRemove: (file: File) => void;
}

export const TicketFileUpload: React.FC<TicketFileUploadProps> = ({
  control,
  errors,
  loading = false,
  onPreview,
  onRemove,
}) => {
  const { config } = useHelpdesk();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedFiles = useWatch({ control, name: "files" }) || [];
  const { setValue } = useFormContext<CreateTicketFormData>();

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const all = [...selectedFiles, ...files];
    const unique = all.filter(
      (file: File, idx: number, arr: File[]) =>
        arr.findIndex(
          (f: File) => f.name === file.name && f.size === file.size
        ) === idx
    );

    setValue("files", unique);
  };

  const handleRemoveFile = (fileToRemove: File) => {
    const filtered = selectedFiles.filter(
      (file: File) =>
        file.name !== fileToRemove.name || file.size !== fileToRemove.size
    );
    setValue("files", filtered);
  };

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={handleFilesChange}
        accept={config.allowedFileTypes?.join(",")}
      />
      <Button
        variant="outlined"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
      >
        Ajouter des fichiers
      </Button>

      {selectedFiles.length > 0 && (
        <Box mt={1}>
          <Typography variant="caption" color="text.secondary">
            Fichiers sélectionnés :
          </Typography>
          <Box display="flex" flexDirection="column" gap={1} mt={1}>
            {selectedFiles.map((file: File, idx: number) => (
              <FilePreview
                key={idx}
                file={file}
                onPreview={onPreview}
                onRemove={handleRemoveFile}
              />
            ))}
          </Box>
        </Box>
      )}

      {errors.files && (
        <Typography variant="caption" color="error">
          {errors.files.message as string}
        </Typography>
      )}
    </Box>
  );
};
