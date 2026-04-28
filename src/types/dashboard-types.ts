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
  accent: string;
  glow: string;
}> = [
  {
    label: "Registered Tutors",
    key: "registeredTutors",
    icon: GraduationCap,
    accent: "from-sky-500 via-cyan-500 to-blue-600",
    glow: "shadow-sky-500/20",
  },
  {
    label: "Registered Students",
    key: "registeredStudents",
    icon: Users,
    accent: "from-emerald-500 via-teal-500 to-green-600",
    glow: "shadow-emerald-500/20",
  },
  {
    label: "Tutor Requests",
    key: "requestTutorRequests",
    icon: ClipboardList,
    accent: "from-violet-500 via-fuchsia-500 to-purple-600",
    glow: "shadow-violet-500/20",
  },
  {
    label: "Register as Tutor",
    key: "registerAsTutorRequests",
    icon: UserPlus,
    accent: "from-amber-500 via-orange-500 to-rose-500",
    glow: "shadow-orange-500/20",
  },
];
