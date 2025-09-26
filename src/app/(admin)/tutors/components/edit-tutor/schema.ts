import { z } from "zod";

// Update schema - matching backend validation but optional for updates
export const updateTutorSchema = z.object({
  fullName: z.string().optional(),
  contactNumber: z
    .string()
    .regex(/^\d+$/, "Contact number must contain only numbers")
    .min(7, "Contact number must be at least 7 digits")
    .max(15, "Contact number must be at most 15 digits")
    .optional(),
  email: z.string().email("Email must be valid").optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["Male", "Female"]).optional(),
  age: z.number().int().min(1, "Age must be at least 1").optional(),
  nationality: z.enum(["Singaporean", "Singapore PR", "Others"]).optional(),
  race: z
    .enum([
      "Chinese",
      "Malay",
      "Indian",
      "Eurasian",
      "Caucasian",
      "Punjabi",
      "Others",
    ])
    .optional(),
  last4NRIC: z
    .string()
    .length(4, "Last 4 digits of NRIC must be exactly 4 digits")
    .regex(/^\d{4}$/, "Last 4 digits of NRIC must be numbers")
    .optional(),

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
    .min(1, "Select at least one tutoring level")
    .optional(),

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
        "Hillview",
        "Keat Hong",
        "Teck Whye",
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
    .min(1, "Select at least one preferred location")
    .optional(),

  // Academic qualifications
  tutorType: z
    .enum([
      "Full Time Student",
      "Undergraduate",
      "Part Time Tutor",
      "Full Time Tutor",
      "Ex/Current MOE Teacher",
      "Ex-MOE Teacher",
      "Current MOE Teacher",
    ])
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

  academicDetails: z.string().max(1000).optional(),

  // Tutor's profile
  teachingSummary: z.string().max(750).optional(),
  studentResults: z.string().max(750).optional(),
  sellingPoints: z.string().max(750).optional(),
});

export type UpdateTutorSchema = z.infer<typeof updateTutorSchema>;
