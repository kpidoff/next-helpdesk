import { Control } from "react-hook-form";
import { CreateTicketFormData } from "@/schemas/ticket";
import React from "react";
import { User } from "@/types";
import { UserSelect } from "@/components/common/UserSelect";

interface TicketAssignmentFieldProps {
  control: Control<CreateTicketFormData>;
  users: User[];
  currentUser?: User;
}

export const TicketAssignmentField: React.FC<TicketAssignmentFieldProps> = ({
  control,
  users,
  currentUser,
}) => {
  const canAssign =
    users.length > 0 &&
    (currentUser?.role === "admin" || currentUser?.role === "agent");

  if (!canAssign) {
    return null;
  }

  return (
    <UserSelect
      name="assignedTo"
      control={control}
      users={users}
      label="Assigner à"
      placeholder="Sélectionner un agent ou admin..."
    />
  );
};
