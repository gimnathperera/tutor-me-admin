import { Metadata } from "next";
import { BlogsTabs } from "./components";

export const metadata: Metadata = {
  title: "Grades | TuitionLanka",
  description: "This is the Grades management page for TuitionLanka",
};

export default function page() {
  return (
    <div>
      <div className="p-5  lg:p-6">
        <div className="space-y-6">
          <BlogsTabs />
        </div>
      </div>
    </div>
  );
}
