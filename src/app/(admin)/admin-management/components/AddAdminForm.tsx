"use client";

import { Button } from "@/components/ui/button/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateAdminMutation } from "@/store/api/splits/admins";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  createAdminSchema,
  CreateAdminSchema,
  initialAdminValues,
} from "./admin-schema";

const workflowSteps = [
  "Create the admin account with name, email, phone number, and password.",
  "Backend creates the admin with role: admin.",
];

export default function AddAdminForm() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [createAdmin, { isLoading }] = useCreateAdminMutation();

  const form = useForm<CreateAdminSchema>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: initialAdminValues,
    mode: "onChange",
  });

  const {
    formState: { errors },
    reset,
  } = form;

  const onSubmit = async (values: CreateAdminSchema) => {
    const result = await createAdmin(values);
    const error = getErrorInApiResult(result);

    if (error) {
      toast.error(error);
      return;
    }

    setInviteEmail(values.email);
    toast.success("Admin created successfully");
    reset(initialAdminValues);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
      <Card className="border-gray-200/80 bg-white/95  dark:border-gray-800 dark:bg-gray-900">
        <CardHeader className="border-b border-gray-100  dark:border-gray-800 dark:from-blue-500/10 dark:via-gray-900 dark:to-cyan-500/10">
          <CardTitle className="flex items-center gap-3 text-2xl text-gray-900 dark:text-white">
            Create Admin Account
          </CardTitle>
          <CardDescription className="max-w-2xl text-sm text-gray-600 dark:text-gray-400">
            Add a new admin, trigger the reset-password email, and guide them
            through the first login flow after they set a new password.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Admin Name
                </label>
                <Input id="name" {...form.register("name")} />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Email Address
                </label>
                <Input id="email" type="email" {...form.register("email")} />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Phone Number
                </label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  {...form.register("phoneNumber")}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Initial Password
                </label>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This value is submitted with the create request. The admin
                  will still reset their password from the email link before
                  logging in.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm text-blue-900 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-100">
              After creation, the backend sends a reset-password email with a
              token link. The new admin must set a fresh password before their
              first login.
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                className="bg-blue-700 text-white hover:bg-blue-600"
                isLoading={isLoading}
              >
                Create Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => reset(initialAdminValues)}
              >
                Clear Form
              </Button>
            </div>
          </form>

          {inviteEmail && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-semibold">Reset email sent</p>
                  <p className="text-sm">
                    A reset-password email has been queued for{" "}
                    <span className="font-medium">{inviteEmail}</span>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-gray-200/80 bg-white shadow-[0_18px_80px_-30px_rgba(37,99,235,0.18)] dark:border-gray-800 dark:bg-gray-900">
          <CardHeader className="border-b border-gray-100  dark:border-gray-800 dark:from-blue-500/10 dark:via-gray-900 dark:to-sky-500/10">
            <CardTitle className="flex items-center gap-3 text-xl text-gray-900 dark:text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </span>
              Admin Invite Flow
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
              This page covers the full admin onboarding flow from creation to
              password reset and login.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {workflowSteps.map((step, index) => (
              <div
                key={step}
                className="flex gap-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-800/60"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                  {step}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
