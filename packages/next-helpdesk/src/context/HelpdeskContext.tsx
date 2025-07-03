import { Priority, Status, User } from "../types";
import React, { ReactNode, createContext, useContext } from "react";

export type UserRole = "user" | "agent" | "admin";

export interface StatusConfig {
  value: Status;
  label: string;
  color?:
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
    | "default";
}

export interface CategoryConfig {
  value: string;
  label: string;
  statuses: StatusConfig[];
  defaultStatus?: Status;
}

export interface HelpdeskConfig {
  categories: CategoryConfig[];
  priorities: Array<{
    value: Priority;
    label: string;
    color?:
      | "primary"
      | "secondary"
      | "error"
      | "info"
      | "success"
      | "warning"
      | "default";
  }>;
  // Statuts globaux pour la compatibilité (optionnel)
  statuses?: StatusConfig[];
  defaultPriority: Priority;
  allowFileUpload?: boolean;
  maxFileSize?: number; // en MB
  allowedFileTypes?: string[];
  enableNotifications?: boolean;
  enableAutoAssign?: boolean;
}

export interface HelpdeskContextType {
  config: HelpdeskConfig;
  userRole: UserRole;
  currentUser: User;
  users: User[];
  isAdmin: boolean;
  isAgent: boolean;
  isUser: boolean;
  updateConfig: (newConfig: Partial<HelpdeskConfig>) => void;
  updateUserRole: (role: UserRole) => void;
  setCurrentUser: (user: User) => void;
  setUsers: (users: User[]) => void;
  getStatusesForCategory: (category: string) => StatusConfig[];
  getDefaultStatusForCategory: (category: string) => Status | undefined;
}

const defaultConfig: HelpdeskConfig = {
  categories: [
    {
      value: "technical",
      label: "Technique",
      statuses: [
        { value: "open", label: "Ouvert", color: "primary" },
        { value: "in_progress", label: "En cours", color: "warning" },
        { value: "resolved", label: "Résolu", color: "success" },
        { value: "closed", label: "Fermé", color: "default" },
      ],
      defaultStatus: "open",
    },
    {
      value: "billing",
      label: "Facturation",
      statuses: [
        { value: "open", label: "Ouvert", color: "primary" },
        { value: "in_progress", label: "En traitement", color: "warning" },
        { value: "resolved", label: "Traité", color: "success" },
        { value: "closed", label: "Fermé", color: "default" },
      ],
      defaultStatus: "open",
    },
    {
      value: "account",
      label: "Compte utilisateur",
      statuses: [
        { value: "open", label: "Demande reçue", color: "primary" },
        {
          value: "in_progress",
          label: "En cours de traitement",
          color: "warning",
        },
        { value: "resolved", label: "Compte modifié", color: "success" },
        { value: "closed", label: "Terminé", color: "default" },
      ],
      defaultStatus: "open",
    },
    {
      value: "feature",
      label: "Fonctionnalité",
      statuses: [
        { value: "open", label: "Demande reçue", color: "primary" },
        { value: "in_progress", label: "En développement", color: "warning" },
        { value: "in_test", label: "En test", color: "info" },
        { value: "resolved", label: "Livré", color: "success" },
        { value: "closed", label: "Fermé", color: "default" },
      ],
      defaultStatus: "open",
    },
    {
      value: "bug",
      label: "Bug",
      statuses: [
        { value: "open", label: "Signalé", color: "error" },
        { value: "in_progress", label: "En correction", color: "warning" },
        { value: "in_test", label: "En test", color: "info" },
        { value: "resolved", label: "Corrigé", color: "success" },
        { value: "closed", label: "Fermé", color: "default" },
      ],
      defaultStatus: "open",
    },
    {
      value: "other",
      label: "Autre",
      statuses: [
        { value: "open", label: "Ouvert", color: "primary" },
        { value: "in_progress", label: "En cours", color: "warning" },
        { value: "resolved", label: "Résolu", color: "success" },
        { value: "closed", label: "Fermé", color: "default" },
      ],
      defaultStatus: "open",
    },
  ],
  priorities: [
    { value: "low", label: "Basse", color: "success" },
    { value: "medium", label: "Moyenne", color: "warning" },
    { value: "high", label: "Élevée", color: "error" },
  ],
  // Statuts globaux pour la compatibilité
  statuses: [
    { value: "open", label: "Ouvert", color: "primary" },
    { value: "in_progress", label: "En cours", color: "warning" },
    { value: "in_test", label: "En test", color: "info" },
    { value: "resolved", label: "Résolu", color: "success" },
    { value: "closed", label: "Fermé", color: "default" },
  ],
  defaultPriority: "medium",
  allowFileUpload: true,
  maxFileSize: 10,
  allowedFileTypes: [".jpg", ".jpeg", ".png", ".gif", ".pdf", ".doc", ".docx"],
  enableNotifications: true,
  enableAutoAssign: false,
};

const HelpdeskContext = createContext<HelpdeskContextType | undefined>(
  undefined
);

interface HelpdeskProviderProps {
  children: ReactNode;
  config?: Partial<HelpdeskConfig>;
  userRole?: UserRole;
  currentUser: User;
  users: User[];
}

export const HelpdeskProvider: React.FC<HelpdeskProviderProps> = ({
  children,
  config: userConfig = {},
  userRole = "user",
  currentUser: initialUser,
  users: initialUsers,
}) => {
  const [config, setConfig] = React.useState<HelpdeskConfig>({
    ...defaultConfig,
    ...userConfig,
  });

  const [role, setRole] = React.useState<UserRole>(userRole);
  const [currentUser, setCurrentUser] = React.useState<User>(initialUser);
  const [users, setUsers] = React.useState<User[]>(initialUsers);

  const updateConfig = React.useCallback(
    (newConfig: Partial<HelpdeskConfig>) => {
      setConfig((prev) => ({ ...prev, ...newConfig }));
    },
    []
  );

  const updateUserRole = React.useCallback((newRole: UserRole) => {
    setRole(newRole);
  }, []);

  // Fonction utilitaire pour obtenir les statuts d'une catégorie
  const getStatusesForCategory = React.useCallback(
    (category: string): StatusConfig[] => {
      const categoryConfig = config.categories.find(
        (c) => c.value === category
      );
      if (categoryConfig) {
        return categoryConfig.statuses;
      }
      // Fallback vers les statuts globaux si la catégorie n'est pas trouvée
      return config.statuses || [];
    },
    [config]
  );

  // Fonction utilitaire pour obtenir le statut par défaut d'une catégorie
  const getDefaultStatusForCategory = React.useCallback(
    (category: string): Status | undefined => {
      const categoryConfig = config.categories.find(
        (c) => c.value === category
      );
      return categoryConfig?.defaultStatus;
    },
    [config]
  );

  const value: HelpdeskContextType = {
    config,
    userRole: role,
    currentUser,
    users,
    isAdmin: role === "admin",
    isAgent: role === "agent" || role === "admin",
    isUser: role === "user",
    updateConfig,
    updateUserRole,
    setCurrentUser,
    setUsers,
    getStatusesForCategory,
    getDefaultStatusForCategory,
  };

  return (
    <HelpdeskContext.Provider value={value}>
      {children}
    </HelpdeskContext.Provider>
  );
};

export const useHelpdesk = (): HelpdeskContextType => {
  const context = useContext(HelpdeskContext);
  if (context === undefined) {
    throw new Error("useHelpdesk must be used within a HelpdeskProvider");
  }
  return context;
};
