import { Metadata } from "next";
import { AddGrade } from "./create-grade/page";
import GradesTable from "./GradesList";

export const metadata: Metadata = {
  title: "Grades | TutorMe",
  description: "This is the Grades management page for TutorMe",
};

export default function Profile() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-5 flex items-center justify-between lg:mb-7">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-white/90">
            Grades
          </h3>
          <AddGrade />
        </div>

        <div className="space-y-6">
          <GradesTable />
        </div>
      </div>
    </div>
  );
}
