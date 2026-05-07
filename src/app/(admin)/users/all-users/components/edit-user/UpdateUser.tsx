/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import FileUploadDropzone from "@/components/fileUploader";
import { Button } from "@/components/ui/button/Button";
import DatePicker from "@/components/ui/DatePicker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useFetchUsersQuery,
  useUpdateUserMutation,
} from "@/store/api/splits/users";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen, X } from "lucide-react";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  initialFormValues,
  updateUserSchema,
  UpdateUserSchema,
} from "./schema";

type UserRole = "tutor" | "admin";
type UserStatus = "pending" | "approved" | "rejected" | "suspended";

const EMAIL_IMMUTABLE_MESSAGE =
  "Email cannot be modified after user creation.";

const getMinimumAdultBirthDate = () => {
  const today = new Date();
  return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
};

interface UpdateUserProps {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phoneNumber?: string;
  birthday?: string;
  status: UserStatus;
  country?: string;
  city?: string;
  zip?: string;
  address?: string;
  state?: string;
  region?: string;
  gender?: "male" | "female" | "other";
  avatar?: string;
}

export function UpdateUser(props: UpdateUserProps) {
  const [open, setOpen] = useState(false);
  const maxUserBirthday = getMinimumAdultBirthDate();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { refetch } = useFetchUsersQuery({
    page: 1,
    limit: 10,
    sortBy: "createdAt:desc",
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    props.avatar || null,
  );

  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { ...initialFormValues, ...props },
    mode: "onChange",
  });

  const { formState, register, setValue, handleSubmit, reset } = form;

  useEffect(() => {
    if (open) {
      reset({
        ...initialFormValues,
        ...props,
        birthday: props.birthday
          ? new Date(props.birthday).toISOString().substring(0, 10)
          : "",
      });
      setPreviewUrl(props.avatar || null);
    }
  }, [open, props, reset]);

  function handleSelect<T extends keyof UpdateUserSchema>(
    key: T,
    val: string,
    setValue: (field: T, value: UpdateUserSchema[T]) => void,
  ) {
    setValue(key, val as UpdateUserSchema[T]);
  }

  const onSubmit = async (data: UpdateUserSchema) => {
    try {
      const {
        email: _immutableEmail,
        country: _country,
        city: _city,
        state: _state,
        region: _region,
        zip: _zip,
        address: _address,
        ...editableData
      } = data;
      const payload = {
        id: props.id,
        role: editableData.role,
        name: editableData.name,
        status: editableData.status || "pending",
        phoneNumber: editableData.phoneNumber || "",
        birthday: editableData.birthday || "",
        gender: editableData.gender || "male",
        avatar: editableData.avatar || "",
      };

      const result = await updateUser(payload);
      const error = getErrorInApiResult(result);
      if (error) return toast.error(error);

      toast.success("User updated successfully");
      refetch();
      setOpen(false);
    } catch (error) {
      console.error("Unexpected error during user update:", error);
      toast.error("An unexpected error occurred while updating the user.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <SquarePen className="cursor-pointer text-blue-500 hover:text-blue-700" />
        </DialogTrigger>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-[425px] bg-white z-50 dark:bg-gray-800 dark:text-white/90 p-0 overflow-hidden [&>div:last-child]:flex [&>div:last-child]:min-h-0 [&>div:last-child]:flex-col [&>div:last-child]:overflow-hidden [&>div:last-child]:p-0"
        >
          <DialogHeader className="shrink-0 flex-row items-start justify-between bg-white dark:bg-gray-800 px-6 py-4 border-b z-40">
            <div className="space-y-2 text-left">
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Edit the user details.</DialogDescription>
            </div>
            <DialogClose asChild>
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </DialogClose>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin px-6 py-6">
            <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {formState.errors.name && (
                <p className="text-sm text-red-500">
                  {formState.errors.name.message}
                </p>
              )}
            </div>

            <div
              className="grid cursor-not-allowed gap-3"
              title={EMAIL_IMMUTABLE_MESSAGE}
            >
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={props.email || ""}
                className="cursor-not-allowed"
                disabled
                readOnly
                aria-readonly="true"
                aria-describedby={`user-email-immutable-help-${props.id}`}
              />
              <p
                id={`user-email-immutable-help-${props.id}`}
                className="sr-only"
              >
                {EMAIL_IMMUTABLE_MESSAGE}
              </p>
              {formState.errors.email && (
                <p className="text-sm text-red-500">
                  {formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="role">Role</Label>
              <Select
                onValueChange={(val) => handleSelect("role", val, setValue)}
                defaultValue={props.role || "tutor"}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tutor">Tutor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {formState.errors.role && (
                <p className="text-sm text-red-500">
                  {formState.errors.role.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="ex: 0712345678"
                {...register("phoneNumber")}
              />
              {formState.errors.phoneNumber && (
                <p className="text-sm text-red-500">
                  {formState.errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(val) => handleSelect("status", val, setValue)}
                defaultValue={props.status || "pending"}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              {formState.errors.status && (
                <p className="text-sm text-red-500">
                  {formState.errors.status.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <DatePicker
                id="birthday"
                label="Birthday"
                value={form.watch("birthday")}
                onChange={(date) =>
                  setValue("birthday", date, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                placeholder="Select birthday"
                error={formState.errors.birthday?.message}
                maxDate={maxUserBirthday}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="gender">Gender</Label>
              <Select
                onValueChange={(val) => handleSelect("gender", val, setValue)}
                defaultValue={props.gender || "male"}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              {formState.errors.gender && (
                <p className="text-sm text-red-500">
                  {formState.errors.gender.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="avatar">Avatar</Label>
              <FileUploadDropzone
                onUploaded={(url) => {
                  setValue("avatar", url);
                  setPreviewUrl(url);
                }}
              />
              {previewUrl && (
                <NextImage
                  src={previewUrl}
                  alt="Avatar Preview"
                  width={96}
                  height={96}
                  className="mt-2 h-24 w-24 object-cover rounded-full mx-auto"
                />
              )}
              {formState.errors.avatar && (
                <p className="text-sm text-red-500">
                  {formState.errors.avatar.message}
                </p>
              )}
            </div>
            </div>
          </div>

          <DialogFooter className="shrink-0 bg-white dark:bg-gray-800 px-6 py-4 border-t">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-700 text-white hover:bg-blue-500"
              isLoading={isLoading}
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
