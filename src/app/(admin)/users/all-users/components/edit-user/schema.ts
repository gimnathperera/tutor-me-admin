import { z } from "zod";

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email address").max(100, "Email too long"),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  role: z.enum(["admin", "user", "tutor"]).optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{1,10}$/, "Invalid phone number (use 0712345678)"),
  birthday: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return "";
      const date = new Date(val);
      return !isNaN(date.getTime()) ? date.toISOString().split("T")[0] : "";
    }),
  status: z.enum(["active", "inactive", "blocked"]).default("active"),
  country: z.string().min(1, "Country is required").max(56, "Country too long"),
  city: z.string().min(1, "City is required").max(85, "City too long"),
  state: z.string().max(85, "State too long").optional(),
  region: z.string().max(85, "Region too long").optional(),
  zip: z.string().min(1, "ZIP code is required").max(20, "ZIP code too long"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address too long"),
  tutorType: z.enum(["full-time", "part-time", "gov"]).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  duration: z.string().max(50, "Duration too long").optional(),
  frequency: z.string().max(50, "Frequency too long").optional(),
  timezone: z.string().max(100, "Timezone too long").optional(),
  language: z.string().max(50, "Language too long").optional(),
  avatar: z
    .string()
    .url("Invalid avatar URL")
    .max(255, "Avatar URL too long")
    .optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const initialFormValues: UpdateUserSchema = {
  email: "",
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
  timezone: "",
  language: "",
  avatar: "",
};
