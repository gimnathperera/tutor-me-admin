import SignInForm from "@/components/auth/form-sign-in/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Tuition Lanka",
  description: "This is Next.js Signin Page TuitionLanka Dashboard Template",
};

export default function SignIn() {
  return <SignInForm />;
}
