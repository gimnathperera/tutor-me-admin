import { z } from "zod";

export const updateTuitionSchema = z.object({
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

export type UpdateTuitionSchema = z.infer<typeof updateTuitionSchema>;

export const initialFormValues: UpdateTuitionSchema = {
  subject: "",
  grade: "",
  fullTimeTuitionRate: [{ minimumRate: "", maximumRate: "" }],
  govTuitionRate: [{ minimumRate: "", maximumRate: "" }],
  partTimeTuitionRate: [{ minimumRate: "", maximumRate: "" }],
};
