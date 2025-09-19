import { z } from "zod";
import { createLevelSchema } from "../create-level/schema";

export const updateLevelSchema = createLevelSchema;
export type UpdateLevelSchema = z.infer<typeof updateLevelSchema>;
