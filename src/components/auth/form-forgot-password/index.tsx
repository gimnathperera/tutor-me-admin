"use client";

import InputText from "@/components/shared/input-text";
import SubmitButton from "@/components/shared/submit-button";
import { useForgotPasswordMutation } from "@/store/api/splits/auth";
import { ForgotPasswordRequest } from "@/types/request-types";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ForgotPasswordSchema, forgotPasswordSchema } from "./schema";

const FormForgotPassword = () => {
  const [sentEmail, setSentEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const forgotPasswordForm = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    const payload: ForgotPasswordRequest = { email: data.email };
    const result = await forgotPassword(payload);
    const error = getErrorInApiResult(result);

    if (error) {
      toast.error(error);
      return;
    }

    setSentEmail(data.email);
    toast.success(result.data?.message ?? "Reset link request sent successfully.");
    forgotPasswordForm.reset({ email: "" });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6">
        <h1 className="mb-2 text-title-sm font-semibold text-gray-800 dark:text-white/90 sm:text-title-md">
          Forgot Password
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your email and we will prepare a password reset link for your
          account.
        </p>
      </div>

      <FormProvider {...forgotPasswordForm}>
        <form onSubmit={forgotPasswordForm.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <InputText
              label="Email"
              name="email"
              placeholder="jhon@xyz.com"
              type="email"
            />
          </div>

          {sentEmail && (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100">
              If an account exists for <span className="font-medium">{sentEmail}</span>, a reset link will be sent to that inbox.
            </div>
          )}

          <div className="space-y-3 mt-8">
            <SubmitButton
              title="Send Reset Link"
              type="submit"
              loading={isLoading}
            />

            <Link
              href="/signin"
              className="block text-center text-sm font-medium text-blue-700 hover:underline dark:text-blue-400"
            >
              Back to sign in
            </Link>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default FormForgotPassword;
