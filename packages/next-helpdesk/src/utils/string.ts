/**
 * Utilitaires pour la manipulation de chaînes de caractères
 */

/**
 * Capitalise le premier caractère d'une chaîne
 * @param value - La chaîne à capitaliser
 * @returns La chaîne avec le premier caractère en majuscule
 */
export const capitalizeFirstChar = (value: string): string => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
};

/**
 * Capitalise la première lettre de chaque mot dans une chaîne
 * @param value - La chaîne à capitaliser
 * @returns La chaîne avec chaque mot capitalisé
 */
export const capitalizeWords = (value: string): string => {
  if (!value) return value;
  return value
    .split(' ')
    .map(word => capitalizeFirstChar(word))
    .join(' ');
};

/**
 * Met en minuscules une chaîne avec capitalisation de la première lettre
 * @param value - La chaîne à formater
 * @returns La chaîne formatée (première lettre majuscule, reste en minuscules)
 */
export const toTitleCase = (value: string): string => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}; 