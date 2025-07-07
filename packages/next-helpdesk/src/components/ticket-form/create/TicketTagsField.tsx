import { Control, Controller } from "react-hook-form";

import { CreateTicketFormData } from "../../../schemas/ticket";
import React from "react";
import { TagConfig } from "../../../context/HelpdeskContext";
import { TagSelect } from "../../common/TagSelect";

interface TicketTagsFieldProps {
  control: Control<CreateTicketFormData>;
  errors: any;
  category: string;
}

export const TicketTagsField: React.FC<TicketTagsFieldProps> = ({
  control,
  errors,
  category,
}) => {
  return (
    <Controller
      name="tags"
      control={control}
      render={({ field }) => (
        <TagSelect
          category={category}
          value={field.value || []}
          onChange={field.onChange}
          label="Tags"
          placeholder="Sélectionner ou créer des tags..."
          error={!!errors.tags}
          helperText={errors.tags?.message}
        />
      )}
    />
  );
};
