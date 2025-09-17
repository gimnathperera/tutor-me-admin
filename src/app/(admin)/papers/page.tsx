import { AddPaper } from "./components/add-paper/page";
import PapersTable from "./components/PapersList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Papers | TutorMe",
  description: "This is the Papers management page for TutorMe",
};

const TestPapers = () => {
  return (
    <div className="max-w-full">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-5 flex items-center justify-between lg:mb-7">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-white/90">
            Papers
          </h3>
          <AddPaper />
        </div>

        <div className="space-y-6">
          <PapersTable />
        </div>
      </div>
    </div>
  );
};

export default TestPapers;
