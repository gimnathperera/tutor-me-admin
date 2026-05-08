import { z } from "zod";

export const createAdminSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Admin name is required")
    .regex(/^[A-Za-z\s]+$/, "Full Name can contain letters and spaces only"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email too long"),

  phoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain numeric values only")
    .length(10, "Phone number should be exactly 10 digits"),

  password: z
    .string()
    .trim()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(12, "Password must not exceed 12 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain at least one letter and one number",
    ),
});

export type CreateAdminSchema = z.infer<typeof createAdminSchema>;

export const initialAdminValues: CreateAdminSchema = {
  name: "",
  email: "",
  phoneNumber: "",
  password: "",
};
