import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address").max(100, "Email too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must not exceed 64 characters"),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  role: z.enum(["admin", "user", "tutor"]).default("user"),
  phoneNumber: z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"),
  birthday: z
    .string()
    .refine(
      (val) => !isNaN(Date.parse(val)),
      "Invalid date format (use YYYY-MM-DD)",
    ),
  status: z.enum(["active", "inactive", "blocked"]).default("active"),
  country: z
    .string()
    .min(1, "Country is required")
    .max(56, "Country name too long"),
  city: z.string().min(1, "City is required").max(85, "City name too long"),
  state: z.string().max(85, "State name too long").optional(),
  region: z.string().max(85, "Region name too long").optional(),
  zip: z.string().min(1, "ZIP code is required").max(20, "ZIP code too long"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address too long"),
  tutorType: z.enum(["full-time", "part-time"]).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  duration: z.string().max(50, "Duration too long").optional(),
  frequency: z.string().max(50, "Frequency too long").optional(),
  timeZone: z.string().max(100, "Timezone too long").optional(),
  language: z.string().max(50, "Language too long").optional(),
  avatar: z
    .string()
    .url("Invalid avatar URL")
    .max(255, "Avatar URL too long")
    .optional(),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const initialFormValues: CreateUserSchema = {
  email: "",
  password: "",
  name: "",
  role: "user",
  phoneNumber: "",
  birthday: "",
  status: "active",
  country: "",
  city: "",
  state: "",
  region: "",
  zip: "",
  address: "",
  tutorType: "part-time",
  gender: "male",
  duration: "",
  frequency: "",
  timeZone: "",
  language: "",
  avatar: "",
};
