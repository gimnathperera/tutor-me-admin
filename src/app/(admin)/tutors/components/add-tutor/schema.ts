import {
  CLASS_TYPE_VALUES,
  EDUCATION_VALUES_ADD,
  NATIONALITY_VALUES,
  PREFERRED_LOCATION_VALUES,
  RACE_VALUES,
  TUTOR_GENDER_VALUES,
  TUTORING_LEVEL_VALUES,
  TUTOR_TYPE_VALUES,
} from "@/configs/app-constants";
import { normalizeTextSpaces } from "@/utils/form-normalizers";
import { z } from "zod";

const normalizedTextSchema = z
  .string()
  .transform((value) => normalizeTextSpaces(value) as string);

export const addTutorSchema = z.object({
  fullName: normalizedTextSchema.pipe(
    z
      .string()
      .min(1, "Full Name is required")
      .regex(/^[A-Za-z\s]+$/, "Full Name can contain letters and spaces only"),
  ),

  contactNumber: z
    .string()
    .trim()
    .min(1, "Contact Number is required")
    .pipe(
      z
        .string()
        .regex(/^[0-9]+$/, "Contact number must contain only numbers")
        .length(10, "Contact number must be exactly 10 digits"),
    ),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.string().email("Email must be valid")),

  dateOfBirth: z
    .string()
    .trim()
    .min(1, "Date of Birth is required")
    .pipe(
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of Birth must be in YYYY-MM-DD"),
    ),

  gender: z.enum(TUTOR_GENDER_VALUES),
  age: z.number().int().min(1),

  tutorMediums: z
    .array(z.string())
    .min(1, "Please select at least one medium."),

  grades: z.array(z.string()).min(1, "Select at least one grade"),
  subjects: z.array(z.string()).min(1, "Select at least one subject"),
  nationality: z.enum(NATIONALITY_VALUES),
  race: z.enum(RACE_VALUES),

  classType: z
    .array(z.enum(CLASS_TYPE_VALUES))
    .min(1, "Select at least one class type"),

  tutoringLevels: z
    .array(z.enum(TUTORING_LEVEL_VALUES))
    .min(1, "Select at least one tutoring level"),

  preferredLocations: z
    .array(z.enum(PREFERRED_LOCATION_VALUES))
    .min(1, "Select at least one preferred location"),

  tutorType: z
    .array(z.enum(TUTOR_TYPE_VALUES))
    .min(1, "Select at least one tutor type"),

  yearsExperience: z.number().int().min(0).max(50),

  highestEducation: z.enum(EDUCATION_VALUES_ADD),

  academicDetails: normalizedTextSchema.pipe(
    z
      .string()
      .min(1, "Academic Details is required")
      .max(1000),
  ),
  teachingSummary: normalizedTextSchema.pipe(
    z
      .string()
      .min(1, "Teaching Summary is required")
      .max(750),
  ),
  studentResults: normalizedTextSchema.pipe(
    z
      .string()
      .min(1, "Student Results is required")
      .max(750),
  ),
  sellingPoints: normalizedTextSchema.pipe(
    z
      .string()
      .min(1, "Selling Points is required")
      .max(750),
  ),

  certificatesAndQualifications: z
    .array(
      z.object({
        id: z.string().optional(),
        type: z.string().min(1, "Certificate type is required"),
        url: z.string().url("Must be a valid URL"),
      }),
    )
    .min(1, "At least one certificate or qualification is required"),

  agreeTerms: z
    .boolean()
    .refine((val) => val === true, "You must agree to Terms and Conditions"),

  agreeAssignmentInfo: z
    .boolean()
    .refine((val) => val === true, "You must agree to Assignment Info"),
});

export type AddTutorFormValues = z.infer<typeof addTutorSchema>;

export const initialTutorFormValues: AddTutorFormValues = {
  fullName: "",
  contactNumber: "",
  email: "",
  dateOfBirth: "",
  gender: "Male",
  age: 18,
  tutorMediums: [],
  grades: [],
  subjects: [],
  nationality: "Sri Lankan",
  race: "Sinhalese",
  classType: [],
  tutoringLevels: [],
  preferredLocations: [],
  tutorType: [],
  yearsExperience: 0,
  highestEducation: "Undergraduate",
  academicDetails: "",
  teachingSummary: "",
  studentResults: "",
  sellingPoints: "",
  certificatesAndQualifications: [],
  agreeTerms: false,
  agreeAssignmentInfo: false,
};
