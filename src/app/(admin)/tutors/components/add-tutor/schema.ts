import { z } from "zod";

// Full form schema
export const addTutorSchema = z.object({
  fullName: z.string().nonempty("Full Name is required"),
  contactNumber: z
    .string()
    .regex(/^[0-9]+$/, "Contact number must contain only numbers")
    .length(10, "Contact number must be exactly 10 digits"),

  email: z.string().email("Email must be valid"),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of Birth must be in YYYY-MM-DD"),

  gender: z.enum(["Male", "Female"]),
  age: z.number().int().min(1),
  nationality: z.enum(["Singaporean", "Singapore PR", "Others"]),
  race: z.enum([
    "Chinese",
    "Malay",
    "Indian",
    "Eurasian",
    "Caucasian",
    "Punjabi",
    "Others",
  ]),
  last4NRIC: z
    .string()
    .length(4, "Last 4 digits of NRIC must be exactly 4 digits"),

  // Tutoring preferences
  tutoringLevels: z
    .array(
      z.enum([
        "Pre-School",
        "Primary School",
        "Lower Secondary",
        "Upper Secondary",
        "Junior College",
        "IB/IGCSE",
        "Diploma / Degree",
        "Language",
        "Computing",
        "Special Skills",
        "Music",
      ]),
    )
    .min(1, "Select at least one tutoring level"),

  preferredLocations: z
    .array(
      z.enum([
        "Admiralty",
        "Ang Mo Kio",
        "Bishan",
        "Boon Lay",
        "Bukit Batok",
        "Bukit Panjang",
        "Choa Chu Kang",
        "Clementi",
        "Jurong East",
        "Jurong West",
        "Kranji",
        "Marsiling",
        "Sembawang",
        "Sengkang",
        "Woodlands",
        "Yew Tee",
        "Yishun",
        "Bedok",
        "Changi",
        "East Coast",
        "Geylang",
        "Hougang",
        "Katong",
        "Marine Parade",
        "Pasir Ris",
        "Punggol",
        "Serangoon",
        "Tampines",
        "Ubi",
        "Boon Lay",
        "Bukit Merah",
        "Bukit Timah",
        "Dover",
        "Holland Village",
        "Newton",
        "Queenstown",
        "Toa Payoh",
        "West Coast",
        "Boat Quay",
        "Bugis",
        "Chinatown",
        "City Hall",
        "Clarke Quay",
        "Dhoby Ghaut",
        "Marina Bay",
        "Orchard",
        "Raffles Place",
        "Robertson Quay",
        "Tanjong Pagar",
        "Bukit Panjang",
        "Hillview",
        "Keat Hong",
        "Teck Whye",
        "Ang Mo Kio",
        "Balestier",
        "Bras Basah",
        "Farrer Park",
        "Kallang",
        "Lavender",
        "Little India",
        "MacPherson",
        "Novena",
        "Potong Pasir",
        "Rochor",
        "Thomson",
        "No Preference",
      ]),
    )
    .min(1, "Select at least one preferred location"),

  // Academic qualifications
  tutorType: z.enum([
    "Full Time Student",
    "Undergraduate",
    "Part Time Tutor",
    "Full Time Tutor",
    "Ex/Current MOE Teacher",
    "Ex-MOE Teacher",
    "Current MOE Teacher",
  ]),
  yearsExperience: z.number().int().min(0).max(50),

  highestEducation: z.enum([
    "PhD",
    "Diploma",
    "Masters",
    "Undergraduate",
    "Bachelor Degree",
    "Diploma and Professional",
    "JC/A Levels",
    "Poly",
    "Others",
  ]),
  academicDetails: z.string().max(1000).optional(),

  // Tutor's profile
  teachingSummary: z.string().max(750),
  studentResults: z.string().max(750),
  sellingPoints: z.string().max(750),

  // Agreement
  agreeTerms: z
    .boolean()
    .refine((val) => val === true, "You must agree to Terms and Conditions"),
  agreeAssignmentInfo: z
    .boolean()
    .refine((val) => val === true, "You must agree to Assignment Info"),
});

export type AddTutorFormValues = z.infer<typeof addTutorSchema>;

// Default initial values
export const initialTutorFormValues: AddTutorFormValues = {
  fullName: "",
  contactNumber: "",

  email: "",
  dateOfBirth: "",

  gender: "Male",
  age: 18,
  nationality: "Singaporean",
  race: "Chinese",
  last4NRIC: "",
  tutoringLevels: [],
  preferredLocations: [],
  tutorType: "Full Time Student",
  yearsExperience: 0,
  highestEducation: "Undergraduate",
  academicDetails: "",
  teachingSummary: "",
  studentResults: "",
  sellingPoints: "",
  agreeTerms: false,
  agreeAssignmentInfo: false,
};
