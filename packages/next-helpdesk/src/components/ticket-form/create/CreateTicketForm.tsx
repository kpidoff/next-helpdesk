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
import { TicketTagsDisplay } from "./TicketTagsDisplay";
import { TicketTagsField } from "./TicketTagsField";
import { User } from "../../../types";
import { useHelpdesk } from "../../../context/HelpdeskContext";
import { zodResolver } from "@hookform/resolvers/zod";

interface CreateTicketFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTicketFormData) => Promise<void>;
  loading?: boolean;
}

export const CreateTicketForm: React.FC<CreateTicketFormProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const { config, currentUser, users } = useHelpdesk();
  const [previewImage, setPreviewImage] = useState<{
    file: File;
    url: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      priority: config.defaultPriority,
      assignedTo: "",
      tags: [],
      files: [],
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = methods;

  const selectedCategory = watch("category");

  const handleFormSubmit = async (data: CreateTicketFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Erreur lors de la création du ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
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

  const isButtonLoading = loading || isSubmitting;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6">Créer un nouveau ticket</Typography>
      </DialogTitle>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={3}>
              <TicketCategoryField control={control} errors={errors} />

              <TicketPriorityField
                control={control}
                errors={errors}
                currentUser={currentUser}
              />

              <TicketBasicFields control={control} errors={errors} />

              <TicketAssignmentField
                control={control}
                users={users}
                currentUser={currentUser}
              />

              {selectedCategory &&
                (currentUser.role === "admin" ||
                currentUser.role === "agent" ? (
                  <TicketTagsField
                    control={control}
                    errors={errors}
                    category={selectedCategory}
                  />
                ) : (
                  <TicketTagsDisplay category={selectedCategory} />
                ))}

              <TicketFileUpload
                control={control}
                errors={errors}
                loading={isButtonLoading}
                onPreview={handlePreview}
                onRemove={handleRemoveFile}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ borderTop: 1, borderColor: "divider" }}>
            <Button onClick={handleClose} disabled={isButtonLoading}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isButtonLoading}
            >
              {isButtonLoading ? "Création..." : "Créer le ticket"}
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
