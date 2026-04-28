export const preferredLocationOptions = [
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
].map((v) => ({ value: v, text: v }));

export const YEARS_EXPERIENCE_OPTIONS = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
  { value: 9, label: "9" },
  { value: 10, label: "10+" },
];

export function formatYearsExperience(value?: number | string | null): string {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "number") {
    return value >= 10 ? "10+" : String(value);
  }
  const n = Number(value);
  if (!Number.isNaN(n)) {
    return n >= 10 ? "10+" : String(n);
  }
  return String(value);
}

export const tutorTypeOptions = [
  "Private Tutor",
  "Government Teacher",
  "University Student",
  "Coach",
].map((v) => ({ value: v, text: v }));

export const classTypeOptions = [
  "Online - Individual",
  "Online - Group",
  "Physical - Individual",
  "Physical - Group",
].map((v) => ({ value: v, text: v }));

export const tutorStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "suspended", label: "Suspended" },
];
