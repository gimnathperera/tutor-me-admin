import {
  PASSWORD_LETTER_NUMBER_MSG,
  PASSWORD_LETTER_NUMBER_REGEX,
  PASSWORD_MAX,
  PASSWORD_MIN,
  PASSWORD_TOO_LONG,
  PASSWORD_TOO_SHORT,
} from "@/configs/password";
import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .trim()
      .nonempty("Password is required.")
      .min(PASSWORD_MIN, { message: PASSWORD_TOO_SHORT })
      .max(PASSWORD_MAX, { message: PASSWORD_TOO_LONG })
      .regex(PASSWORD_LETTER_NUMBER_REGEX, {
        message: PASSWORD_LETTER_NUMBER_MSG,
      }),

    confirmPassword: z
      .string()
      .trim()
      .nonempty("Confirm Password is required.")
      .min(PASSWORD_MIN, { message: PASSWORD_TOO_SHORT })
      .max(PASSWORD_MAX, { message: PASSWORD_TOO_LONG })
      .regex(PASSWORD_LETTER_NUMBER_REGEX, {
        message: PASSWORD_LETTER_NUMBER_MSG,
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export const initialFormValues: ResetPasswordSchema = {
  password: "",
  confirmPassword: "",
};
