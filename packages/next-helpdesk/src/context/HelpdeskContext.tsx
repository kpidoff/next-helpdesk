import { Priority, User } from "../types";
import React, { ReactNode, createContext, useContext } from "react";

export type UserRole = "user" | "agent" | "admin";

export interface StatusConfig {
  value: string;
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

export interface TagConfig {
  value: string;
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
  defaultStatus?: string;
  tags?: TagConfig[];
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
  getDefaultStatusForCategory: (category: string) => string | undefined;
  getTagsForCategory: (category: string) => TagConfig[];
  addTagToCategory: (
    category: string,
    tag: TagConfig,
    onTagAdded?: (category: string, tag: TagConfig) => void
  ) => void;
  removeTagFromCategory: (
    category: string,
    tagValue: string,
    onTagRemoved?: (category: string, tagValue: string) => void
  ) => void;
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
  onTagAdded?: (category: string, tag: TagConfig) => void;
  onTagRemoved?: (category: string, tagValue: string) => void;
}

export const HelpdeskProvider: React.FC<HelpdeskProviderProps> = ({
  children,
  config: userConfig = {},
  userRole = "user",
  currentUser: initialUser,
  users: initialUsers,
  onTagAdded,
  onTagRemoved,
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
    (category: string): string | undefined => {
      const categoryConfig = config.categories.find(
        (c) => c.value === category
      );
      return categoryConfig?.defaultStatus;
    },
    [config]
  );

  // Fonction utilitaire pour obtenir les tags d'une catégorie
  const getTagsForCategory = React.useCallback(
    (category: string): TagConfig[] => {
      const categoryConfig = config.categories.find(
        (c) => c.value === category
      );
      return categoryConfig?.tags || [];
    },
    [config]
  );

  // Fonction pour ajouter un tag à une catégorie
  const addTagToCategory = React.useCallback(
    async (
      category: string,
      tag: TagConfig,
      callback?: (category: string, tag: TagConfig) => void
    ) => {
      // Appeler le callback global si fourni (pour la gestion côté client)
      if (onTagAdded) {
        try {
          await onTagAdded(category, tag);
        } catch (error) {
          console.error("Erreur lors de l'ajout du tag:", error);
          throw error; // Propager l'erreur
        }
      }

      setConfig((prevConfig) => {
        const updatedCategories = prevConfig.categories.map((cat) => {
          if (cat.value === category) {
            const existingTags = cat.tags || [];
            // Vérifier si le tag existe déjà
            const tagExists = existingTags.some((t) => t.value === tag.value);
            if (!tagExists) {
              const updatedTags = [...existingTags, tag];
              // Appeler le callback local si fourni
              if (callback) {
                callback(category, tag);
              }
              return { ...cat, tags: updatedTags };
            }
          }
          return cat;
        });
        return { ...prevConfig, categories: updatedCategories };
      });
    },
    [onTagAdded]
  );

  // Fonction pour supprimer un tag d'une catégorie
  const removeTagFromCategory = React.useCallback(
    async (
      category: string,
      tagValue: string,
      callback?: (category: string, tagValue: string) => void
    ) => {
      // Appeler le callback global si fourni (pour la gestion côté client)
      if (onTagRemoved) {
        try {
          await onTagRemoved(category, tagValue);
        } catch (error) {
          console.error("Erreur lors de la suppression du tag:", error);
          throw error; // Propager l'erreur
        }
      }

      setConfig((prevConfig) => {
        const updatedCategories = prevConfig.categories.map((cat) => {
          if (cat.value === category) {
            const existingTags = cat.tags || [];
            const updatedTags = existingTags.filter(
              (t) => t.value !== tagValue
            );
            // Appeler le callback local si fourni
            if (callback) {
              callback(category, tagValue);
            }
            return { ...cat, tags: updatedTags };
          }
          return cat;
        });
        return { ...prevConfig, categories: updatedCategories };
      });
    },
    [onTagRemoved]
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
    getTagsForCategory,
    addTagToCategory,
    removeTagFromCategory,
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
