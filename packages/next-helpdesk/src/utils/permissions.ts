import { Ticket, User } from "../types";

export type UserRole = "user" | "agent" | "admin";

/**
 * Vérifie si un utilisateur peut modifier un ticket
 * @param ticket - Le ticket à vérifier
 * @param currentUser - L'utilisateur actuel
 * @returns true si l'utilisateur peut modifier le ticket
 */
export const canEditTicket = (
  ticket: Ticket,
  currentUser: User
): boolean => {
  if (currentUser.role === "admin") return true; // Admins peuvent modifier tous les tickets
  if (currentUser.role === "agent") return ticket.author.id === currentUser.id; // Agents peuvent modifier leurs propres tickets
  return false; // Users ne peuvent pas modifier
};

/**
 * Vérifie si un utilisateur peut supprimer un ticket
 * @param currentUser - L'utilisateur actuel
 * @returns true si l'utilisateur peut supprimer le ticket
 */
export const canDeleteTicket = (currentUser: User): boolean => {
  return currentUser.role === "admin"; // Seuls les admins peuvent supprimer
};

/**
 * Vérifie si un utilisateur peut voir un ticket
 * @param ticket - Le ticket à vérifier
 * @param currentUser - L'utilisateur actuel
 * @returns true si l'utilisateur peut voir le ticket
 */
export const canViewTicket = (
  ticket: Ticket,
  currentUser: User
): boolean => {
  if (currentUser.role === "admin" || currentUser.role === "agent") return true; // Agents et admins voient tous les tickets
  return ticket.author.id === currentUser.id; // Users voient seulement leurs tickets
};

/**
 * Filtre une liste de tickets selon les permissions de l'utilisateur
 * @param tickets - La liste des tickets
 * @param currentUser - L'utilisateur actuel
 * @returns La liste filtrée des tickets
 */
export const filterTicketsByPermission = (
  tickets: Ticket[],
  currentUser: User
): Ticket[] => {
  if (currentUser.role === "admin" || currentUser.role === "agent") {
    return tickets; // Agents et admins voient tous les tickets
  }
  return tickets.filter(ticket => ticket.author.id === currentUser.id); // Users voient seulement leurs tickets
};

/**
 * Vérifie si un utilisateur peut voir tous les tickets
 * @param currentUser - L'utilisateur actuel
 * @returns true si l'utilisateur peut voir tous les tickets
 */
export const canViewAllTickets = (currentUser: User): boolean => {
  return currentUser.role === "admin" || currentUser.role === "agent";
};

/**
 * Vérifie si un utilisateur peut voir seulement ses propres tickets
 * @param currentUser - L'utilisateur actuel
 * @returns true si l'utilisateur peut voir seulement ses propres tickets
 */
export const canViewOwnTickets = (currentUser: User): boolean => {
  return currentUser.role === "user";
}; 