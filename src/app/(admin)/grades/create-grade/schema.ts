import { z } from "zod";

const noExtraSpaces = (field: string) =>
  z
    .string()
    .min(1, `${field} is required`)
    .refine((val) => val.trim().length > 0, {
      message: `${field} cannot be empty`,
    })
    .refine((val) => !/^\s|\s$/.test(val), {
      message: `No leading or trailing spaces allowed`,
    })
    .refine((val) => !/\s{2,}/.test(val), {
      message: `Only one space is allowed between words`,
    });

export const createGradeSchema = z.object({
  title: noExtraSpaces("Title"),
  description: noExtraSpaces("Description"),

  subjects: z
    .array(z.string().min(1, "Subject ID is required"))
    .nonempty("At least one subject is required"),
});

export type CreateGradeSchema = z.infer<typeof createGradeSchema>;

export const initialFormValues: CreateGradeSchema = {
  title: "",
  description: "",
  subjects: [],
};
