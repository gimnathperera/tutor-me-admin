import type { Metadata } from "next";
import AddAdminForm from "./components/AddAdminForm";

export const metadata: Metadata = {
  title: "Admin Management | TuitionLanka Admin Panel",
  description: "Create and invite new admin users from the admin panel.",
};

export default function AdminManagementPage() {
  return (
    <div className="p-5  lg:p-6">
      <div className="mb-5 flex items-center justify-between lg:mb-7">
        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-white/90">
          Admin Management
        </h3>
      </div>

      <div className="space-y-6">
        <AddAdminForm />
      </div>
    </div>
  );
}
