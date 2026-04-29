import { z } from "zod";

const tutorTypeValues = [
  "Private Tutor",
  "Government Teacher",
  "University Student",
  "Coach",
] as const;

const classTypeValues = [
  "Online - Individual",
  "Online - Group",
  "Physical - Individual",
  "Physical - Group",
] as const;

export const addTutorSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full Name is required")
    .regex(/^[A-Za-z\s]+$/, "Full Name can contain letters and spaces only"),
  contactNumber: z
    .string()
    .regex(/^[0-9]+$/, "Contact number must contain only numbers")
    .length(10, "Contact number must be exactly 10 digits"),

  email: z.string().email("Email must be valid"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(12, "Password must be at most 12 characters")
    .regex(/(?=.*[A-Za-z])(?=.*\d).+/, "Password must contain at least one letter and one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),

  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of Birth must be in YYYY-MM-DD"),

  gender: z.enum(["Male", "Female", "Others"]),
  age: z.number().int().min(18, "You must be at least 18 years old").max(80, "Must be 80 or under"),

  tutorMediums: z.array(z.string()).min(1, "Please select at least one medium."),
  grades: z.array(z.string()).min(1, "Select at least one grade"),
  subjects: z.array(z.string()).min(1, "Select at least one subject"),

  nationality: z.enum(["Sri Lankan", "Others"]),
  race: z.enum(["Sinhalese", "Tamil", "Muslim", "Burgher", "Others"]),

  classType: z
    .array(z.enum(classTypeValues))
    .min(1, "Select at least one class type"),

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
    .min(1, "Select at least one Preferred Location"),

  tutorType: z
    .array(z.enum(tutorTypeValues))
    .min(1, "Select at least one tutor type"),

  yearsExperience: z.number().int().min(1, "Years of experience is required").max(50),

  highestEducation: z.enum([
    "PhD",
    "Masters",
    "Bachelor Degree",
    "Undergraduate",
    "Diploma and Professional",
    "AL",
  ]),

  academicDetails: z.string().min(1, "Academic Details are required").max(500, "Max 500 characters"),
  teachingSummary: z.string().min(1, "Teaching Summary is required").max(500, "Max 500 characters"),
  studentResults: z.string().min(1, "Student Results are required").max(500, "Max 500 characters"),
  sellingPoints: z.string().min(1, "Selling Points are required").max(500, "Max 500 characters"),

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
    .refine((val) => val === true, "You must agree to Terms"),
  agreeAssignmentInfo: z
    .boolean()
    .refine((val) => val === true, "You must confirm assignment info"),
}).superRefine((data, ctx) => {
  if (data.confirmPassword !== data.password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  }
});

export type AddTutorFormValues = z.infer<typeof addTutorSchema>;

export const initialTutorFormValues: AddTutorFormValues = {
  fullName: "",
  contactNumber: "",
  email: "",
  password: "",
  confirmPassword: "",
  dateOfBirth: "",
  gender: "Male",
  age: 0,
  tutorMediums: [],
  grades: [],
  subjects: [],
  nationality: "Sri Lankan",
  race: "Sinhalese",
  classType: [],
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
