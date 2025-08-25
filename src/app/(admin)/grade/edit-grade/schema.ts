import { z } from "zod";

export const updateGradeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  subjects: z
    .array(z.string().min(1, "Subject ID is required"))
    .nonempty("At least one subject is required"),
});

export type UpdateGradeSchema = z.infer<typeof updateGradeSchema>;

export const initialFormValues: UpdateGradeSchema = {
  title: "",
  description: "",
  subjects: [],
};
