"use client";

import Checkbox from "@/components/form/input/Checkbox";
import InputPassword from "@/components/shared/input-password";
import InputText from "@/components/shared/input-text";
import SubmitButton from "@/components/shared/submit-button";
import { useAuthContext } from "@/context";
import { useForgotPasswordMutation } from "@/store/api/splits/auth";
import { ForgotPasswordRequest } from "@/types/request-types";
import { getErrorInApiResult } from "@/utils/api";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  ForgotPasswordSchema,
  forgotPasswordSchema,
} from "../form-forgot-password/schema";
import { initialFormValues, LoginSchema, loginSchema } from "./schema";

export default function SignInForm() {
  const [isChecked, setIsChecked] = useState(false);
  const { login, isAuthError, setIsAuthError, isLoading } = useAuthContext();
  const { isOpen, openModal, closeModal } = useModal();
  const [sentEmail, setSentEmail] = useState("");
  const [forgotPassword, { isLoading: isForgotPasswordLoading }] =
    useForgotPasswordMutation();

  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: initialFormValues,
    mode: "onChange",
  });

  const forgotPasswordForm = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = loginForm.watch(() => {
      if (isAuthError) setIsAuthError(null);
    });

    return () => subscription.unsubscribe();
  }, [loginForm, isAuthError, setIsAuthError]);

  useEffect(() => {
    if (isAuthError) {
      toast.error(isAuthError);
    }
  }, [isAuthError]);

  const onSubmit = (data: LoginSchema) => {
    setIsAuthError(null);
    login(data);
  };

  const openForgotPasswordModal = () => {
    setSentEmail("");
    forgotPasswordForm.reset({ email: "" });
    openModal();
  };

  const closeForgotPasswordModal = () => {
    setSentEmail("");
    forgotPasswordForm.reset({ email: "" });
    closeModal();
  };

  const handleForgotPasswordSubmit = async (data: ForgotPasswordSchema) => {
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
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>

          <FormProvider {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <InputText
                  label="Email"
                  name="email"
                  placeholder="jhon@xyz.com"
                  type="email"
                />

                <InputPassword
                  label="Password"
                  name="password"
                  placeholder="*******"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={openForgotPasswordModal}
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </button>
                </div>

                <SubmitButton
                  title="Sign In"
                  type="submit"
                  loading={isLoading}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeForgotPasswordModal}
        className="max-w-[560px] p-0"
        ariaLabel="Forgot password modal"
      >
        <div className="border-b border-gray-100 px-6 py-5 dark:border-gray-800">
          <h2 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
            Forgot Password
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enter your email and we will send a reset link if the account
            exists.
          </p>
        </div>

        <div className="px-6 py-6">
          <FormProvider {...forgotPasswordForm}>
            <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPasswordSubmit)}>
              <div className="space-y-5">
                <InputText
                  label="Email"
                  name="email"
                  placeholder="jhon@xyz.com"
                  type="email"
                />

                {sentEmail && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100">
                    If an account exists for{" "}
                    <span className="font-medium">{sentEmail}</span>, a reset
                    link will be sent to that inbox.
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeForgotPasswordModal}
                    className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <SubmitButton
                    title="Send Reset Link"
                    type="submit"
                    loading={isForgotPasswordLoading}
                  />
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </Modal>
    </div>
  );
}
