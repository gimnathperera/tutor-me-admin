import { Metadata } from "next";
import TutorsList from "./components/TutorsList";
import { AddTutor } from "./components/add-tutor/page";

export const metadata: Metadata = {
  title: "Tutors | TutorMe - Admin Dashboard",
  description: "Manage tutors",
};

export default function TutorsPage() {
  return (
    <div className="max-w-full">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-5 flex items-center justify-between lg:mb-7">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-white/90">
            Tutors
          </h3>
          <AddTutor />
        </div>
        <div className="space-y-6">
          <TutorsList />
        </div>
      </div>
    </div>
  );
}
