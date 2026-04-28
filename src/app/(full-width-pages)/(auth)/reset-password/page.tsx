import ResetPasswordForm from "@/components/auth/form-reset-password";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | TuitionLanka Admin Panel",
  description: "Set a new password from your admin invitation link.",
};

type ResetPasswordPageProps = {
  searchParams?: Promise<{
    token?: string | string[];
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const tokenValue = resolvedSearchParams?.token;
  const token = Array.isArray(tokenValue)
    ? tokenValue[0] ?? ""
    : tokenValue ?? "";

  return <ResetPasswordForm token={token} />;
}
