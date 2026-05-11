import {
  ClipboardList,
  GraduationCap,
  LucideIcon,
  UserPlus,
  Users,
} from "lucide-react";

type SummaryKey =
  | "registeredTutors"
  | "registeredStudents"
  | "requestTutorRequests"
  | "registerAsTutorRequests";

export const statCards: Array<{
  label: string;
  key: SummaryKey;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  accent: string;
}> = [
  {
    label: "Registered Tutors",
    key: "registeredTutors",
    icon: GraduationCap,
    iconBg: "bg-blue-50 dark:bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    accent: "bg-blue-600",
  },
  {
    label: "Registered Students",
    key: "registeredStudents",
    icon: Users,
    iconBg: "bg-teal-50 dark:bg-teal-500/10",
    iconColor: "text-teal-600 dark:text-teal-400",
    accent: "bg-teal-500",
  },
  {
    label: "Tutor Requests",
    key: "requestTutorRequests",
    icon: ClipboardList,
    iconBg: "bg-violet-50 dark:bg-violet-500/10",
    iconColor: "text-violet-600 dark:text-violet-400",
    accent: "bg-violet-600",
  },
  {
    label: "Register as Tutor",
    key: "registerAsTutorRequests",
    icon: UserPlus,
    iconBg: "bg-orange-50 dark:bg-orange-500/10",
    iconColor: "text-orange-600 dark:text-orange-400",
    accent: "bg-orange-500",
  },
];
