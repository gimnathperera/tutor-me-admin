import { z } from "zod";

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email address").max(100, "Email too long"),

  name: z.string().min(1, "Name is required").max(100, "Name too long"),

  phoneNumber: z
    .string()
    .regex(
      /^(\+94|0)?[0-9]{9}$/,
      "Invalid phone number (use 0712345678 or +94712345678)",
    )
    .optional(),

  birthday: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid date",
    })
    .refine(
      (val) => {
        if (!val) return true;
        const birthdayDate = new Date(val);
        const today = new Date();
        return birthdayDate <= today;
      },
      {
        message: "Birthday cannot be in the future",
      },
    )
    .transform((val) =>
      val ? new Date(val).toISOString().split("T")[0] : undefined,
    )
    .optional(),

  country: z.string().min(1, "Country is required").max(56, "Country too long"),

  city: z.string().min(1, "City is required").max(85, "City too long"),

  state: z.string().max(85, "State too long").optional(),

  region: z.string().max(85, "Region too long").optional(),

  zip: z.string().min(1, "ZIP code is required").max(20, "ZIP code too long"),

  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address too long"),

  gender: z.enum(["male", "female", "other"]).optional(),

  avatar: z.string().url("Invalid avatar URL").optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const initialFormValues: UpdateUserSchema = {
  email: "",
  name: "",
  phoneNumber: undefined,
  birthday: undefined,
  country: "",
  city: "",
  state: undefined,
  region: undefined,
  zip: "",
  address: "",
  gender: undefined,
  avatar: undefined,
};
