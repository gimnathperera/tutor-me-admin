import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email address is required" })
    .refine((value) => !/\s/.test(value), {
      message: "Email address cannot contain spaces",
    })
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(12, { message: "Password cannot exceed 12 characters" })
    .refine((value) => !/\s/.test(value), {
      message: "Password cannot contain spaces",
    }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const initialFormValues: LoginSchema = {
  email: "",
  password: "",
};
