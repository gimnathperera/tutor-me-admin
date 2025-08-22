import { Metadata } from "next";
import SubjectsTable from "./components/SubjectsList";

export const metadata: Metadata = {
  title: "Next.js Profile | TutorMe - Next.js Dashboard Template",
  description:
    "This is Next.js Profile page for TutorMe - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function Profile() {

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Subjects
        </h3>
        <div className="space-y-6">
            <SubjectsTable />
        </div>
      </div>
    </div>
  );
}
