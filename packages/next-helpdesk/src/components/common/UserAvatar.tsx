import { Avatar, AvatarProps, Box } from "@mui/material";

import React from "react";
import { User } from "../../types";

export interface UserAvatarProps extends Omit<AvatarProps, "src" | "alt"> {
  user: Omit<User, "role">;
  size?: number;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 40,
  sx,
  ...avatarProps
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderAvatarContent = () => {
    if (user.avatar) {
      if (typeof user.avatar === "string") {
        // URL d'image - sera géré par la prop src du composant Avatar
        return null;
      } else {
        // ReactNode personnalisé
        return user.avatar;
      }
    }

    // Fallback: initiales
    return getInitials(user.name);
  };

  const avatarStyles = {
    width: size,
    height: size,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
    color: "#666",
    fontSize: size * 0.4,
    fontWeight: "bold",
  };

  // Utiliser Avatar seulement si user.avatar est une string (URL d'image)
  if (typeof user.avatar === "string") {
    return (
      <Avatar
        src={user.avatar}
        alt={user.name}
        sx={{
          ...avatarStyles,
          ...sx,
        }}
        {...avatarProps}
      />
    );
  }

  // Pour les autres cas (ReactNode personnalisé ou initiales), utiliser un Box
  return (
    <Box
      sx={{
        ...avatarStyles,
        ...sx,
      }}
    >
      {renderAvatarContent()}
    </Box>
  );
};
