import { Metadata } from "next";
import InquiryTable from "./components/InquiryTable";
import { AddInquiry } from "./components/add-inquiry/AddInquiry";

export const metadata: Metadata = {
  title: "Inquiries | TuitionLanka",
  description: "This is the Inquiries management page for TuitionLanka",
};

export default function ContactUsInquiryPage() {
  return (
    <div>
      <div className="p-5  lg:p-6">
        <div className="mb-5 flex items-center justify-between lg:mb-7">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-white/90">
            Contact Us - Inquiries
          </h3>
          <AddInquiry />
        </div>

        <div className="space-y-6">
          <InquiryTable />
        </div>
      </div>
    </div>
  );
}
