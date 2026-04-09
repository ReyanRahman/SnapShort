import { TeamRole, type TeamMember } from "@prisma/client";

export function canManageLinks(role?: TeamRole | null) {
  return role === TeamRole.OWNER || role === TeamRole.EDITOR;
}

export function canManageTeam(role?: TeamRole | null) {
  return role === TeamRole.OWNER;
}

export function isTeamViewer(role?: TeamRole | null) {
  return role === TeamRole.VIEWER;
}

export function getRoleForMembership(member?: TeamMember | null) {
  return member?.role ?? null;
}
