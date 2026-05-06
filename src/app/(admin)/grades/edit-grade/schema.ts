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

const gradeTitle = () =>
  noExtraSpaces("Title")
    .refine((val) => /^[\p{L}\p{N} ()&-]+$/u.test(val), {
      message:
        "Title can only include letters, numbers, spaces, parentheses, hyphens, and ampersands",
    })
    .refine((val) => /\p{L}/u.test(val), {
      message: "Title must include at least one letter",
    });

export const updateGradeSchema = z.object({
  title: gradeTitle(),
  description: noExtraSpaces("Description"),

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
