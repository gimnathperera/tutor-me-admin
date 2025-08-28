import { z } from "zod";

export const createGradeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  subjects: z
    .array(z.string().min(1, "Subject ID is required"))
    .nonempty("At least one subject is required"),
});

export type CreateGradeSchema = z.infer<typeof createGradeSchema>;

export const initialFormValues: CreateGradeSchema = {
  title: "",
  description: "",
  subjects: [],
};
