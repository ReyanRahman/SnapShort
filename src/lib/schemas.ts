import { TeamRole } from "@prisma/client";
import { z } from "zod";

const slugRegex = /^[a-zA-Z0-9_-]{4,32}$/;

export const createLinkSchema = z.object({
  originalUrl: z.url().max(2048),
  slug: z
    .string()
    .trim()
    .min(4)
    .max(32)
    .regex(slugRegex, "Slug can only contain letters, numbers, hyphens, and underscores.")
    .optional()
    .or(z.literal("")),
  title: z.string().trim().max(120).optional().or(z.literal("")),
  teamId: z.string().cuid().optional().or(z.literal("")),
  expiresAt: z.string().datetime().optional().or(z.literal("")),
});

export const updateLinkSchema = z.object({
  originalUrl: z.url().max(2048).optional(),
  slug: z
    .string()
    .trim()
    .min(4)
    .max(32)
    .regex(slugRegex, "Slug can only contain letters, numbers, hyphens, and underscores.")
    .optional()
    .or(z.literal("")),
  title: z.string().trim().max(120).optional().or(z.literal("")),
  isActive: z.boolean().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
});

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email(),
  password: z.string().min(8).max(100),
});

export const createTeamSchema = z.object({
  name: z.string().trim().min(2).max(80),
});

export const inviteMemberSchema = z.object({
  email: z.email(),
  role: z.nativeEnum(TeamRole),
});

export const updateTeamMemberSchema = z.object({
  role: z.nativeEnum(TeamRole),
});
