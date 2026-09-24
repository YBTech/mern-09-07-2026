// REFERENCE — fully implemented. This is the file to copy the shape of
// when you write attendees/validation.ts and registrations/validation.ts.

import { z } from "zod";

export const workshopIdParamSchema = z.object({
  id: z.coerce.number().int(),
});

export const createWorkshopBodySchema = z.object({
  title: z.string().trim().min(1, "title is required"),
  capacity: z.number().int().positive(),
  startsAt: z.string().min(1, "startsAt is required"), // ISO date string
});
export type CreateWorkshopBody = z.infer<typeof createWorkshopBodySchema>;

export const updateWorkshopBodySchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    capacity: z.number().int().positive().optional(),
    startsAt: z.string().min(1).optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.capacity !== undefined ||
      data.startsAt !== undefined,
    { message: "nothing to update" },
  );
export type UpdateWorkshopBody = z.infer<typeof updateWorkshopBodySchema>;
