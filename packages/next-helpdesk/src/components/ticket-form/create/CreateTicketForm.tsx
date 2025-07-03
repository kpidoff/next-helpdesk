import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import {
  CreateTicketFormData,
  createTicketSchema,
} from "../../../schemas/ticket";
import { FormProvider, useForm } from "react-hook-form";
import React, { useState } from "react";

import { FilePreviewDialog } from "../common/FilePreviewDialog";
import { TicketAssignmentField } from "./TicketAssignmentField";
import { TicketBasicFields } from "./TicketBasicFields";
import { TicketCategoryField } from "./TicketCategoryField";
import { TicketFileUpload } from "../common/TicketFileUpload";
import { TicketPriorityField } from "./TicketPriorityField";
import { User } from "../../../types";
import { useHelpdesk } from "../../../context/HelpdeskContext";
import { zodResolver } from "@hookform/resolvers/zod";

interface CreateTicketFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTicketFormData) => void;
  loading?: boolean;
  users?: User[];
  currentUser?: User;
}

export const CreateTicketForm: React.FC<CreateTicketFormProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  users = [],
  currentUser,
}) => {
  const { config } = useHelpdesk();
  const [previewImage, setPreviewImage] = useState<{
    file: File;
    url: string;
  } | null>(null);

  const methods = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      priority: config.defaultPriority,
      assignedTo: "",
      files: [],
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const handleFormSubmit = (data: CreateTicketFormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handlePreview = (file: File, url: string) => {
    setPreviewImage({ file, url });
  };

  const handleRemoveFile = (fileToRemove: File) => {
    // La logique de suppression sera gérée par le composant TicketFileUpload
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6">Créer un nouveau ticket</Typography>
      </DialogTitle>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={3}>
              <TicketBasicFields control={control} errors={errors} />

              <TicketCategoryField control={control} errors={errors} />

              <TicketPriorityField
                control={control}
                errors={errors}
                currentUser={currentUser}
              />

              <TicketAssignmentField
                control={control}
                users={users}
                currentUser={currentUser}
              />

              <TicketFileUpload
                control={control}
                errors={errors}
                loading={loading}
                onPreview={handlePreview}
                onRemove={handleRemoveFile}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ borderTop: 1, borderColor: "divider" }}>
            <Button onClick={handleClose} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Création..." : "Créer le ticket"}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>

      <FilePreviewDialog
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        previewImage={previewImage}
      />
    </Dialog>
  );
};
