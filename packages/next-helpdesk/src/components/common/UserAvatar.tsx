import { Avatar, AvatarProps } from "@mui/material";

import React from "react";
import { User } from "../../types";

export interface UserAvatarProps extends Omit<AvatarProps, "src" | "alt"> {
  user: User;
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
        // URL d'image
        return null; // Sera géré par la prop src
      } else {
        // ReactNode personnalisé
        return user.avatar;
      }
    }

    // Fallback: initiales
    return getInitials(user.name);
  };

  return (
    <Avatar
      src={typeof user.avatar === "string" ? user.avatar : undefined}
      alt={user.name}
      sx={{
        width: size,
        height: size,
        ...sx,
      }}
      {...avatarProps}
    >
      {renderAvatarContent()}
    </Avatar>
  );
};
