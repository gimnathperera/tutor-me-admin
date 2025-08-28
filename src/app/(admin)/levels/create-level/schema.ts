import { z } from "zod";

export const createLevelSchema = z.object({
  title: z.string().min(1, "Title is required"),
  details: z
    .array(z.string().min(1, "Detail is required"))
    .nonempty("At least one detail is required"),
  challanges: z
    .array(z.string().min(1, "Challenge is required"))
    .nonempty("At least one challenge is required"),
  subjects: z.array(z.string()).optional(),
});

export type CreateLevelSchema = z.infer<typeof createLevelSchema>;

export const initialFormValues: CreateLevelSchema = {
  title: "",
  details: [""],
  challanges: [""],
  subjects: [],
};
