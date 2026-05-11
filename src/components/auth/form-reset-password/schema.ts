import {
  PASSWORD_LETTER_NUMBER_MSG,
  PASSWORD_LETTER_NUMBER_REGEX,
  PASSWORD_MAX,
  PASSWORD_MIN,
  PASSWORD_TOO_LONG,
  PASSWORD_TOO_SHORT,
} from "@/configs/password";
import { z } from "zod";

const PASSWORD_NO_SPACES_MSG = "Password cannot contain spaces";

const noSpaces = (value: string) => !/\s/.test(value);

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .nonempty("Password is required.")
      .min(PASSWORD_MIN, { message: PASSWORD_TOO_SHORT })
      .max(PASSWORD_MAX, { message: PASSWORD_TOO_LONG })
      .refine(noSpaces, {
        message: PASSWORD_NO_SPACES_MSG,
      })
      .regex(PASSWORD_LETTER_NUMBER_REGEX, {
        message: PASSWORD_LETTER_NUMBER_MSG,
      }),

    confirmPassword: z
      .string()
      .nonempty("Confirm Password is required.")
      .min(PASSWORD_MIN, { message: PASSWORD_TOO_SHORT })
      .max(PASSWORD_MAX, { message: PASSWORD_TOO_LONG })
      .refine(noSpaces, {
        message: "Confirm Password cannot contain spaces",
      })
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
