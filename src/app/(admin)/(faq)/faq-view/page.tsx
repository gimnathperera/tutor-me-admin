import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import FAQTable from "@/components/tables/FAQTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | TutorMe ",
  description: "View and manage FAQs in the TutorMe admin panel.",
};

export default function FAQPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="FAQ" />
      <div className="flex justify-end mb-4">
        <a
          href="/faq-form"
          className="inline-flex items-center gap-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          + Add FAQ
        </a>
      </div>
      <FAQTable />
    </div>
  );
}
