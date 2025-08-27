import { z } from "zod";

export const updateSubjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});
export type UpdateSubjectSchema = z.infer<typeof updateSubjectSchema>;

export const initialFormValues = {
  title: "",
  description: "",
};
