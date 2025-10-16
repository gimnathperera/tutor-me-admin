import { Metadata } from "next";
import RequestForTutorsList from "./TutorsList";

export const metadata: Metadata = {
  title: "Requests For Tutors | TutorMe - Admin Dashboard",
  description: "Manage tutors",
};

export default function TutorsPage() {
  return (
    <div className="max-w-full">
      <div className="p-5  lg:p-6">
        <div className="mb-5 flex items-center justify-between lg:mb-7">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-white/90">
            Requests For Tutors
          </h3>
        </div>
        <div className="space-y-6">
          <RequestForTutorsList />
        </div>
      </div>
    </div>
  );
}
