import { Metadata } from "next";
import { AddGrade } from "./create-grade/AddGrade";
import GradesTable from "./GradesList";

export const metadata: Metadata = {
  title: "Grades | TuitionLanka",
  description: "This is the Grades management page for TuitionLanka",
};

export default function Profile() {
  return (
    <div>
      <div className="p-5  lg:p-6">
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
