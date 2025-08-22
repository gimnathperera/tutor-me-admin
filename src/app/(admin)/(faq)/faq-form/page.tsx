import FAQFormInputs from "@/components/form/form-elements/FAQFormInputs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Create FAQ | TutorMe - Next.js Dashboard Template",
  description: "This is Next.js Create FAQ TutorMe Dashboard Template",
};

export default function FAQFormPage() {
  return (
    <FAQFormInputs />
  );
}
