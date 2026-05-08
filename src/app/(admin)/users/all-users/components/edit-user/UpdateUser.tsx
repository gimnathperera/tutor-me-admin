/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import FileUploadDropzone from "@/components/fileUploader";
import { Button } from "@/components/ui/button/Button";
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
import { SquarePen } from "lucide-react";
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

const normalizeTextInput = (value: string) => {
  return value.replace(/^\s+/g, "").replace(/\s{2,}/g, " ");
};

export function UpdateUser(props: UpdateUserProps) {
  const [open, setOpen] = useState(false);
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

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof UpdateUserSchema,
  ) => {
    let value = e.target.value;

    // Special handling for phone number
    if (field === "phoneNumber") {
      value = value.replace(/\D/g, "");
    } else {
      value = value.replace(/^\s+/g, "");
      value = value.replace(/\s{2,}/g, " ");
    }

    setValue(field, value as never, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleTextBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    field: keyof UpdateUserSchema,
  ) => {
    const value = normalizeTextInput(e.target.value).trim();

    setValue(field, value as never, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

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
      const payload = {
        id: props.id,
        email: data.email,
        role: data.role,
        name: data.name,
        status: data.status || "pending",
        phoneNumber: data.phoneNumber || "",
        birthday: data.birthday || "",
        country: data.country || "",
        city: data.city || "",
        state: data.state || "",
        region: data.region || "",
        zip: data.zip || "",
        address: data.address || "",
        gender: data.gender || "other",
        avatar: data.avatar || "",
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

        <DialogContent className="sm:max-w-[425px] max-h-[80vh] bg-white z-50 dark:bg-gray-800 dark:text-white/90 flex flex-col overflow-hidden">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex max-h-[80vh] flex-col overflow-hidden"
          >
            <DialogHeader className="sticky top-0 z-10 bg-white dark:bg-gray-800 pb-4">
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Edit the user details.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 overflow-y-auto pr-2 py-2 scrollbar-thin">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  onChange={(e) => handleTextChange(e, "name")}
                  onBlur={(e) => handleTextBlur(e, "name")}
                />
                {formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  {...register("email")}
                  onChange={(e) => handleTextChange(e, "email")}
                  onBlur={(e) => handleTextBlur(e, "email")}
                />
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
                  inputMode="numeric"
                  {...register("phoneNumber")}
                  onChange={(e) => handleTextChange(e, "phoneNumber")}
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
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  {...register("country")}
                  onChange={(e) => handleTextChange(e, "country")}
                  onBlur={(e) => handleTextBlur(e, "country")}
                />
                {formState.errors.country && (
                  <p className="text-sm text-red-500">
                    {formState.errors.country.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...register("city")}
                  onChange={(e) => handleTextChange(e, "city")}
                  onBlur={(e) => handleTextBlur(e, "city")}
                />
                {formState.errors.city && (
                  <p className="text-sm text-red-500">
                    {formState.errors.city.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  {...register("state")}
                  onChange={(e) => handleTextChange(e, "state")}
                  onBlur={(e) => handleTextBlur(e, "state")}
                />
                {formState.errors.state && (
                  <p className="text-sm text-red-500">
                    {formState.errors.state.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  {...register("region")}
                  onChange={(e) => handleTextChange(e, "region")}
                  onBlur={(e) => handleTextBlur(e, "region")}
                />
                {formState.errors.region && (
                  <p className="text-sm text-red-500">
                    {formState.errors.region.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="zip">Zip</Label>
                <Input
                  id="zip"
                  {...register("zip")}
                  onChange={(e) => handleTextChange(e, "zip")}
                  onBlur={(e) => handleTextBlur(e, "zip")}
                />
                {formState.errors.zip && (
                  <p className="text-sm text-red-500">
                    {formState.errors.zip.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  {...register("address")}
                  onChange={(e) => handleTextChange(e, "address")}
                  onBlur={(e) => handleTextBlur(e, "address")}
                />
                {formState.errors.address && (
                  <p className="text-sm text-red-500">
                    {formState.errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="birthday">Birthday</Label>
                <Input id="birthday" type="date" {...register("birthday")} />
                {formState.errors.birthday && (
                  <p className="text-sm text-red-500">
                    {formState.errors.birthday.message}
                  </p>
                )}
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
                    <SelectItem value="other">Other</SelectItem>
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

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>

              <Button
                type="submit"
                className="bg-blue-700 text-white hover:bg-blue-500"
                isLoading={isLoading}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </form>
    </Dialog>
  );
}
