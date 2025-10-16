import { Metadata } from "next";
import FAQTable from "./components/FAQTable";
import { AddFAQ } from "./components/add-faq/page";

export const metadata: Metadata = {
  title: "FAQ | TutorMe",
  description: "This is the FAQ management page for TutorMe",
};

export default function FAQPage() {
  return (
    <div>
      <div className="p-5  lg:p-6">
        <div className="mb-5 flex items-center justify-between lg:mb-7">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-white/90">
            FAQs
          </h3>
          <AddFAQ />
        </div>

        <div className="space-y-6">
          <FAQTable />
        </div>
      </div>
    </div>
  );
}
