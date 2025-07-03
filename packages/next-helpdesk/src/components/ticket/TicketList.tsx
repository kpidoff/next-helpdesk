import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Delete,
  Edit,
  ViewList,
  ViewModule,
  Visibility,
} from "@mui/icons-material";
import { Priority, Ticket } from "../../types";
import React, { useState } from "react";
import {
  canDeleteTicket,
  canEditTicket,
  canViewOwnTickets,
  filterTicketsByPermission,
} from "../../utils/permissions";
import {
  getCategoryLabel as getCategoryLabelUtil,
  getPriorityColor as getPriorityColorUtil,
  getPriorityLabel as getPriorityLabelUtil,
  getStatusColor as getStatusColorUtil,
  getStatusLabel as getStatusLabelUtil,
  getStatusesForCategory,
} from "../../utils";

import { CreateTicketFormData } from "../../schemas/ticket";
import { TicketDetailDialog } from "../ticket-form/edit/TicketDetailDialog";
import { UserAvatar } from "../common/UserAvatar";
import { useHelpdesk } from "../../context/HelpdeskContext";

interface TicketListProps {
  tickets: Ticket[];
  onViewTicket?: (ticket: Ticket) => void;
  onEditTicket?: (ticket: Ticket) => void;
  onDeleteTicket?: (ticket: Ticket) => void;
  onUpdateTicket?: (
    ticketId: string,
    data: Partial<CreateTicketFormData>
  ) => Promise<void>;
  onAddComment?: (
    ticketId: string,
    content: string,
    files?: File[]
  ) => Promise<void>;
  onCloseTicket?: (ticketId: string) => Promise<void>;
  loading?: boolean;
  title?: string;
}

type ViewMode = "table" | "cards";

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  onViewTicket,
  onEditTicket,
  onDeleteTicket,
  onUpdateTicket,
  onAddComment,
  onCloseTicket,
  loading = false,
  title = "Liste des Tickets",
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [dialogMode, setDialogMode] = useState<"view" | "edit">("view");
  const [dialogLoading, setDialogLoading] = useState(false);
  const { config, currentUser, users } = useHelpdesk();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Forcer le mode carte sur mobile
  React.useEffect(() => {
    if (isMobile && viewMode === "table") {
      setViewMode("cards");
    }
  }, [isMobile, viewMode]);

  const getStatusLabelLocal = (status: string, category?: string) => {
    const statuses = getStatusesForCategory(category, config);
    return getStatusLabelUtil(status, statuses);
  };

  const getStatusColorLocal = (status: string, category?: string) => {
    const statuses = getStatusesForCategory(category, config);
    return getStatusColorUtil(status, statuses);
  };

  const getPriorityLabelLocal = (priority: Priority) => {
    return getPriorityLabelUtil(priority, config.priorities);
  };

  const getPriorityColorLocal = (priority: Priority) => {
    return getPriorityColorUtil(priority, config.priorities);
  };

  const getCategoryLabelLocal = (categoryValue: string) => {
    return getCategoryLabelUtil(categoryValue, config.categories);
  };

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: ViewMode | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  // Gestion des permissions selon les rôles
  const canViewOwnTicketsBool = canViewOwnTickets(currentUser);

  // Gestion du popup de détail
  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDialogMode("view");
    if (onViewTicket) {
      onViewTicket(ticket);
    }
  };

  const handleEditTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDialogMode("edit");
    if (onEditTicket) {
      onEditTicket(ticket);
    }
  };

  const handleCloseDialog = () => {
    setSelectedTicket(null);
    setDialogMode("view");
  };

  const handleUpdateTicket = async (
    ticketId: string,
    data: Partial<CreateTicketFormData>
  ) => {
    if (onUpdateTicket) {
      setDialogLoading(true);
      try {
        await onUpdateTicket(ticketId, data);
        // Mettre à jour le ticket localement si nécessaire
        setSelectedTicket((prev) => {
          if (!prev) return null;
          const updatedTicket = { ...prev };
          if (data.title) updatedTicket.title = data.title;
          if (data.description) updatedTicket.description = data.description;
          if (data.category) updatedTicket.category = data.category;
          if (data.priority) updatedTicket.priority = data.priority;
          if (data.assignedTo) {
            const assignedUser = users.find((u) => u.id === data.assignedTo);
            updatedTicket.assignedTo = assignedUser;
          }
          return updatedTicket;
        });
      } finally {
        setDialogLoading(false);
      }
    }
  };

  const handleAddComment = async (
    ticketId: string,
    content: string,
    files?: File[]
  ) => {
    if (onAddComment) {
      setDialogLoading(true);
      try {
        await onAddComment(ticketId, content, files);
        // Optionnel : mettre à jour les commentaires localement
      } finally {
        setDialogLoading(false);
      }
    }
  };

  // Filtrer les tickets selon les permissions - DOIT être avant les conditions de retour
  const filteredTickets = React.useMemo(() => {
    return filterTicketsByPermission(tickets, currentUser);
  }, [tickets, currentUser]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <Typography>Chargement des tickets...</Typography>
      </Box>
    );
  }

  if (filteredTickets.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <Typography variant="h6" color="text.secondary">
          {tickets.length === 0
            ? "Aucun ticket trouvé"
            : canViewOwnTicketsBool
            ? "Vous n'avez pas encore créé de tickets"
            : "Aucun ticket accessible"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Contrôles de vue */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">
          {title} ({filteredTickets.length})
          {canViewOwnTicketsBool && tickets.length > filteredTickets.length && (
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
              sx={{ ml: 1 }}
            >
              (sur {tickets.length} total)
            </Typography>
          )}
        </Typography>

        {!isMobile && (
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
          >
            <ToggleButton value="table">
              <ViewList />
            </ToggleButton>
            <ToggleButton value="cards">
              <ViewModule />
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </Box>

      {/* Mode Tableau */}
      {viewMode === "table" && !isMobile && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Titre</TableCell>
                <TableCell>Catégorie</TableCell>
                <TableCell>Priorité</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Auteur</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id} hover>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {ticket.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getCategoryLabelLocal(ticket.category)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getPriorityLabelLocal(ticket.priority)}
                      color={getPriorityColorLocal(ticket.priority) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabelLocal(
                        ticket.status,
                        ticket.category
                      )}
                      color={
                        getStatusColorLocal(
                          ticket.status,
                          ticket.category
                        ) as any
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <UserAvatar user={ticket.author} size={24} />
                      <Typography variant="body2">
                        {ticket.author.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {ticket.createdAt.toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewTicket(ticket)}
                        color="primary"
                        title="Voir le ticket"
                      >
                        <Visibility />
                      </IconButton>
                      {canEditTicket(ticket, currentUser) && (
                        <IconButton
                          size="small"
                          onClick={() => handleEditTicket(ticket)}
                          color="warning"
                          title="Modifier le ticket"
                        >
                          <Edit />
                        </IconButton>
                      )}
                      {canDeleteTicket(currentUser) && onDeleteTicket && (
                        <IconButton
                          size="small"
                          onClick={() => onDeleteTicket(ticket)}
                          color="error"
                          title="Supprimer le ticket"
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Mode Cartes */}
      {(viewMode === "cards" || isMobile) && (
        <Grid container spacing={2}>
          {filteredTickets.map((ticket) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={ticket.id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ flexGrow: 1, mr: 1 }}
                    >
                      {ticket.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      #{ticket.id}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {ticket.description.length > 100
                      ? `${ticket.description.substring(0, 100)}...`
                      : ticket.description}
                  </Typography>

                  <Stack spacing={1} mb={2}>
                    <Box display="flex" gap={1}>
                      <Chip
                        label={getPriorityLabelLocal(ticket.priority)}
                        color={getPriorityColorLocal(ticket.priority) as any}
                        size="small"
                      />
                      <Chip
                        label={getStatusLabelLocal(
                          ticket.status,
                          ticket.category
                        )}
                        color={
                          getStatusColorLocal(
                            ticket.status,
                            ticket.category
                          ) as any
                        }
                        size="small"
                      />
                    </Box>
                    <Chip
                      label={getCategoryLabelLocal(ticket.category)}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <UserAvatar user={ticket.author} size={24} />
                      <Typography variant="caption" color="text.secondary">
                        {ticket.author.name}
                      </Typography>
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      {ticket.createdAt.toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                    <IconButton
                      size="small"
                      onClick={() => handleViewTicket(ticket)}
                      color="primary"
                      title="Voir le ticket"
                    >
                      <Visibility />
                    </IconButton>
                    {canEditTicket(ticket, currentUser) && (
                      <IconButton
                        size="small"
                        onClick={() => handleEditTicket(ticket)}
                        color="warning"
                        title="Modifier le ticket"
                      >
                        <Edit />
                      </IconButton>
                    )}
                    {canDeleteTicket(currentUser) && onDeleteTicket && (
                      <IconButton
                        size="small"
                        onClick={() => onDeleteTicket(ticket)}
                        color="error"
                        title="Supprimer le ticket"
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Popup de détail du ticket */}
      {selectedTicket && (
        <TicketDetailDialog
          open={!!selectedTicket}
          onClose={handleCloseDialog}
          ticket={selectedTicket}
          currentUser={currentUser}
          users={users}
          onUpdateTicket={handleUpdateTicket}
          onAddComment={handleAddComment}
          onCloseTicket={onCloseTicket}
          loading={dialogLoading}
          mode={dialogMode}
        />
      )}
    </Box>
  );
};
