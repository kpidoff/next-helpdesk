import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { ColorLens, Delete } from "@mui/icons-material";
import React, { useState } from "react";

import { TagChip } from "./TagChip";
import { TagConfig } from "../../context/HelpdeskContext";
import { useHelpdesk } from "../../context/HelpdeskContext";

interface TagSelectProps {
  category: string;
  value: TagConfig[];
  onChange: (tags: TagConfig[]) => void;
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  deletable?: boolean;
  onTagAdded?: (category: string, tag: TagConfig) => Promise<TagConfig>;
}

export const TagSelect: React.FC<TagSelectProps> = ({
  category,
  value,
  onChange,
  label = "Tags",
  placeholder = "Sélectionner ou créer des tags...",
  error = false,
  helperText,
  disabled = false,
  deletable = true,
  onTagAdded,
}) => {
  const {
    getTagsForCategory,
    addTagToCategory,
    isAdmin,
    removeTagFromCategory,
  } = useHelpdesk();

  // Vérifier si les fonctions de gestion des tags sont disponibles
  if (!getTagsForCategory || !addTagToCategory) {
    return null; // Ne pas afficher le composant si les fonctions ne sont pas disponibles
  }
  const [inputValue, setInputValue] = useState("");
  const [showColorDialog, setShowColorDialog] = useState(false);
  const [newTagData, setNewTagData] = useState<{
    label: string;
    color: string;
  } | null>(null);

  const availableTags = getTagsForCategory(category).filter(
    (tag) => !value.some((selectedTag) => selectedTag.id === tag.id)
  );

  const handleCreateTag = (tagValue: string) => {
    // Ouvrir le dialog de sélection de couleur
    setNewTagData({ label: tagValue, color: "#1976d2" }); // Couleur par défaut
    setShowColorDialog(true);
    return null; // On ne retourne pas le tag immédiatement
  };

  const handleConfirmTagCreation = async () => {
    if (!newTagData) return;

    const newTag: TagConfig = {
      id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // ID temporaire
      label: newTagData.label,
      color: newTagData.color,
    };

    try {
      // Le serveur retourne le tag avec l'ID final
      const finalTag = await addTagToCategory(category, newTag, onTagAdded);

      // Ajouter le tag avec l'ID du serveur à la liste sélectionnée
      const updatedTags = [...value, finalTag];
      onChange(updatedTags);

      // Fermer le dialog
      setShowColorDialog(false);
      setNewTagData(null);
      setInputValue("");
    } catch (error) {
      console.error("Erreur lors de la création du tag:", error);
    }
  };

  const handleInputChange = (
    event: React.SyntheticEvent,
    newInputValue: string
  ) => {
    setInputValue(newInputValue);
  };

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: (string | TagConfig)[]
  ) => {
    const processedTags: TagConfig[] = newValue
      .map((item) => {
        if (typeof item === "string") {
          // C'est un nouveau tag à créer
          return handleCreateTag(item);
        }
        return item;
      })
      .filter((tag): tag is TagConfig => tag !== null);

    onChange(processedTags);
  };

  const handleDeleteTag = (tagId: string) => {
    // Supprimer le tag de la liste locale
    const updatedTags = value.filter((tag) => tag.id !== tagId);
    onChange(updatedTags);
  };

  return (
    <>
      <Autocomplete
        multiple
        freeSolo
        options={availableTags}
        value={value}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        getOptionLabel={(option) => {
          if (typeof option === "string") {
            return option;
          }
          return option.label;
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            error={error}
            helperText={helperText}
            disabled={disabled}
          />
        )}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => {
            const { onDelete: _, ...tagProps } = getTagProps({ index });
            return (
              <TagChip
                tag={
                  typeof option === "string"
                    ? { id: `temp_${option}`, label: option, color: "default" }
                    : option
                }
                size="small"
                category={category}
                deletable={deletable}
                globalDelete={false}
                onDelete={handleDeleteTag}
                {...tagProps}
              />
            );
          })
        }
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
              <Chip
                label={option.label}
                color="default"
                size="small"
                sx={{
                  mr: 1,
                  bgcolor: option.color?.startsWith("#")
                    ? option.color
                    : undefined,
                  color: option.color?.startsWith("#") ? "white" : undefined,
                }}
              />
              <Typography variant="body2">{option.label}</Typography>
            </Box>
            {isAdmin && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTagFromCategory(category, option.id);
                }}
                sx={{ ml: 1 }}
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>
        )}
        disabled={disabled}
      />

      {/* Dialog de sélection de couleur pour les nouveaux tags */}
      <Dialog
        open={showColorDialog}
        onClose={() => setShowColorDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Créer un nouveau tag</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nom du tag"
              value={newTagData?.label || ""}
              onChange={(e) =>
                setNewTagData((prev) =>
                  prev ? { ...prev, label: e.target.value } : null
                )
              }
              sx={{ mb: 3 }}
            />

            <Typography variant="subtitle2" gutterBottom>
              Couleur du tag
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
              {/* Couleurs prédéfinies */}
              {[
                "#1976d2",
                "#dc004e",
                "#2e7d32",
                "#ed6c02",
                "#9c27b0",
                "#0288d1",
                "#d32f2f",
                "#388e3c",
              ].map((color) => (
                <Box
                  key={color}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    bgcolor: color,
                    cursor: "pointer",
                    border:
                      newTagData?.color === color
                        ? "3px solid #000"
                        : "1px solid #ccc",
                    "&:hover": { border: "2px solid #000" },
                  }}
                  onClick={() =>
                    setNewTagData((prev) => (prev ? { ...prev, color } : null))
                  }
                />
              ))}
            </Box>

            {/* Sélecteur de couleur personnalisée */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body2">Couleur personnalisée :</Typography>
              <input
                type="color"
                value={newTagData?.color || "#1976d2"}
                onChange={(e) =>
                  setNewTagData((prev) =>
                    prev ? { ...prev, color: e.target.value } : null
                  )
                }
                style={{
                  width: 50,
                  height: 40,
                  border: "none",
                  borderRadius: 4,
                }}
              />
              <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                {newTagData?.color}
              </Typography>
            </Box>

            {/* Aperçu du tag */}
            {newTagData && (
              <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Aperçu :
                </Typography>
                <Chip
                  label={newTagData.label}
                  sx={{
                    bgcolor: newTagData.color,
                    color: "white",
                  }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowColorDialog(false)}>Annuler</Button>
          <Button
            onClick={handleConfirmTagCreation}
            variant="contained"
            disabled={!newTagData?.label}
          >
            Créer le tag
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
