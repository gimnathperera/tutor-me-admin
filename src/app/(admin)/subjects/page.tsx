import { Metadata } from "next";
import SubjectsTable from "./components/SubjectsList";
import { AddSubject } from "./components/add-subject/AddSubject";

export const metadata: Metadata = {
  title: "Subjects | TutorMe",
  description: "This is the Subjects management page for TutorMe",
};

export default function Profile() {
  return (
    <div className="max-w-full">
      <div className="p-5  lg:p-6">
        <div className="mb-5 flex items-center justify-between lg:mb-7">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-white/90">
            Subjects
          </h3>
          <AddSubject />
        </div>

        <div className="space-y-6">
          <SubjectsTable />
        </div>
      </div>
    </div>
  );
}
