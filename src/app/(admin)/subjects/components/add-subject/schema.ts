import { z } from "zod";

export const createSubjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});
export type CreateSubjectSchema = z.infer<typeof createSubjectSchema>;

export const initialFormValues = {
  title: "",
  description: "",
};
