import { HelpdeskConfig } from "../context/HelpdeskContext";

type PriorityColor = "primary" | "secondary" | "error" | "info" | "success" | "warning" | "default";

/**
 * Obtient la couleur d'une priorité basée sur la configuration
 * @param priorityValue - La valeur de la priorité
 * @param priorities - La liste des priorités de la configuration
 * @returns La couleur de la priorité ou "default" si non trouvé
 */
export const getPriorityColor = (
  priorityValue: string, 
  priorities: HelpdeskConfig["priorities"]
): PriorityColor => {
  const priority = priorities.find((p) => p.value === priorityValue);
  return priority?.color || "default";
};

/**
 * Obtient le label d'une priorité basé sur la configuration
 * @param priorityValue - La valeur de la priorité
 * @param priorities - La liste des priorités de la configuration
 * @returns Le label de la priorité ou la valeur si non trouvé
 */
export const getPriorityLabel = (
  priorityValue: string,
  priorities: HelpdeskConfig["priorities"]
): string => {
  const priority = priorities.find((p) => p.value === priorityValue);
  return priority?.label || priorityValue;
};

/**
 * Vérifie si une priorité existe dans la configuration
 * @param priorityValue - La valeur de la priorité
 * @param priorities - La liste des priorités de la configuration
 * @returns true si la priorité existe, false sinon
 */
export const isValidPriority = (
  priorityValue: string,
  priorities: HelpdeskConfig["priorities"]
): boolean => {
  return priorities.some((p) => p.value === priorityValue);
}; 