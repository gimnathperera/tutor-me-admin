import { z } from "zod";

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email address").max(100, "Email too long"),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  role: z.enum(["tutor", "admin"]).optional(),
  phoneNumber: z.string().regex(/^\+?[0-9]{1,10}$/, "Phone number is required"),
  birthday: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return "";
      const date = new Date(val);
      return !isNaN(date.getTime()) ? date.toISOString().split("T")[0] : "";
    }),
  status: z
    .enum(["pending", "approved", "rejected", "suspended"])
    .default("pending"),
  country: z.string().max(56, "Country too long").optional(),
  city: z.string().max(85, "City too long").optional(),
  state: z.string().max(85, "State too long").optional(),
  region: z.string().max(85, "Region too long").optional(),
  zip: z.string().max(20, "ZIP code too long").optional(),
  address: z.string().max(200, "Address too long").optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  avatar: z
    .union([
      z.string().url("Profile image is required").max(255, "Avatar URL too long"),
      z.literal(""),
    ])
    .optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const initialFormValues: UpdateUserSchema = {
  email: "",
  name: "",
  role: "tutor",
  phoneNumber: "",
  birthday: "",
  status: "pending",
  country: "",
  city: "",
  state: "",
  region: "",
  zip: "",
  address: "",
  gender: "male",
  avatar: "",
};
