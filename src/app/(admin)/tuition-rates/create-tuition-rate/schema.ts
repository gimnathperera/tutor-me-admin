import { z } from "zod";

export const createTuitionSchema = z.object({
  level: z.string().min(1, "Level is required"),
  subject: z.string().min(1, "Subject is required"),
  grade: z.string().min(1, "Grade is required"),

  fullTimeTuitionRate: z
    .array(
      z.object({
        minimumRate: z.string().min(1, "Minimum rate is required"),
        maximumRate: z.string().min(1, "Maximum rate is required"),
      }),
    )
    .nonempty("Full-time tuition rate is required"),
  govTuitionRate: z
    .array(
      z.object({
        minimumRate: z.string().min(1, "Minimum rate is required"),
        maximumRate: z.string().min(1, "Maximum rate is required"),
      }),
    )
    .nonempty("Government tuition rate is required"),
  partTimeTuitionRate: z
    .array(
      z.object({
        minimumRate: z.string().min(1, "Minimum rate is required"),
        maximumRate: z.string().min(1, "Maximum rate is required"),
      }),
    )
    .nonempty("Part-time tuition rate is required"),
});

export type CreateTuitionSchema = z.infer<typeof createTuitionSchema>;

export const initialFormValues: CreateTuitionSchema = {
  level: "",
  subject: "",
  grade: "",
  fullTimeTuitionRate: [{ minimumRate: "", maximumRate: "" }],
  govTuitionRate: [{ minimumRate: "", maximumRate: "" }],
  partTimeTuitionRate: [{ minimumRate: "", maximumRate: "" }],
};
