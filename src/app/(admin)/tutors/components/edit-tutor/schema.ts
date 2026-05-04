import { normalizeTextSpaces } from "@/utils/form-normalizers";
import { z } from "zod";

const normalizedTextSchema = z
  .string()
  .transform((value) => normalizeTextSpaces(value) as string);

export const updateTutorSchema = z.object({
  fullName: z
    .string()
    .transform((value) => normalizeTextSpaces(value) as string)
    .pipe(
      z
        .string()
        .regex(
          /^[A-Za-z\s]*$/,
          "Full Name can contain letters and spaces only",
        ),
    )
    .optional(),
  contactNumber: z
    .string()
    .trim()
    .min(1, "Contact Number is required")
    .pipe(
      z
        .string()
        .regex(/^\d+$/, "Contact number must contain only numbers")
        .min(7, "Contact number must be at least 7 digits")
        .max(15, "Contact number must be at most 15 digits"),
    )
    .optional(),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.string().email("Email must be valid"))
    .optional(),
  dateOfBirth: z
    .string()
    .trim()
    .min(1, "Date of Birth is required")
    .pipe(
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of Birth must be in YYYY-MM-DD"),
    )
    .optional(),
  gender: z.enum(["Male", "Female"]).optional(),
  age: z.number().int().min(1, "Age must be at least 1").optional(),
  tutorMediums: z.array(z.string()).optional(),
  grades: z.array(z.string()).optional(),
  subjects: z.array(z.string()).optional(),

  nationality: z.enum(["Sri Lankan", "Others"]).optional(),
  race: z
    .enum(["Sinhalese", "Tamil", "Muslim", "Burgher", "Others"])
    .optional(),

  status: z.enum(["pending", "approved", "rejected", "suspended"]).optional(),

  classType: z.array(z.string()).optional(),

  // Tutoring preferences
  tutoringLevels: z
    .array(
      z.enum([
        "Pre-School / Montessori",
        "Primary School (Grades 1-5)",
        "Ordinary Level (O/L) (Grades 6-11)",
        "Advanced Level (A/L) (Grades 12-13)",
        "International Syllabus (Cambridge, Edexcel, IB)",
        "Undergraduate",
        "Diploma / Degree",
        "Language (e.g., English, French, Japanese)",
        "Computing (e.g., Programming, Graphic Design)",
        "Music & Arts",
        "Special Skills",
      ]),
    )
    .min(1, "Select at least one tutoring level")
    .optional(),

  preferredLocations: z
    .array(
      z.enum([
        "Kollupitiya (Colombo 3)",
        "Bambalapitiya (Colombo 4)",
        "Havelock Town (Colombo 5)",
        "Wellawatte (Colombo 6)",
        "Cinnamon Gardens (Colombo 7)",
        "Borella (Colombo 8)",
        "Dehiwala",
        "Mount Lavinia",
        "Nugegoda",
        "Rajagiriya",
        "Kotte",
        "Battaramulla",
        "Malabe",
        "Moratuwa",
        "Gampaha",
        "Negombo",
        "Kadawatha",
        "Kiribathgoda",
        "Kelaniya",
        "Wattala",
        "Ja-Ela",
        "Kalutara",
        "Panadura",
        "Horana",
        "Wadduwa",
        "Kandy",
        "Matale",
        "Nuwara Eliya",
        "Galle",
        "Matara",
        "Hambantota",
        "Kurunegala",
        "Puttalam",
        "Chilaw",
        "Ratnapura",
        "Kegalle",
        "Badulla",
        "Bandarawela",
        "Anuradhapura",
        "Polonnaruwa",
        "Jaffna",
        "Vavuniya",
        "Trincomalee",
        "Batticaloa",
        "No Preference",
      ]),
    )
    .min(1, "Select at least one preferred location")
    .optional(),

  // Academic qualifications
  tutorType: z
    .array(
      z.enum([
        "Private Tutor",
        "Government Teacher",
        "International School Teacher",
        "University Lecturer",
        "Online Tutor",
        "Others",
      ]),
    )
    .optional(),

  yearsExperience: z.number().int().min(0).max(50).optional(),

  highestEducation: z
    .enum([
      "PhD",
      "Diploma",
      "Masters",
      "Undergraduate",
      "Bachelor Degree",
      "Diploma and Professional",
      "JC/A Levels",
      "Poly",
      "Others",
    ])
    .optional(),

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

  agreeTerms: z.boolean().optional(),
  agreeAssignmentInfo: z.boolean().optional(),
  certificatesAndQualifications: z
    .array(
      z.object({
        id: z.string().optional(),
        type: z.string().min(1, "Certificate type is required"),
        url: z.string().url("Must be a valid URL"),
      }),
    )
    .min(1, "At least one certificate or qualification is required"),
});

export type UpdateTutorSchema = z.infer<typeof updateTutorSchema>;
