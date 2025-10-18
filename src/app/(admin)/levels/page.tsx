import { Metadata } from "next";
import { AddLevel } from "./create-level/AddLevel";
import LevelsTable from "./LevelsList";

export const metadata: Metadata = {
  title: "Levels | TutorMe",
  description: "This is the Levels management page for TutorMe",
};

export default function LevelsPage() {
  return (
    <div>
      <div className="p-5  lg:p-6">
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
