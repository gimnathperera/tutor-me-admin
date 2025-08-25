import FAQFormInputs from "@/components/form/form-elements/FAQFormInputs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create FAQ | TutorMe ",
  description: "Create a new FAQ entry in the TutorMe admin panel.",
};

export default function FAQFormPage() {
  return (
    <FAQFormInputs />
  );
}
