import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { Priority, Status, User } from "../../types";
import { canDeleteTicket, canEditTicket } from "../../utils/permissions";
import {
  getCategoryLabel as getCategoryLabelUtil,
  getPriorityColor as getPriorityColorUtil,
  getPriorityLabel as getPriorityLabelUtil,
  getStatusColor as getStatusColorUtil,
  getStatusLabel as getStatusLabelUtil,
  getStatusesForCategory,
} from "../../utils";

import React from "react";
import { UserAvatar } from "../common/UserAvatar";
import { useHelpdesk } from "../../context/HelpdeskContext";

interface TicketCardProps {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  createdAt: Date;
  author: User;
  category: string;
  currentUser: User;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  id,
  title,
  description,
  priority,
  status,
  createdAt,
  author,
  category,
  currentUser,
  onView,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  const { config, isAdmin, isAgent, isUser } = useHelpdesk();
  const getPriorityLabelLocal = (priority: Priority) => {
    return getPriorityLabelUtil(priority, config.priorities);
  };

  const getPriorityColorLocal = (priority: Priority) => {
    return getPriorityColorUtil(priority, config.priorities);
  };

  const getStatusLabelLocal = (status: Status, category?: string) => {
    const statuses = getStatusesForCategory(category, config);
    return getStatusLabelUtil(status, statuses);
  };

  const getStatusColorLocal = (status: Status, category?: string) => {
    const statuses = getStatusesForCategory(category, config);
    return getStatusColorUtil(status, statuses);
  };

  const getCategoryLabelLocal = (categoryValue: string) => {
    return getCategoryLabelUtil(categoryValue, config.categories);
  };

  // Gestion des permissions selon les rôles
  const canViewTicket = true; // Tout le monde peut voir les tickets

  return (
    <Card sx={{ minWidth: 275, mb: 2 }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Box display="flex" gap={1}>
            <Chip
              label={getPriorityLabelLocal(priority)}
              color={getPriorityColorLocal(priority) as any}
              size="small"
            />
            <Chip
              label={getStatusLabelLocal(status, category)}
              color={getStatusColorLocal(status, category) as any}
              size="small"
            />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description.length > 150
            ? `${description.substring(0, 150)}...`
            : description}
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <UserAvatar user={author} size={24} />
            <Typography variant="caption" color="text.secondary">
              {author.name}
            </Typography>
          </Box>

          <Box display="flex" gap={1}>
            <Chip
              label={getCategoryLabelLocal(category)}
              size="small"
              variant="outlined"
            />
            <Typography variant="caption" color="text.secondary">
              {createdAt.toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Actions */}
      {showActions && (
        <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
          {canViewTicket && onView && (
            <IconButton
              size="small"
              onClick={onView}
              color="primary"
              title="Voir le ticket"
            >
              <Visibility />
            </IconButton>
          )}
          {canEditTicket({ author } as any, currentUser) && onEdit && (
            <IconButton
              size="small"
              onClick={onEdit}
              color="warning"
              title="Modifier le ticket"
            >
              <Edit />
            </IconButton>
          )}
          {canDeleteTicket(currentUser) && onDelete && (
            <IconButton
              size="small"
              onClick={onDelete}
              color="error"
              title="Supprimer le ticket"
            >
              <Delete />
            </IconButton>
          )}
        </CardActions>
      )}
    </Card>
  );
};
