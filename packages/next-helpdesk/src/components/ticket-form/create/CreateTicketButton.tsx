import { Button, Fab } from "@mui/material";
import React, { useState } from "react";

import { Add } from "@mui/icons-material";
import { CreateTicketForm } from "./CreateTicketForm";
import { CreateTicketFormData } from "@/schemas/ticket";

interface CreateTicketButtonProps {
  onSubmit: (data: CreateTicketFormData) => Promise<void>;
  loading?: boolean;
  variant?: "button" | "fab";
  buttonText?: string;
}

export const CreateTicketButton: React.FC<CreateTicketButtonProps> = ({
  onSubmit,
  loading = false,
  variant = "button",
  buttonText = "Nouveau ticket",
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (data: CreateTicketFormData) => {
    await onSubmit(data);
    handleClose();
  };

  return (
    <>
      {variant === "fab" ? (
        <Fab
          color="primary"
          aria-label="Créer un ticket"
          onClick={handleOpen}
          disabled={loading}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Add />
        </Fab>
      ) : (
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpen}
          disabled={loading}
        >
          {buttonText}
        </Button>
      )}

      <CreateTicketForm
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </>
  );
};
