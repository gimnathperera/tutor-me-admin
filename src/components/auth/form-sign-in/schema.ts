import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email address is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const initialFormValues: LoginSchema = {
  email: "",
  password: "",
};
