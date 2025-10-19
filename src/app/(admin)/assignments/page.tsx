import { Metadata } from "next";
import AssignmentsTable from "./components/AssignmentsList";
import { AddAssignment } from "./components/add-assignment/AddAssignment";

export const metadata: Metadata = {
  title: "Assignments | TutorMe - Admin Dashboard",
  description: "Manage tuition assignments",
};

export default function AssignmentsPage() {
  return (
    <div className="max-w-full">
      <div className=" p-5  lg:p-6">
        <div className="mb-5 flex items-center justify-between lg:mb-7">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-white/90">
            Tuition Assignments
          </h3>
          <AddAssignment />
        </div>
        <div className="space-y-6">
          <AssignmentsTable />
        </div>
      </div>
    </div>
  );
}
