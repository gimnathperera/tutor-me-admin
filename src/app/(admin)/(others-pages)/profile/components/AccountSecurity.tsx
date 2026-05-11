"use client";

import InputPassword from "@/components/shared/input-password";
import { Button } from "@/components/ui/button";
import {
  PASSWORD_LETTER_NUMBER_MSG,
  PASSWORD_LETTER_NUMBER_REGEX,
  PASSWORD_MAX,
  PASSWORD_MIN,
  PASSWORD_TOO_LONG,
  PASSWORD_TOO_SHORT,
} from "@/configs/password";
import { useAuthContext } from "@/context";
import { useUpdateUserPasswordMutation } from "@/store/api/splits/users";
import { getErrorInApiResult } from "@/utils/api";
import { removeWhitespace } from "@/utils/form-normalizers";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, KeyboardEvent } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(PASSWORD_MIN, { message: PASSWORD_TOO_SHORT })
      .max(PASSWORD_MAX, { message: PASSWORD_TOO_LONG })
      .regex(PASSWORD_LETTER_NUMBER_REGEX, { message: PASSWORD_LETTER_NUMBER_MSG }),
    confirmPassword: z.string().min(PASSWORD_MIN, { message: PASSWORD_TOO_SHORT }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Confirm Password must match New Password",
    path: ["confirmPassword"],
  });

type PasswordSchema = z.infer<typeof passwordSchema>;

const initialValues: PasswordSchema = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const preventWhitespaceKey = (event: KeyboardEvent<HTMLInputElement>) => {
  if (/\s/.test(event.key)) event.preventDefault();
};

export default function AccountSecurity() {
  const { user: authUser } = useAuthContext();
  const [updateUserPassword, { isLoading }] = useUpdateUserPasswordMutation();

  const form = useForm<PasswordSchema>({
    resolver: zodResolver(passwordSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const { isDirty, isValid } = form.formState;
  const currentPassword = form.watch("currentPassword");
  const newPassword = form.watch("newPassword");
  const confirmPassword = form.watch("confirmPassword");

  const areAllFieldsFilled =
    !!currentPassword?.trim() && !!newPassword?.trim() && !!confirmPassword?.trim();

  const isButtonDisabled = !isDirty || !areAllFieldsFilled || !isValid || isLoading;

  const sanitize =
    (field: keyof PasswordSchema) => (event: ChangeEvent<HTMLInputElement>) => {
      const noSpaces = removeWhitespace(event.target.value);
      if (noSpaces !== event.target.value) event.target.value = noSpaces;
      form.setValue(field, noSpaces, { shouldValidate: true, shouldDirty: true });
    };

  const onSubmit = async (data: PasswordSchema) => {
    if (!authUser?.id) return;

    const result = await updateUserPassword({
      id: String(authUser.id),
      payload: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
    });

    const error = getErrorInApiResult(result);
    if (error) return toast.error(error);

    toast.success("Password updated successfully");
    form.reset();
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
        Account Security
      </h3>
      <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
        Change your password using your current password for verification.
      </p>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid max-w-xl grid-cols-1 gap-4 sm:gap-5">
            <InputPassword
              label="Current password *"
              name="currentPassword"
              placeholder="Enter current password"
              onKeyDown={preventWhitespaceKey}
              onChange={sanitize("currentPassword")}
            />
            <InputPassword
              label="New password *"
              name="newPassword"
              placeholder="Enter new password"
              onKeyDown={preventWhitespaceKey}
              onChange={sanitize("newPassword")}
            />
            <InputPassword
              label="Confirm password *"
              name="confirmPassword"
              placeholder="Re-enter new password"
              onKeyDown={preventWhitespaceKey}
              onChange={sanitize("confirmPassword")}
            />
          </div>

          <div className="mt-4 sm:mt-5">
            <Button
              type="submit"
              disabled={isButtonDisabled}
              className="bg-blue-700 text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Change Password"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
