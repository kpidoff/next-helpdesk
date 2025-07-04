import "gantt-task-react/dist/index.css";

import { Box, Chip, Paper, Typography } from "@mui/material";
import { Gantt, Task, ViewMode } from "gantt-task-react";
import React, { useEffect, useState } from "react";
import { Ticket, User } from "../../types";

import { TicketDetailDialog } from "../ticket-form/edit";
import { useHelpdesk } from "../../context/HelpdeskContext";

interface TicketGanttChartProps {
  tickets?: Ticket[];
  height?: number;
  width?: number;
  title?: string;
  users?: User[];
  onDateChange?: (task: Task, children: Task[]) => Promise<boolean | void>;
  onExpanderClick?: (task: Task) => Promise<void>;
  onUpdateTicket?: (ticketId: string, data: any) => Promise<void>;
  onAddComment?: (
    ticketId: string,
    content: string,
    files?: File[]
  ) => Promise<void>;
  onCloseTicket?: (ticketId: string) => Promise<void>;
}

// Composant personnalisé pour les tooltips en français
const FrenchTooltipContent: React.FC<{
  task: Task;
  fontSize: string;
  fontFamily: string;
}> = ({ task, fontSize, fontFamily }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "8px",
        fontSize: fontSize,
        fontFamily: fontFamily,
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        minWidth: "200px",
      }}
    >
      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        {task.name}
      </Typography>
      <Box sx={{ mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Début :</strong> {formatDate(task.start)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Fin :</strong> {formatDate(task.end)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Progression :</strong> {task.progress}%
        </Typography>
      </Box>
      <Chip
        label={`ID: ${task.id}`}
        size="small"
        variant="outlined"
        sx={{ fontSize: "0.7rem" }}
      />
    </Box>
  );
};

// Composant personnalisé pour l'en-tête du tableau en français
const FrenchTaskListHeader: React.FC<{
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
}> = ({ headerHeight, rowWidth, fontFamily, fontSize }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: headerHeight,
        width: rowWidth,
        backgroundColor: "#f5f5f5",
        borderBottom: "1px solid #ddd",
        fontFamily: fontFamily,
        fontSize: fontSize,
        fontWeight: "bold",
      }}
    >
      <Box
        sx={{
          flex: 1,
          padding: "0 8px",
          borderRight: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}
      >
        Nom de la tâche
      </Box>
      <Box
        sx={{
          width: "80px",
          padding: "0 8px",
          borderRight: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        Début
      </Box>
      <Box
        sx={{
          width: "80px",
          padding: "0 8px",
          borderRight: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        Fin
      </Box>
      <Box
        sx={{
          width: "60px",
          padding: "0 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        Progrès
      </Box>
    </Box>
  );
};

// Composant personnalisé pour le tableau des tâches en français
const FrenchTaskListTable: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
}> = ({
  rowHeight,
  rowWidth,
  fontFamily,
  fontSize,
  tasks,
  selectedTaskId,
  setSelectedTask,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <Box sx={{ fontFamily: fontFamily, fontSize: fontSize }}>
      {tasks.map((task) => (
        <Box
          key={task.id}
          sx={{
            display: "flex",
            alignItems: "center",
            height: rowHeight,
            width: rowWidth,
            borderBottom: "1px solid #eee",
            backgroundColor: selectedTaskId === task.id ? "#e3f2fd" : "white",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
          onClick={() => setSelectedTask(task.id)}
        >
          <Box
            sx={{
              flex: 1,
              padding: "0 8px",
              borderRight: "1px solid #ddd",
              display: "flex",
              alignItems: "center",
              height: "100%",
              fontWeight: selectedTaskId === task.id ? "bold" : "normal",
            }}
          >
            {task.name}
          </Box>
          <Box
            sx={{
              width: "80px",
              padding: "0 8px",
              borderRight: "1px solid #ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            {formatDate(task.start)}
          </Box>
          <Box
            sx={{
              width: "80px",
              padding: "0 8px",
              borderRight: "1px solid #ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            {formatDate(task.end)}
          </Box>
          <Box
            sx={{
              width: "60px",
              padding: "0 8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            {task.progress}%
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export const TicketGanttChart: React.FC<TicketGanttChartProps> = ({
  tickets = [],
  height = 400,
  width = 800,
  title = "Diagramme de Gantt des Tickets",
  users = [],
  onDateChange,
  onExpanderClick,
  onUpdateTicket,
  onAddComment,
  onCloseTicket,
}) => {
  const { currentUser } = useHelpdesk();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Mettre à jour le ticket sélectionné quand les tickets changent
  useEffect(() => {
    if (selectedTicket) {
      const updatedTicket = tickets.find((t) => t.id === selectedTicket.id);
      if (updatedTicket) {
        setSelectedTicket(updatedTicket);
      }
    }
  }, [tickets, selectedTicket]);

  // Configuration de localisation française
  const frenchLocale = "fr-FR";

  // Convertir les tickets en tâches pour le diagramme de Gantt
  const convertTicketsToTasks = (tickets: Ticket[]): Task[] => {
    return tickets
      .filter((ticket) => ticket.startDate && ticket.endDate) // Filtrer les tickets avec des dates
      .map((ticket, index) => {
        // Calculer le pourcentage de progression basé sur le statut
        const getProgressFromStatus = (status: string): number => {
          switch (status) {
            case "open":
              return 10;
            case "in_progress":
              return 50;
            case "in_test":
              return 80;
            case "resolved":
              return 95;
            case "closed":
              return 100;
            default:
              return 0;
          }
        };

        // Définir les couleurs selon la priorité
        const getColorsFromPriority = (priority: string) => {
          switch (priority) {
            case "high":
              return {
                backgroundColor: "#d32f2f",
                backgroundSelectedColor: "#b71c1c",
                progressColor: "#ef5350",
                progressSelectedColor: "#e53935",
              };
            case "medium":
              return {
                backgroundColor: "#ed6c02",
                backgroundSelectedColor: "#e65100",
                progressColor: "#ffb74d",
                progressSelectedColor: "#ff9800",
              };
            case "low":
              return {
                backgroundColor: "#2e7d32",
                backgroundSelectedColor: "#1b5e20",
                progressColor: "#66bb6a",
                progressSelectedColor: "#4caf50",
              };
            default:
              return {
                backgroundColor: "#1976d2",
                backgroundSelectedColor: "#1565c0",
                progressColor: "#42a5f5",
                progressSelectedColor: "#2196f3",
              };
          }
        };

        return {
          id: ticket.id,
          name: ticket.title, // Libellé pour la première colonne
          start: ticket.startDate!,
          end: ticket.endDate!,
          progress: getProgressFromStatus(ticket.status),
          type: "task" as const,
          hideChildren: false,
          styles: {
            ...getColorsFromPriority(ticket.priority),
            // Masquer le texte dans la timeline
            fontSize: "0px", // Texte invisible dans la timeline
          },
          // Désactiver la modification de progression
          isDisabled: false, // Permettre le déplacement mais pas la modification de progression
        };
      });
  };

  const tasks: Task[] = convertTicketsToTasks(tickets);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Visualisation des tickets avec leurs dates de début et de fin. Les
        couleurs indiquent la priorité et la progression est basée sur le
        statut.
      </Typography>

      {tasks.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: height,
            backgroundColor: "grey.50",
            borderRadius: 1,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Aucun ticket avec des dates de début et de fin à afficher
          </Typography>
        </Box>
      ) : (
        <Box sx={{ overflow: "auto" }}>
          <Box
            sx={{
              width: width,
              height: height,
              backgroundColor: "white",
            }}
          >
            <Gantt
              tasks={tasks}
              viewMode={ViewMode.Day}
              locale={frenchLocale}
              TooltipContent={FrenchTooltipContent}
              TaskListHeader={FrenchTaskListHeader}
              TaskListTable={FrenchTaskListTable}
              listCellWidth="400px"
              onDateChange={async (task, children) => {
                console.log("Date changed:", task, children);
                if (onDateChange) {
                  try {
                    const result = await onDateChange(task, children);
                    if (result === false) {
                      console.log("Date change was rejected");
                    }
                  } catch (error) {
                    console.error("Error in onDateChange:", error);
                  }
                }
              }}
              onSelect={async (task, isSelected) => {
                // Trouver le ticket correspondant et ouvrir le dialog
                const ticket = tickets.find((t) => t.id === task.id);
                if (ticket) {
                  setSelectedTicket(ticket);
                  setDialogOpen(true);
                }
              }}
              onExpanderClick={async (task) => {
                console.log("Expander clicked:", task);
                if (onExpanderClick) {
                  try {
                    await onExpanderClick(task);
                  } catch (error) {
                    console.error("Error in onExpanderClick:", error);
                  }
                }
              }}
              columnWidth={65}
              ganttHeight={height}
              headerHeight={50}
              rowHeight={44}
              barCornerRadius={4}
              barFill={70}
              handleWidth={8}
              fontSize="12px"
              arrowIndent={20}
              barBackgroundColor="#1976d2"
              barBackgroundSelectedColor="#1565c0"
            />
          </Box>
        </Box>
      )}

      {/* Dialog de détail du ticket */}
      {selectedTicket && currentUser && (
        <TicketDetailDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setSelectedTicket(null);
          }}
          ticket={selectedTicket}
          onUpdateTicket={onUpdateTicket}
          onAddComment={onAddComment}
          onCloseTicket={onCloseTicket}
          mode="view"
        />
      )}
    </Paper>
  );
};
