import { normalizeTextSpaces } from "@/utils/form-normalizers";
import { z } from "zod";

const tutorTypeValues = [
  "Private Tutor",
  "Government Teacher",
  "International School Teacher",
  "University Lecturer",
  "Online Tutor",
  "Others",
] as const;

const classTypeValues = [
  "Online - Individual",
  "Online - Group",
  "Home Visit - Individual",
  "Home Visit - Group",
  "At Tutor's Place - Individual",
  "At Tutor's Place - Group",
] as const;

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

  gender: z.enum(["Male", "Female"]),
  age: z.number().int().min(1),

  tutorMediums: z
    .array(z.string())
    .min(1, "Please select at least one medium."),

  grades: z.array(z.string()).min(1, "Select at least one grade"),
  subjects: z.array(z.string()).min(1, "Select at least one subject"),
  nationality: z.enum(["Sri Lankan", "Others"]),
  race: z.enum(["Sinhalese", "Tamil", "Muslim", "Burgher", "Others"]),

  classType: z
    .array(z.enum(classTypeValues))
    .min(1, "Select at least one class type"),

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
    .min(1, "Select at least one tutoring level"),

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
    .min(1, "Select at least one preferred location"),

  tutorType: z
    .array(z.enum(tutorTypeValues))
    .min(1, "Select at least one tutor type"),

  yearsExperience: z.number().int().min(0).max(50),

  highestEducation: z.enum([
    "PhD",
    "Masters Degree",
    "Undergraduate",
    "Bachelor Degree",
    "Diploma and Professional",
    "Advanced Level (A/L)",
  ]),

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
