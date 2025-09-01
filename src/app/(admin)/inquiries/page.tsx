import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Inquiries | TutorMe",
  description: "This is the Inquiries management page for TutorMe",
};

export default function FAQPage() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-5 flex items-center justify-between lg:mb-7">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-white/90">
            Inquiries
          </h3>
          
        </div>

        <div className="space-y-6">
          
        </div>
      </div>
    </div>
  );
}
