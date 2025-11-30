import { z } from "zod";

const numericString = z
  .string()
  .min(1, "Rate is required")
  .refine(
    (s) => {
      const cleaned = s.replace(/,/g, "").trim();
      if (cleaned === "") return false;
      if (!/^\d+(\.\d+)?$/.test(cleaned)) return false;
      const n = Number(cleaned);
      return !Number.isNaN(n) && n >= 0;
    },
    {
      message:
        "Rate must be a non-negative number (digits only, optional decimal)",
    },
  );

const rateObject = z.object({
  minimumRate: numericString,
  maximumRate: numericString,
});

export const createTuitionSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  grade: z.string().min(1, "Grade is required"),

  fullTimeTuitionRate: z
    .array(rateObject)
    .nonempty("Full-time tuition rate is required"),
  govTuitionRate: z
    .array(rateObject)
    .nonempty("Government tuition rate is required"),
  partTimeTuitionRate: z
    .array(rateObject)
    .nonempty("Part-time tuition rate is required"),
});

export type CreateTuitionSchema = z.infer<typeof createTuitionSchema>;

export const initialFormValues: CreateTuitionSchema = {
  subject: "",
  grade: "",
  fullTimeTuitionRate: [{ minimumRate: "", maximumRate: "" }],
  govTuitionRate: [{ minimumRate: "", maximumRate: "" }],
  partTimeTuitionRate: [{ minimumRate: "", maximumRate: "" }],
};
