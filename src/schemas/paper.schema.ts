import { z } from "zod";

const noExtraSpaces = (field: string) =>
  z
    .string()
    .min(1, `${field} is required`)
    .refine((val) => val.trim().length > 0, {
      message: `${field} cannot be empty`,
    })
    .refine((val) => !/^\s|\s$/.test(val), {
      message: "No leading or trailing spaces allowed",
    })
    .refine((val) => !/\s{2,}/.test(val), {
      message: "Only one space is allowed between words",
    });

export const paperSchema = z.object({
  title: noExtraSpaces("Title"),

  medium: z.enum(["Sinhala", "English", "Tamil"], {
    message: "Medium is required",
  }),

  subject: z.string().min(1, "Subject is required"),
  grade: z.string().min(1, "Grade is required"),
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
  url: z.string().url("Must be a valid URL"),
});

export type PaperSchema = z.infer<typeof paperSchema>;

export const initialFormValues: PaperSchema = {
  title: "",
  medium: "Sinhala",
  subject: "",
  grade: "",
  year: "",
  url: "",
};
