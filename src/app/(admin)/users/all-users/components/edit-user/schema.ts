import {
  USER_GENDER_VALUES,
  USER_ROLE_VALUES,
  USER_STATUS_VALUES,
} from "@/configs/app-constants";
import { z } from "zod";

const normalizeText = (value: string) => value.trim().replace(/\s+/g, " ");
const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
const optionalNormalizedString = (max: number, message: string) =>
  z
    .string()
    .transform(normalizeText)
    .refine((val) => val.length <= max, {
      message,
    })
    .optional();

export const updateUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(100, "Email too long"),

  name: z
    .string()
    .transform(normalizeText)
    .refine((val) => val.length >= 1, {
      message: "Name is required",
    })
    .refine((val) => val.length <= 100, {
      message: "Name too long",
    })
    .refine((val) => nameRegex.test(val), {
      message: "Name can contain letters and spaces only",
    }),

  role: z.enum(USER_ROLE_VALUES).optional(),

  phoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone Number must contain numeric values only")
    .max(10, "Phone number should be exactly 10 digits"),

  birthday: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return "";
      const date = new Date(val);
      return !isNaN(date.getTime()) ? date.toISOString().split("T")[0] : "";
    }),

  status: z.enum(USER_STATUS_VALUES).default("pending"),

  country: optionalNormalizedString(56, "Country too long"),
  city: optionalNormalizedString(85, "City too long"),
  state: optionalNormalizedString(85, "State too long"),
  region: optionalNormalizedString(85, "Region too long"),
  zip: optionalNormalizedString(20, "ZIP code too long"),
  address: optionalNormalizedString(200, "Address too long"),

  gender: z.enum(USER_GENDER_VALUES).optional(),

  avatar: z
    .union([
      z
        .string()
        .url("Profile image is required")
        .max(255, "Avatar URL too long"),
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
