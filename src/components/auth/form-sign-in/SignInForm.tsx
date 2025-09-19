"use client";
import Checkbox from "@/components/form/input/Checkbox";
import InputPassword from "@/components/shared/input-password";
import InputText from "@/components/shared/input-text";
import SubmitButton from "@/components/shared/submit-button";
import { useAuthContext } from "@/context";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { initialFormValues, LoginSchema, loginSchema } from "./schema";

export default function SignInForm() {
  const [isChecked, setIsChecked] = useState(false);
  const { login, isAuthError, setIsAuthError, isLoading } = useAuthContext();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: initialFormValues,
    mode: "onChange",
  });

  const { watch } = loginForm;
  watch(() => {
    if (isAuthError) setIsAuthError(null);
  });

  const onSubmit = (data: LoginSchema) => {
    login(data);
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
          <div>
            <FormProvider {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  <div>
                    <InputText
                      label="Email"
                      name="email"
                      placeholder="jhon@xyz.com"
                      type="email"
                    />
                  </div>
                  <div>
                    <InputPassword
                      label="Password"
                      name="password"
                      placeholder="*******"
                    />
                  </div>
                  {isAuthError && (
                    <span className="text-red-500 text-xs">{isAuthError}</span>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox checked={isChecked} onChange={setIsChecked} />
                      <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                        Keep me logged in
                      </span>
                    </div>
                    <Link
                      href="/reset-password"
                      className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div>
                    <SubmitButton
                      title="Sign In"
                      type="submit"
                      loading={isLoading}
                    />
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
