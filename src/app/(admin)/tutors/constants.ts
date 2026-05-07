export {
  PREFERRED_LOCATION_OPTIONS as preferredLocationOptions,
  TUTORING_LEVEL_OPTIONS as tutoringLevelOptions,
  YEARS_EXPERIENCE_OPTIONS,
  TUTOR_TYPE_OPTIONS as tutorTypeOptions,
  CLASS_TYPE_OPTIONS as classTypeOptions,
  TUTOR_STATUS_OPTIONS as tutorStatusOptions,
} from "@/configs/app-constants";

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
