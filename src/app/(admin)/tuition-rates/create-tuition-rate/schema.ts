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

const tuitionRateObject = z
  .object({
    minimumRate: numericString,
    maximumRate: numericString,
  })
  .refine(
    (data) => {
      const min = Number(data.minimumRate.replace(/,/g, ""));
      const max = Number(data.maximumRate.replace(/,/g, ""));
      return min < max;
    },
    {
      message: "Minimum rate must be less than maximum rate",
      path: ["maximumRate"],
    },
  );

const tuitionRateArray = (message: string) =>
  z.array(tuitionRateObject).nonempty(message);

export const createTuitionSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  grade: z.string().min(1, "Grade is required"),
  onlineIndividualTuitionRate: tuitionRateArray(
    "Online individual tuition rate is required",
  ),
  onlineGroupTuitionRate: tuitionRateArray(
    "Online group tuition rate is required",
  ),
  physicalIndividualTuitionRate: tuitionRateArray(
    "Physical individual tuition rate is required",
  ),
  physicalGroupTuitionRate: tuitionRateArray(
    "Physical group tuition rate is required",
  ),
});

export type CreateTuitionSchema = z.infer<typeof createTuitionSchema>;

export const initialFormValues: CreateTuitionSchema = {
  subject: "",
  grade: "",
  onlineIndividualTuitionRate: [{ minimumRate: "", maximumRate: "" }],
  onlineGroupTuitionRate: [{ minimumRate: "", maximumRate: "" }],
  physicalIndividualTuitionRate: [{ minimumRate: "", maximumRate: "" }],
  physicalGroupTuitionRate: [{ minimumRate: "", maximumRate: "" }],
};
