import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add,
  Comment as CommentIcon,
  Delete,
  ExpandMore,
  Launch,
} from "@mui/icons-material";
import { Control, Controller, useForm } from "react-hook-form";
import React, { useState } from "react";
import { TestComment, TestItem, User } from "../../types";

import { UserAvatar } from "./UserAvatar";
import { UserSelect } from "./UserSelect";
import { useHelpdesk } from "../../context/HelpdeskContext";

interface TestsTableProps {
  tests?: TestItem[];
  disabled?: boolean;
  currentUser: User;
  onAddTest?: (test: Omit<TestItem, 'id' | 'createdAt' | 'createdBy'>) => void;
  onUpdateTest?: (testId: string, updates: Partial<TestItem>) => void;
  onDeleteTest?: (testId: string) => void;
  onAddComment?: (testId: string, comment: Omit<TestComment, 'id' | 'testId' | 'createdAt' | 'createdBy'>) => void;
}

interface TestFormData {
  url: string;
  assignedTo?: string;
}

interface CommentFormData {
  content: string;
}


export const TestsTable: React.FC<TestsTableProps> = ({
  tests = [],
  disabled = false,
  currentUser,
  onAddTest,
  onUpdateTest,
  onDeleteTest,
  onAddComment,
}) => {
  const { users } = useHelpdesk();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedTestId, setSelectedTestId] = useState<string>("");
  const [selectedTest, setSelectedTest] = useState<TestItem | null>(null);

  // Filtrer uniquement les agents et admins
  const agentsAndAdmins = users.filter(user => user.role === 'agent' || user.role === 'admin');

  const { control: testControl, handleSubmit: handleTestSubmit, reset: resetTest } = useForm<TestFormData>({
    defaultValues: { url: "", assignedTo: "" }
  });

  const { control: commentControl, handleSubmit: handleCommentSubmit, reset: resetComment } = useForm<CommentFormData>({
    defaultValues: { content: "" }
  });


  const handleAddTest = (data: TestFormData) => {
    if (onAddTest) {
      const assignedUser = data.assignedTo 
        ? users.find(u => u.id === data.assignedTo)
        : undefined;
      
      onAddTest({
        url: data.url,
        status: 'pending',
        assignedTo: assignedUser,
        comments: []
      });
    }
    resetTest();
    setOpenAddDialog(false);
  };

  const handleAddComment = (data: CommentFormData) => {
    if (onAddComment && selectedTestId) {
      onAddComment(selectedTestId, {
        content: data.content,
      });
    }
    resetComment();
    setOpenCommentDialog(false);
    setSelectedTestId("");
  };


  const handleStatusSelect = (status: TestItem['status']) => {
    if (onUpdateTest && selectedTest) {
      onUpdateTest(selectedTest.id, {
        status: status,
      });
    }
    setStatusMenuAnchor(null);
    setSelectedTest(null);
  };

  const handleDeleteTest = (testId: string) => {
    if (onDeleteTest && confirm('Êtes-vous sûr de vouloir supprimer ce test ?')) {
      onDeleteTest(testId);
    }
  };

  const getStatusColor = (status: TestItem['status']) => {
    switch (status) {
      case 'passed': return 'success';
      case 'failed': return 'error';
      case 'in_review': return 'warning';
      case 'pending': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: TestItem['status']) => {
    switch (status) {
      case 'passed': return '✓ Validé';
      case 'failed': return '✗ Échoué';
      case 'in_review': return '👁 En cours';
      case 'pending': return '⏳ En attente';
      default: return status;
    }
  };

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
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">Tests ({tests.length})</Typography>
        {!disabled && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenAddDialog(true)}
            size="small"
          >
            Ajouter un test
          </Button>
        )}
      </Box>

      {tests.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
          Aucun test ajouté pour ce ticket.
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>URL du test</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Assigné à</TableCell>
                <TableCell>Créé par</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tests.map((test) => (
                <React.Fragment key={test.id}>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                        {test.url}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusLabel(test.status)}
                        color={getStatusColor(test.status)}
                        size="small"
                        onClick={!disabled ? (e) => {
                          setSelectedTest(test);
                          setStatusMenuAnchor(e.currentTarget);
                        } : undefined}
                        sx={{ 
                          cursor: disabled ? 'default' : 'pointer',
                          ...(!disabled && {
                            '&:hover': { 
                              opacity: 0.8,
                              transform: 'scale(1.05)',
                            },
                          }),
                          transition: 'all 0.2s'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {test.assignedTo ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <UserAvatar user={test.assignedTo} size={24} />
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Non assigné
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <UserAvatar user={test.createdBy} size={24} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {formatDate(test.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => window.open(test.url, '_blank')}
                          title="Ouvrir le test"
                        >
                          <Launch fontSize="small" />
                        </IconButton>
                        {!disabled && (
                          <>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedTestId(test.id);
                                setOpenCommentDialog(true);
                              }}
                              title="Ajouter un commentaire"
                            >
                              <CommentIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteTest(test.id)}
                              title="Supprimer le test"
                              color="error"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                  
                  {/* Affichage des commentaires */}
                  {test.comments && test.comments.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ p: 0, borderBottom: 'none' }}>
                        <Accordion variant="outlined" sx={{ boxShadow: 'none', border: 'none', '&:before': { display: 'none' } }}>
                          <AccordionSummary 
                            expandIcon={<ExpandMore />}
                            sx={{ 
                              minHeight: 'auto', 
                              bgcolor: 'grey.50',
                              '& .MuiAccordionSummary-content': { margin: '8px 0' } 
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <CommentIcon fontSize="small" />
                              <Typography variant="caption">
                                {test.comments.length} commentaire{test.comments.length > 1 ? 's' : ''}
                              </Typography>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails sx={{ p: 3 }}>
                            {test.comments.map((comment) => (
                              <Box key={comment.id} sx={{ mb: 2, p: 2, bgcolor: 'white', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                  <Stack direction="row" alignItems="center" spacing={1}>
                                    <UserAvatar user={comment.createdBy} size={20} />
                                    <Typography variant="caption" fontWeight="medium">
                                      {comment.createdBy.name}
                                    </Typography>
                                  </Stack>
                                  <Typography variant="caption" color="text.secondary">
                                    {formatDate(comment.createdAt)}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                                  {comment.content}
                                </Typography>
                              </Box>
                            ))}
                          </AccordionDetails>
                        </Accordion>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog d'ajout de test */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter un nouveau test</DialogTitle>
        <form onSubmit={handleTestSubmit(handleAddTest)}>
          <DialogContent dividers>
            <Box sx={{ mt: 2 }}>
              <Controller
                name="url"
                control={testControl}
                rules={{ 
                  required: "L'URL est obligatoire",
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: "L'URL doit être valide"
                  }
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="URL du test"
                    type="url"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || "Lien vers l'environnement de test"}
                    placeholder="https://staging.exemple.com/test"
                  />
                )}
              />
            </Box>
            {agentsAndAdmins.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <UserSelect
                  name="assignedTo"
                  control={testControl}
                  users={agentsAndAdmins}
                  label="Assigner à"
                  placeholder="Sélectionner un agent ou admin..."
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="contained">
              Ajouter
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Menu déroulant de changement de statut */}
      <Menu
        anchorEl={statusMenuAnchor}
        open={Boolean(statusMenuAnchor)}
        onClose={() => {
          setStatusMenuAnchor(null);
          setSelectedTest(null);
        }}
        PaperProps={{
          sx: {
            minWidth: 160,
          },
        }}
      >
        <MenuItem onClick={() => handleStatusSelect('pending')}>
          ⏳ En attente
        </MenuItem>
        <MenuItem onClick={() => handleStatusSelect('in_review')}>
          👁 En cours
        </MenuItem>
        <MenuItem onClick={() => handleStatusSelect('passed')}>
          ✓ Validé
        </MenuItem>
        <MenuItem onClick={() => handleStatusSelect('failed')}>
          ✗ Échoué
        </MenuItem>
      </Menu>

      {/* Dialog d'ajout de commentaire */}
      <Dialog open={openCommentDialog} onClose={() => setOpenCommentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter un commentaire</DialogTitle>
        <form onSubmit={handleCommentSubmit(handleAddComment)}>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Controller
                name="content"
                control={commentControl}
                rules={{ required: "Le commentaire est obligatoire" }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Commentaire"
                    multiline
                    rows={4}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || "Votre retour sur ce test..."}
                    placeholder="Le test fonctionne bien, mais il y a un problème avec..."
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCommentDialog(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="contained">
              Ajouter
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
