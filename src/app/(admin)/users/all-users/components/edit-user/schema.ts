import {
  USER_GENDER_VALUES,
  USER_ROLE_VALUES,
  USER_STATUS_VALUES,
} from "@/configs/app-constants";
import { z } from "zod";

const getMinimumAdultBirthDate = () => {
  const today = new Date();
  return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
};

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email address").max(100, "Email too long"),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .regex(/^[A-Za-z]+(?: [A-Za-z]+)*$/, {
      message: "Name can contain letters and spaces only",
    }),
  role: z.enum(USER_ROLE_VALUES).optional(),
  phoneNumber: z.string().regex(/^\+?[0-9]{1,10}$/, "Phone number is required"),
  birthday: z
    .string()
    .trim()
    .min(1, "Date of Birth is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of Birth must be in YYYY-MM-DD")
    .transform((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) ? date.toISOString().split("T")[0] : "";
    })
    .refine((val) => {
      const birthday = new Date(val);
      return (
        !isNaN(birthday.getTime()) && birthday <= getMinimumAdultBirthDate()
      );
    }, "User must be at least 18 years old"),
  status: z.enum(USER_STATUS_VALUES).default("pending"),
  gender: z.enum(USER_GENDER_VALUES, { message: "Gender is required" }),
  avatar: z.preprocess(
    (val) => val ?? "",
    z
      .string()
      .trim()
      .min(1, "Profile Picture is required")
      .url("Profile Picture must be a valid URL")
      .max(255, "Avatar URL too long"),
  ),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const initialFormValues: UpdateUserSchema = {
  email: "",
  name: "",
  role: "tutor",
  phoneNumber: "",
  birthday: "",
  status: "pending",
  gender: "" as UpdateUserSchema["gender"],
  avatar: "",
};
