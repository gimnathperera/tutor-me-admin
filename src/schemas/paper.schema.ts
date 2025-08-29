import { z } from "zod";

export const paperSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  subject: z.string().min(1, "Subject is required"),
  grade: z.string().min(1, "Grade is required"),
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
  url: z.string().url("Must be a valid URL"),
});

export type PaperSchema = z.infer<typeof paperSchema>;

export const initialFormValues: PaperSchema = {
  title: "",
  description: "",
  subject: "",
  grade: "",
  year: "",
  url: "",
};
