import SignInForm from "@/components/auth/form-sign-in/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignIn Page | TutorMe - Next.js Dashboard Template",
  description: "This is Next.js Signin Page TutorMe Dashboard Template",
};

export default function SignIn() {
  return <SignInForm />;
}
