import { z } from "zod";

export const createPaperSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  subject: z.string().min(1, "Subject is required"), // expecting subjectId as string
  grade: z.string().min(1, "Grade is required"),     // expecting gradeId as string
  year: z
    .string()
    .regex(/^\d{4}$/, "Year must be a 4-digit number"), // only 4-digit year allowed
  url: z.string().url("Must be a valid URL"),
});

export type CreatePaperSchema = z.infer<typeof createPaperSchema>;

export const initialFormValues: CreatePaperSchema = {
  title: "",
  description: "",
  subject: "",
  grade: "",
  year: "",
  url: "",
};
