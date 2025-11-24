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
  tutorMediums: z
    .array(z.string())
    .min(1, "Please select at least one medium."),

  grades: z.array(z.string()).min(1, "Select at least one grade"),
  subjects: z.array(z.string()).min(1, "Select at least one subject"),
  nationality: z.enum(["Sri Lankan", "Others"]),
  race: z.enum(["Sinhalese", "Tamil", "Muslim", "Burgher", "Others"]),
  last4NRIC: z
    .string()
    .length(4, "Last 4 digits of NRIC must be exactly 4 digits"),

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
  tutorMediums: [],
  grades: [],
  subjects: [],
  nationality: "Sri Lankan",
  race: "Sinhalese",
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
