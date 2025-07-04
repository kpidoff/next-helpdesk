import { AttachFile, Close, Send } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Comment, User } from "@/types";
import React, { useEffect, useRef, useState } from "react";

import { AttachmentPreview } from "../common";
import { UserAvatar } from "@/components/common";
import { capitalizeFirstChar } from "@/utils/string";

interface TicketChatProps {
  comments?: Comment[];
  currentUser: User;
  onAddComment: (content: string, attachments?: File[]) => Promise<void>;
  loading?: boolean;
}

export const TicketChat: React.FC<TicketChatProps> = ({
  comments,
  currentUser,
  onAddComment,
  loading = false,
}) => {
  const [newComment, setNewComment] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((newComment.trim() || selectedFiles.length > 0) && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onAddComment(
          newComment.trim(),
          selectedFiles.length > 0 ? selectedFiles : undefined
        );
        setNewComment("");
        setSelectedFiles([]);
      } catch (error) {
        console.error("Erreur lors de l'ajout du commentaire:", error);
        // Ici vous pourriez afficher une notification d'erreur
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
    // Réinitialiser l'input pour permettre la sélection du même fichier
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Scroll automatique vers le bas
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  // Scroll vers le bas quand les commentaires changent
  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  // Scroll vers le bas après l'envoi d'un commentaire
  useEffect(() => {
    if (!isSubmitting) {
      scrollToBottom();
    }
  }, [isSubmitting]);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderLeft: 1,
        borderColor: "divider",
      }}
    >
      {/* En-tête du chat */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h6">Conversation</Typography>
        <Typography variant="caption" color="text.secondary">
          {comments?.length} commentaire{comments?.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      {/* Zone des commentaires */}
      <Box
        ref={chatContainerRef}
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {comments?.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "text.secondary",
            }}
          >
            <Typography variant="body2" textAlign="center">
              Aucun commentaire pour le moment
            </Typography>
            <Typography variant="caption" textAlign="center">
              Commencez la conversation en ajoutant un commentaire
            </Typography>
          </Box>
        ) : (
          comments?.map((comment) => {
            const isCurrentUser = comment.author.id === currentUser.id;

            return (
              <Box
                key={comment.id}
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "flex-start",
                  flexDirection: isCurrentUser ? "row-reverse" : "row",
                }}
              >
                <UserAvatar user={comment.author} size={32} />
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: isCurrentUser ? "row-reverse" : "row",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: isCurrentUser
                        ? "primary.main"
                        : "background.paper",
                      color: isCurrentUser
                        ? "primary.contrastText"
                        : "text.primary",
                      borderRadius: 2,
                      p: 1.5,
                      border: 1,
                      borderColor: isCurrentUser ? "primary.main" : "divider",
                      maxWidth: "80%",
                      boxShadow: isCurrentUser ? 1 : 0,
                    }}
                  >
                    {/* Contenu du commentaire */}
                    {comment.content && (
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "pre-wrap",
                          color: isCurrentUser
                            ? "primary.contrastText"
                            : "text.primary",
                          mb:
                            comment.attachments &&
                            comment.attachments.length > 0
                              ? 1
                              : 0,
                        }}
                      >
                        {comment.content}
                      </Typography>
                    )}

                    {/* Pièces jointes du commentaire */}
                    {comment.attachments && comment.attachments.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: isCurrentUser
                              ? "primary.contrastText"
                              : "text.secondary",
                            opacity: 0.8,
                            display: "block",
                            mb: 0.5,
                          }}
                        >
                          Pièces jointes :
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                          }}
                        >
                          {comment.attachments.map((attachment) => (
                            <Box
                              key={attachment.id}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                p: 0.5,
                                borderRadius: 1,
                                bgcolor: isCurrentUser
                                  ? "rgba(255,255,255,0.1)"
                                  : "grey.50",
                              }}
                            >
                              <AttachmentPreview
                                attachment={attachment}
                                showRemove={false}
                              />
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Date du commentaire en bas */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: isCurrentUser
                          ? "flex-end"
                          : "flex-start",
                        mt: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: isCurrentUser
                            ? "primary.contrastText"
                            : "text.secondary",
                          opacity: 0.7,
                          fontStyle: "italic",
                          fontSize: "0.7rem",
                        }}
                      >
                        {formatDate(comment.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
      </Box>

      {/* Zone de saisie */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        {/* Fichiers sélectionnés */}
        {selectedFiles.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mb={1}
            >
              Fichiers à joindre ({selectedFiles.length}) :
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selectedFiles.map((file, index) => (
                <Chip
                  key={index}
                  label={`${file.name} (${formatFileSize(file.size)})`}
                  onDelete={() => removeFile(index)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Barre de progression */}
        {isSubmitting && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, display: "block" }}
            >
              Envoi en cours...
            </Typography>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
            <TextField
              fullWidth
              multiline
              placeholder="Ajouter un commentaire..."
              value={newComment}
              onChange={(e) => {
                const value = e.target.value;
                // Mettre le premier caractère en majuscule si c'est la première lettre
                if (value.length === 1) {
                  setNewComment(capitalizeFirstChar(value));
                } else {
                  setNewComment(value);
                }
              }}
              onKeyDown={(e) => {
                if (e.ctrlKey && e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
              disabled={loading || isSubmitting}
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: 2,
                },
              }}
            />

            {/* Bouton d'attachement de fichiers */}
            <IconButton
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || isSubmitting}
              sx={{
                alignSelf: "flex-end",
                mb: 0.5,
                color: "primary.main",
              }}
              title="Joindre des fichiers"
            >
              <AttachFile />
            </IconButton>

            {/* Input file caché */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
            />

            <IconButton
              type="submit"
              color="primary"
              disabled={
                (!newComment.trim() && selectedFiles.length === 0) ||
                loading ||
                isSubmitting
              }
              sx={{
                alignSelf: "flex-end",
                mb: 0.5,
              }}
            >
              <Send />
            </IconButton>
          </Box>
        </form>
      </Box>
    </Box>
  );
};
