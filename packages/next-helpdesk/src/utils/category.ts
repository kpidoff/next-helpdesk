import { HelpdeskConfig } from "../context/HelpdeskContext";

/**
 * Obtient le label d'une catégorie basé sur la configuration
 * @param categoryValue - La valeur de la catégorie
 * @param categories - La liste des catégories de la configuration
 * @returns Le label de la catégorie ou la valeur si non trouvé
 */
export const getCategoryLabel = (
  categoryValue: string,
  categories: HelpdeskConfig["categories"]
): string => {
  const category = categories.find((c) => c.value === categoryValue);
  return category?.label || categoryValue;
};

/**
 * Vérifie si une catégorie existe dans la configuration
 * @param categoryValue - La valeur de la catégorie
 * @param categories - La liste des catégories de la configuration
 * @returns true si la catégorie existe, false sinon
 */
export const isValidCategory = (
  categoryValue: string,
  categories: HelpdeskConfig["categories"]
): boolean => {
  return categories.some((c) => c.value === categoryValue);
};

/**
 * Obtient la configuration d'une catégorie
 * @param categoryValue - La valeur de la catégorie
 * @param categories - La liste des catégories de la configuration
 * @returns La configuration de la catégorie ou undefined si non trouvé
 */
export const getCategoryConfig = (
  categoryValue: string,
  categories: HelpdeskConfig["categories"]
) => {
  return categories.find((c) => c.value === categoryValue);
}; 
