import {
  Autocomplete,
  Box,
  Chip,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import { Delete } from "@mui/icons-material";
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
  onTagAdded?: (category: string, tag: TagConfig) => void;
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
  const [inputValue, setInputValue] = useState("");

  const availableTags = getTagsForCategory(category).filter(
    (tag) => !value.some((selectedTag) => selectedTag.value === tag.value)
  );

  const handleCreateTag = (tagValue: string) => {
    const newTag: TagConfig = {
      value: tagValue.toLowerCase().replace(/\s+/g, "_"),
      label: tagValue,
      color: "default",
    };

    addTagToCategory(category, newTag, onTagAdded);
    return newTag;
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
    const processedTags: TagConfig[] = newValue.map((item) => {
      if (typeof item === "string") {
        // C'est un nouveau tag à créer
        return handleCreateTag(item);
      }
      return item;
    });

    onChange(processedTags);
  };

  const handleDeleteTag = (tagValue: string) => {
    // Supprimer le tag de la liste locale
    const updatedTags = value.filter((tag) => tag.value !== tagValue);
    onChange(updatedTags);
  };

  return (
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
                  ? { value: option, label: option, color: "default" }
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
              color={option.color || "default"}
              size="small"
              sx={{ mr: 1 }}
            />
            <Typography variant="body2">{option.label}</Typography>
          </Box>
          {isAdmin && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                removeTagFromCategory(category, option.value);
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
  );
};
