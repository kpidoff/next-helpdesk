import { ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  avatar?: string | ReactNode | null;
}
