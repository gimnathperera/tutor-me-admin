import { Metadata } from "next";
import { AddTuitionRate } from "./create-tuition-rate/AddTuitionRate";
import TuitionRatesTable from "./RatesList";

export const metadata: Metadata = {
  title: "Tuition Rates | TuitionLanka",
  description: "This is the Tuition Rates management page for TuitionLanka",
};

export default function Profile() {
  return (
    <div>
      <div className="p-5  lg:p-6">
        <div className="mb-5 flex items-center justify-between lg:mb-7">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-white/90">
            Tuition Rates
          </h3>
          <AddTuitionRate />
        </div>

        <div className="space-y-6">
          <TuitionRatesTable />
        </div>
      </div>
    </div>
  );
}
