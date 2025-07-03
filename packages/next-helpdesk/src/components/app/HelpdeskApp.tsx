import {
  Alert,
  AppBar,
  Box,
  Chip,
  Container,
  CssBaseline,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import {
  HelpdeskConfig,
  HelpdeskProvider,
  UserRole,
  useHelpdesk,
} from "../../context/HelpdeskContext";
import React, { useState } from "react";

import { CreateTicketButton } from "../ticket-form/create/CreateTicketButton";
import { CreateTicketFormData } from "../../schemas/ticket";
import { Dashboard } from "../dashboard/Dashboard";
import { User } from "@/types";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const HelpdeskAppContent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastSubmittedData, setLastSubmittedData] =
    useState<CreateTicketFormData | null>(null);
  const { config, userRole, isAdmin, isAgent, updateUserRole } = useHelpdesk();

  // Données de démonstration pour le dashboard
  const mockStats = {
    totalTickets: 156,
    openTickets: 23,
    resolvedTickets: 98,
    inProgressTickets: 35,
  };

  const handleCreateTicket = async (data: CreateTicketFormData) => {
    setLoading(true);

    // Simuler un appel API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Récupérer le label de la catégorie à partir de la value
    const categoryLabel =
      config.categories.find((cat) => cat.value === data.category)?.label ||
      data.category;

    console.log("Nouveau ticket créé:", {
      ...data,
      categoryValue: data.category, // Value pour la base de données
      categoryLabel: categoryLabel, // Label pour l'affichage
      createdBy: userRole, // Rôle de l'utilisateur qui a créé le ticket
    });

    setLastSubmittedData(data);
    setLoading(false);
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "error";
      case "agent":
        return "warning";
      case "user":
        return "primary";
      default:
        return "default";
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "Administrateur";
      case "agent":
        return "Agent";
      case "user":
        return "Utilisateur";
      default:
        return role;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Next-Helpdesk
            </Typography>

            {/* Sélecteur de rôle pour la démonstration */}
            <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
              <InputLabel sx={{ color: "white" }}>Rôle</InputLabel>
              <Select
                value={userRole}
                onChange={(e) => updateUserRole(e.target.value as UserRole)}
                sx={{
                  color: "white",
                  "& .MuiSelect-icon": { color: "white" },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.3)",
                  },
                }}
                label="Rôle"
              >
                <MenuItem value="user">Utilisateur</MenuItem>
                <MenuItem value="agent">Agent</MenuItem>
                <MenuItem value="admin">Administrateur</MenuItem>
              </Select>
            </FormControl>

            <Chip
              label={getRoleLabel(userRole)}
              color={getRoleColor(userRole) as any}
              size="small"
              sx={{ mr: 2 }}
            />

            <CreateTicketButton
              onSubmit={handleCreateTicket}
              loading={loading}
              variant="button"
              buttonText="Nouveau ticket"
            />
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Dashboard stats={mockStats} />

          {/* Le client peut maintenant utiliser TicketList directement ici */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Utilisez le composant TicketList ici
            </Typography>
            <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
              <Typography variant="body2" color="text.secondary">
                Importez et utilisez le composant TicketList avec vos propres
                données :
              </Typography>
              <Box
                component="pre"
                sx={{ mt: 2, p: 2, bgcolor: "white", borderRadius: 1 }}
              >
                {`import { TicketList } from '@next-helpdesk/core';

<TicketList
  tickets={yourTickets}
  onViewTicket={handleViewTicket}
  onEditTicket={handleEditTicket}
  onDeleteTicket={handleDeleteTicket}
  title="Mes Tickets"
/>`}
              </Box>
            </Paper>
          </Box>

          {/* Affichage des données soumises pour démonstration */}
          {lastSubmittedData && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Dernier ticket créé (démonstration)
              </Typography>
              <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{ fontFamily: "monospace" }}
                >
                  {JSON.stringify(
                    {
                      ...lastSubmittedData,
                      categoryValue: lastSubmittedData.category,
                      categoryLabel: config.categories.find(
                        (cat) => cat.value === lastSubmittedData.category
                      )?.label,
                      createdBy: userRole,
                      isAdmin,
                      isAgent,
                    },
                    null,
                    2
                  )}
                </Typography>
              </Paper>
            </Box>
          )}

          {/* Affichage des permissions pour la démonstration */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Permissions actuelles
            </Typography>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip
                  label={`Admin: ${isAdmin ? "Oui" : "Non"}`}
                  color={isAdmin ? "success" : "default"}
                  size="small"
                />
                <Chip
                  label={`Agent: ${isAgent ? "Oui" : "Non"}`}
                  color={isAgent ? "success" : "default"}
                  size="small"
                />
                <Chip
                  label={`Utilisateur: ${!isAgent ? "Oui" : "Non"}`}
                  color={!isAgent ? "success" : "default"}
                  size="small"
                />
              </Box>
            </Paper>
          </Box>
        </Container>

        <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={handleCloseSuccess}
        >
          <Alert
            onClose={handleCloseSuccess}
            severity="success"
            sx={{ width: "100%" }}
          >
            Ticket créé avec succès !
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

interface HelpdeskAppProps {
  config?: Partial<HelpdeskConfig>;
  userRole?: UserRole;
  currentUser: User;
  users: User[];
}

export const HelpdeskApp: React.FC<HelpdeskAppProps> = ({
  config,
  userRole = "user",
  currentUser,
  users,
}) => {
  return (
    <HelpdeskProvider
      config={config}
      userRole={userRole}
      currentUser={currentUser}
      users={users}
    >
      <HelpdeskAppContent />
    </HelpdeskProvider>
  );
};
