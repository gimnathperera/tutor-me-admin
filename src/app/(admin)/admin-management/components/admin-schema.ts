import { z } from "zod";

export const createAdminSchema = z.object({
  name: z.string().min(1, "Admin name is required").max(100, "Name too long"),
  email: z
    .string()
    .email("Enter a valid email address")
    .max(100, "Email too long"),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  password: z
    .string()
    .min(8, "Temporary password must be at least 8 characters long")
    .max(64, "Password must not exceed 64 characters"),
});

export type CreateAdminSchema = z.infer<typeof createAdminSchema>;

export const initialAdminValues: CreateAdminSchema = {
  name: "",
  email: "",
  phoneNumber: "",
  password: "",
};
