import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Attachment, Ticket, User } from "../../../types";
import {
  Cancel,
  Close,
  Download,
  Edit,
  ExpandMore,
  Save,
} from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import {
  PrioritySelect,
  StatusSelect,
  TagChip,
  TagSelect,
  TimeTrackingFields,
  UserAvatar,
  UserSelect,
} from "../../common";
import React, { useEffect, useState } from "react";
import {
  UpdateTicketFormData,
  updateTicketSchema,
} from "../../../schemas/ticket";
import { getPriorityColor, getPriorityLabel } from "../../../utils/priority";
import {
  getStatusColor,
  getStatusLabel,
  getStatusesForCategory,
} from "../../../utils/status";

import { AttachmentPreview } from "../common/AttachmentPreview";
import { FilePreview } from "../common/FilePreview";
import { TicketChat } from "../chat/TicketChat";
import { capitalizeFirstChar } from "../../../utils/string";
import { useHelpdesk } from "../../../context/HelpdeskContext";
import { zodResolver } from "@hookform/resolvers/zod";

interface TicketDetailDialogProps {
  open: boolean;
  onClose: () => void;
  ticket: Ticket;

  onUpdateTicket?: (
    ticketId: string,
    data: Partial<UpdateTicketFormData>
  ) => Promise<void>;
  onAddComment?: (
    ticketId: string,
    content: string,
    files?: File[]
  ) => Promise<void>;
  onCloseTicket?: (ticketId: string) => Promise<void>;
  loading?: boolean;
  mode?: "view" | "edit";
}

export const TicketDetailDialog: React.FC<TicketDetailDialogProps> = ({
  open,
  onClose,
  ticket,
  onUpdateTicket,
  onAddComment,
  onCloseTicket,
  loading = false,
  mode = "view",
}) => {
  const { config, currentUser, users } = useHelpdesk();
  const [isEditing, setIsEditing] = useState(mode === "edit");
  const [chatLoading, setChatLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<{
    attachment: Attachment;
    url: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<UpdateTicketFormData>({
    resolver: zodResolver(updateTicketSchema),
    defaultValues: {
      title: ticket.title,
      description: ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      assignedTo: ticket.assignedTo?.id || "",
      tags: ticket.tags || [],
      files: [],
      hoursSpent: ticket.hoursSpent || 0,
      startDate: ticket.startDate ? new Date(ticket.startDate) : undefined,
      endDate: ticket.endDate ? new Date(ticket.endDate) : undefined,
    },
  });

  const selectedCategory = watch("category");

  // Réinitialiser le formulaire quand le ticket change
  useEffect(() => {
    reset({
      title: ticket.title,
      description: ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      assignedTo: ticket.assignedTo?.id || "",
      tags: ticket.tags || [],
      files: [],
      hoursSpent: ticket.hoursSpent || 0,
      startDate: ticket.startDate ? new Date(ticket.startDate) : undefined,
      endDate: ticket.endDate ? new Date(ticket.endDate) : undefined,
    });
  }, [ticket, reset]);

  const handleSave = async (data: UpdateTicketFormData) => {
    if (onUpdateTicket) {
      setUpdateLoading(true);
      try {
        await onUpdateTicket(ticket.id, data);
        setIsEditing(false);
      } finally {
        setUpdateLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    reset();
    setIsEditing(false);
  };

  const handleAddComment = async (content: string, files?: File[]) => {
    if (onAddComment) {
      setChatLoading(true);
      try {
        await onAddComment(ticket.id, content, files);
      } finally {
        setChatLoading(false);
      }
    }
  };

  const handleCloseTicket = async () => {
    if (
      onCloseTicket &&
      (currentUser.role === "admin" || currentUser.role === "agent")
    ) {
      setCloseLoading(true);
      try {
        await onCloseTicket(ticket.id);
      } finally {
        setCloseLoading(false);
      }
    }
  };

  const canEdit = currentUser.role === "admin" || currentUser.role === "agent";

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const statuses = getStatusesForCategory(ticket.category, config);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: { height: "90vh" },
      }}
    >
      <DialogTitle sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {isEditing ? "Modifier le ticket" : "Détails du ticket"}
          </Typography>
          <Box display="flex" gap={1}>
            {canEdit && !isEditing && (
              <IconButton
                size="small"
                onClick={() => setIsEditing(true)}
                color="primary"
              >
                <Edit />
              </IconButton>
            )}
            <IconButton size="small" onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: "flex", height: "100%" }}>
        {/* Zone principale - Formulaire ou affichage */}
        <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
          <form onSubmit={handleSubmit(handleSave)}>
            {/* Informations principales - Toujours visibles */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {/* Informations générales */}
              <Grid item xs={12}>
                <Box display="flex" gap={2} alignItems="center" mb={2}>
                  <Chip
                    label={getStatusLabel(ticket.status, statuses)}
                    color={getStatusColor(ticket.status, statuses)}
                    size="small"
                  />
                  <Chip
                    label={getPriorityLabel(ticket.priority, config.priorities)}
                    color={getPriorityColor(ticket.priority, config.priorities)}
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary">
                    Créé le {formatDate(ticket.createdAt)}
                  </Typography>
                  {ticket.updatedAt !== ticket.createdAt && (
                    <Typography variant="caption" color="text.secondary">
                      • Modifié le {formatDate(ticket.updatedAt)}
                    </Typography>
                  )}
                </Box>
              </Grid>

              {/* Titre */}
              <Grid item xs={12}>
                {isEditing ? (
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Titre du ticket"
                        fullWidth
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        onChange={(e) => {
                          const capitalizedValue = capitalizeFirstChar(
                            e.target.value
                          );
                          field.onChange(capitalizedValue);
                        }}
                      />
                    )}
                  />
                ) : (
                  <Typography variant="h5" gutterBottom>
                    {ticket.title}
                  </Typography>
                )}
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                {isEditing ? (
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        onChange={(e) => {
                          const capitalizedValue = capitalizeFirstChar(
                            e.target.value
                          );
                          field.onChange(capitalizedValue);
                        }}
                      />
                    )}
                  />
                ) : (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                      {ticket.description}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>

            {/* Sections collapsibles */}
            <Box sx={{ mb: 3 }}>
              {/* Section Détails du ticket */}
              <Accordion defaultExpanded={false}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Détails du ticket
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    {/* Catégorie */}
                    <Grid item xs={12} md={6}>
                      {isEditing ? (
                        <Controller
                          name="category"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth error={!!errors.category}>
                              <InputLabel>Catégorie</InputLabel>
                              <Select {...field} label="Catégorie">
                                {config.categories.map((category) => (
                                  <MenuItem
                                    key={category.value}
                                    value={category.value}
                                  >
                                    {category.label}
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors.category && (
                                <Typography variant="caption" color="error">
                                  {errors.category.message}
                                </Typography>
                              )}
                            </FormControl>
                          )}
                        />
                      ) : (
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Catégorie
                          </Typography>
                          <Typography variant="body1">
                            {config.categories.find(
                              (c) => c.value === ticket.category
                            )?.label || ticket.category}
                          </Typography>
                        </Box>
                      )}
                    </Grid>

                    {/* Statut */}
                    <Grid item xs={12} md={6}>
                      {isEditing ? (
                        currentUser.role === "admin" ||
                        currentUser.role === "agent" ? (
                          <StatusSelect
                            name="status"
                            control={control}
                            label="Statut"
                            error={!!errors.status}
                            helperText={errors.status?.message}
                            category={ticket.category}
                          />
                        ) : (
                          <TextField
                            label="Statut"
                            value={getStatusLabel(ticket.status, statuses)}
                            fullWidth
                            disabled
                            helperText="Seuls les agents et admins peuvent modifier le statut"
                          />
                        )
                      ) : (
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Statut
                          </Typography>
                          <Typography variant="body1">
                            {getStatusLabel(ticket.status, statuses)}
                          </Typography>
                        </Box>
                      )}
                    </Grid>

                    {/* Priorité */}
                    <Grid item xs={12} md={6}>
                      {isEditing ? (
                        currentUser.role === "admin" ||
                        currentUser.role === "agent" ? (
                          <PrioritySelect
                            name="priority"
                            control={control}
                            label="Priorité"
                            error={!!errors.priority}
                            helperText={errors.priority?.message}
                          />
                        ) : (
                          <TextField
                            label="Priorité"
                            value={getPriorityLabel(
                              ticket.priority,
                              config.priorities
                            )}
                            fullWidth
                            disabled
                            helperText="Seuls les agents et admins peuvent modifier la priorité"
                          />
                        )
                      ) : (
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Priorité
                          </Typography>
                          <Typography variant="body1">
                            {getPriorityLabel(
                              ticket.priority,
                              config.priorities
                            )}
                          </Typography>
                        </Box>
                      )}
                    </Grid>

                    {/* Assignation */}
                    {users.length > 0 && (
                      <Grid item xs={12} md={6}>
                        {isEditing ? (
                          currentUser.role === "admin" ||
                          currentUser.role === "agent" ? (
                            <UserSelect
                              name="assignedTo"
                              control={control}
                              users={users}
                              label="Assigner à"
                              placeholder="Sélectionner un agent ou admin..."
                            />
                          ) : (
                            <TextField
                              label="Assigné à"
                              value={
                                ticket.assignedTo
                                  ? ticket.assignedTo.name
                                  : "Non assigné"
                              }
                              fullWidth
                              disabled
                              helperText="Seuls les agents et admins peuvent modifier l'assignation"
                            />
                          )
                        ) : (
                          <Box>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Assigné à
                            </Typography>
                            <Typography variant="body1">
                              {ticket.assignedTo
                                ? ticket.assignedTo.name
                                : "Non assigné"}
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                    )}

                    {/* Tags */}
                    <Grid item xs={12}>
                      {isEditing ? (
                        currentUser.role === "admin" ||
                        currentUser.role === "agent" ? (
                          <Controller
                            name="tags"
                            control={control}
                            render={({ field }) => (
                              <TagSelect
                                category={selectedCategory}
                                value={field.value || []}
                                onChange={field.onChange}
                                label="Tags"
                                placeholder="Sélectionner ou créer des tags..."
                                error={!!errors.tags}
                                helperText={errors.tags?.message}
                                deletable={true}
                              />
                            )}
                          />
                        ) : (
                          <TextField
                            label="Tags"
                            value={
                              ticket.tags && ticket.tags.length > 0
                                ? ticket.tags.map((tag) => tag.label).join(", ")
                                : "Aucun tag"
                            }
                            fullWidth
                            disabled
                            helperText="Seuls les agents et admins peuvent modifier les tags"
                          />
                        )
                      ) : (
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Tags
                          </Typography>
                          <Box
                            sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                          >
                            {ticket.tags && ticket.tags.length > 0 ? (
                              ticket.tags.map((tag) => (
                                <TagChip
                                  key={tag.value}
                                  tag={tag}
                                  size="small"
                                  category={selectedCategory}
                                  deletable={true}
                                  globalDelete={true}
                                />
                              ))
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Aucun tag
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      )}
                    </Grid>

                    {/* Auteur */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{}}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                          sx={{ mb: 1 }}
                        >
                          Créé par
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <UserAvatar user={ticket.author} size={24} />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Section Suivi du temps */}
              <Accordion defaultExpanded={false}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Suivi du temps
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {isEditing ? (
                    currentUser.role === "admin" ||
                    currentUser.role === "agent" ? (
                      <TimeTrackingFields
                        control={control}
                        errors={errors}
                        disabled={false}
                      />
                    ) : (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Seuls les agents et admins peuvent modifier le suivi
                          du temps
                        </Typography>
                      </Box>
                    )
                  ) : (
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2">
                          <strong>Heures passées :</strong>{" "}
                          {ticket.hoursSpent || 0}h
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2">
                          <strong>Date de début :</strong>{" "}
                          {ticket.startDate
                            ? formatDate(ticket.startDate)
                            : "Non définie"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2">
                          <strong>Date de fin :</strong>{" "}
                          {ticket.endDate
                            ? formatDate(ticket.endDate)
                            : "Non calculée"}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                </AccordionDetails>
              </Accordion>

              {/* Section Pièces jointes */}
              {ticket.attachments && ticket.attachments.length > 0 && (
                <Accordion defaultExpanded={false}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Pièces jointes ({ticket.attachments.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box display="flex" flexDirection="column" gap={1}>
                      {ticket.attachments.map((attachment) => (
                        <AttachmentPreview
                          key={attachment.id}
                          attachment={attachment}
                          onPreview={(attachment) => {
                            setPreviewAttachment({
                              attachment,
                              url: attachment.url,
                            });
                          }}
                          showRemove={false}
                        />
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              )}
            </Box>
          </form>
        </Box>

        {/* Chat à droite */}
        <Box
          sx={{
            width: 400,
            minWidth: 400,
            borderLeft: 1,
            borderColor: "divider",
          }}
        >
          <TicketChat
            comments={ticket.comments}
            currentUser={currentUser}
            onAddComment={handleAddComment}
            loading={chatLoading}
          />
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ borderTop: 1, borderColor: "divider" }}>
        {isEditing ? (
          <>
            <Button onClick={handleCancelEdit} startIcon={<Cancel />}>
              Annuler
            </Button>
            {canEdit && ticket.status !== "closed" && onCloseTicket && (
              <Button
                onClick={handleCloseTicket}
                variant="outlined"
                color="secondary"
                disabled={updateLoading || closeLoading}
              >
                {closeLoading ? "Clôture..." : "Clôturer le ticket"}
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit(handleSave)}
              disabled={updateLoading || !isDirty}
              startIcon={<Save />}
            >
              {updateLoading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </>
        ) : (
          <>
            {canEdit && ticket.status !== "closed" && onCloseTicket && (
              <Button
                onClick={handleCloseTicket}
                variant="outlined"
                color="secondary"
                disabled={closeLoading}
              >
                {closeLoading ? "Clôture..." : "Clôturer le ticket"}
              </Button>
            )}
            <Button onClick={onClose}>Fermer</Button>
          </>
        )}
      </DialogActions>

      {/* Lightbox de prévisualisation des pièces jointes */}
      <Dialog
        open={!!previewAttachment}
        onClose={() => setPreviewAttachment(null)}
        maxWidth="md"
      >
        {previewAttachment && (
          <Box p={2} display="flex" flexDirection="column" alignItems="center">
            {previewAttachment.attachment.type.startsWith("image/") ? (
              <img
                src={previewAttachment.url}
                alt={previewAttachment.attachment.filename}
                style={{ maxWidth: 600, maxHeight: 400, borderRadius: 8 }}
              />
            ) : previewAttachment.attachment.type === "application/pdf" ? (
              <iframe
                src={previewAttachment.url}
                width="600"
                height="400"
                style={{ border: "none", borderRadius: 8 }}
                title={previewAttachment.attachment.filename}
              />
            ) : null}
            <Typography variant="body2" mt={2}>
              {previewAttachment.attachment.filename}
            </Typography>
            <Typography variant="caption" color="text.secondary" mb={2}>
              {(previewAttachment.attachment.size / 1024).toFixed(1)} Ko
            </Typography>

            {/* Bouton de téléchargement dans la prévisualisation */}
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => {
                const link = document.createElement("a");
                link.href = previewAttachment.url;
                link.download = previewAttachment.attachment.filename;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Télécharger
            </Button>
          </Box>
        )}
      </Dialog>
    </Dialog>
  );
};
