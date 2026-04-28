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
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] scrollbar-thin overflow-y-auto bg-white z-50 dark:bg-gray-800 dark:text-white/90">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Edit the user details.</DialogDescription>
          </DialogHeader>

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

            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" {...register("email")} />
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
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("country")} />
              {formState.errors.country && (
                <p className="text-sm text-red-500">
                  {formState.errors.country.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
              {formState.errors.city && (
                <p className="text-sm text-red-500">
                  {formState.errors.city.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state")} />
              {formState.errors.state && (
                <p className="text-sm text-red-500">
                  {formState.errors.state.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="region">Region</Label>
              <Input id="region" {...register("region")} />
              {formState.errors.region && (
                <p className="text-sm text-red-500">
                  {formState.errors.region.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="zip">Zip</Label>
              <Input id="zip" {...register("zip")} />
              {formState.errors.zip && (
                <p className="text-sm text-red-500">
                  {formState.errors.zip.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register("address")} />
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

          <DialogFooter>
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
