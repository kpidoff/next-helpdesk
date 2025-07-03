import {
  Avatar,
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Control, Controller } from "react-hook-form";

import { Close } from "@mui/icons-material";
import React from "react";
import { User } from "../../types";
import { UserAvatar } from "./UserAvatar";

interface UserSelectProps {
  name: string;
  control: Control<any>;
  users: User[];
  label?: string;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
}

export const UserSelect: React.FC<UserSelectProps> = ({
  name,
  control,
  users,
  label = "Assigner à",
  error = false,
  helperText,
  placeholder = "Sélectionner un utilisateur...",
}) => {
  // Filtrer les utilisateurs qui sont admin ou agent
  const assignableUsers = users.filter(
    (user) => user.role === "admin" || user.role === "agent"
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl fullWidth error={error}>
          <InputLabel>{label}</InputLabel>
          <Select
            {...field}
            label={label}
            renderValue={(selected) => {
              if (!selected) {
                return "";
              }
              const selectedUser = assignableUsers.find(
                (user) => user.id === selected
              );
              if (!selectedUser) return null;
              return (
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  sx={{ width: "100%" }}
                >
                  <UserAvatar user={selectedUser} size={24} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2">{selectedUser.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedUser.role}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      field.onChange("");
                    }}
                    sx={{
                      p: 0.5,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              );
            }}
          >
            <MenuItem value="">
              <Typography color="text.secondary">{placeholder}</Typography>
            </MenuItem>
            {assignableUsers.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                <Box display="flex" alignItems="center" gap={1}>
                  <UserAvatar user={user} size={24} />
                  <Box>
                    <Typography variant="body2">{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.role} • {user.email}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
          {helperText && (
            <Typography variant="caption" color="error">
              {helperText}
            </Typography>
          )}
        </FormControl>
      )}
    />
  );
};
