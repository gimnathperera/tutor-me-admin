import { z } from "zod";

export const updateTutorSchema = z.object({
  fullName: z.string().optional(),
  contactNumber: z
    .string()
    .regex(/^\d+$/, "Contact number must contain only numbers")
    .min(7, "Contact number must be at least 7 digits")
    .max(15, "Contact number must be at most 15 digits")
    .optional(),
  email: z.string().email("Email must be valid").optional(),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of Birth must be in YYYY-MM-DD")
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
  last4NRIC: z
    .string()
    .length(4, "Last 4 digits of NRIC must be exactly 4 digits")
    .regex(/^\d{4}$/, "Last 4 digits of NRIC must be numbers")
    .optional(),

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

  teachingSummary: z.string().max(750).optional(),
  studentResults: z.string().max(750).optional(),
  sellingPoints: z.string().max(750).optional(),

  agreeTerms: z.boolean().optional(),
  agreeAssignmentInfo: z.boolean().optional(),
});

export type UpdateTutorSchema = z.infer<typeof updateTutorSchema>;
