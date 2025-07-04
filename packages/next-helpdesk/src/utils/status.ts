import { HelpdeskConfig, StatusConfig } from "../context/HelpdeskContext";

type StatusColor = "primary" | "secondary" | "error" | "info" | "success" | "warning" | "default";

/**
 * Obtient la couleur d'un statut basé sur la configuration
 * @param statusValue - La valeur du statut
 * @param statuses - La liste des statuts de la configuration
 * @returns La couleur du statut ou "default" si non trouvé
 */
export const getStatusColor = (
  statusValue: string,
  statuses: StatusConfig[]
): StatusColor => {
  const status = statuses.find((s) => s.value === statusValue);
  return status?.color || "default";
};

/**
 * Obtient le label d'un statut basé sur la configuration
 * @param statusValue - La valeur du statut
 * @param statuses - La liste des statuts de la configuration
 * @returns Le label du statut ou la valeur si non trouvé
 */
export const getStatusLabel = (
  statusValue: string,
  statuses: StatusConfig[]
): string => {
  const status = statuses.find((s) => s.value === statusValue);
  return status?.label || statusValue;
};

/**
 * Vérifie si un statut existe dans la configuration
 * @param statusValue - La valeur du statut
 * @param statuses - La liste des statuts de la configuration
 * @returns true si le statut existe, false sinon
 */
export const isValidStatus = (
  statusValue: string,
  statuses: StatusConfig[]
): boolean => {
  return statuses.some((s) => s.value === statusValue);
};

/**
 * Obtient les statuts disponibles pour une catégorie donnée
 * @param category - La catégorie
 * @param config - La configuration du helpdesk
 * @returns La liste des statuts pour cette catégorie
 */
export function getStatusesForCategory(
  category: string | undefined,
  config: HelpdeskConfig
): StatusConfig[] {
  if (category) {
    const cat = config.categories.find(c => c.value.toLowerCase() === category.toLowerCase());
    if (cat && cat.statuses && cat.statuses.length > 0) {
      return cat.statuses;
    }
  }
  return config.statuses || [];
}

/**
 * Obtient le statut par défaut pour une catégorie donnée
 * @param category - La catégorie
 * @param config - La configuration du helpdesk
 * @returns Le statut par défaut ou undefined
 */
export const getDefaultStatusForCategory = (
  category: string,
  config: HelpdeskConfig
): string | undefined => {
  const categoryConfig = config.categories.find(c => c.value.toLowerCase() === category.toLowerCase());
  return categoryConfig?.defaultStatus;
}; 