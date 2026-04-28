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
  gender: z.enum(["Male", "Female", "Others"]).optional(),
  age: z.number().int().min(1, "Age must be at least 1").optional(),
  tutorMediums: z.array(z.string()).optional(),
  grades: z.array(z.string()).optional(),
  subjects: z.array(z.string()).optional(),

  nationality: z.enum(["Sri Lankan", "Others"]).optional(),
  race: z.enum(["Sinhalese", "Tamil", "Muslim", "Burgher", "Others"]).optional(),

  status: z.enum(["pending", "approved", "rejected", "suspended"]).optional(),

  classType: z.array(z.string()).optional(),

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

  tutorType: z
    .array(
      z.enum([
        "Private Tutor",
        "Government Teacher",
        "University Student",
        "Coach",
      ]),
    )
    .optional(),

  yearsExperience: z.number().int().min(1).max(50).optional(),

  highestEducation: z
    .enum([
      "PhD",
      "Masters",
      "Bachelor Degree",
      "Undergraduate",
      "Diploma and Professional",
      "AL",
    ])
    .optional(),

  academicDetails: z.string().max(500).optional(),
  teachingSummary: z.string().max(500).optional(),
  studentResults: z.string().max(500).optional(),
  sellingPoints: z.string().max(500).optional(),

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
