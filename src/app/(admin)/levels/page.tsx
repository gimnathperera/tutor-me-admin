import { Metadata } from "next";
import { AddLevel } from "./create-level/page";
import LevelsTable from "./LevelsList";

export const metadata: Metadata = {
  title: "TutorMe Admin | Levels",
  description: "Manage Levels",
};

export default function LevelsPage() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-5 flex items-center justify-between lg:mb-7">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-white/90">
            Levels
          </h3>
          <AddLevel />
        </div>

        <div className="space-y-6">
          <LevelsTable />
        </div>
      </div>
    </div>
  );
}
