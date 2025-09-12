"use client";

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
import { useUpdateUserMutation } from "@/store/api/splits/users";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  initialFormValues,
  updateUserSchema,
  UpdateUserSchema,
} from "./schema";

interface UpdateUserProps {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  birthday?: string;
  status: "active" | "inactive" | "blocked";
  country?: string;
  city?: string;
  zip?: string;
  address?: string;
  state?: string;
  region?: string;
  tutorType?: "full-time" | "part-time" | "gov";
  gender?: "male" | "female" | "other";
  duration?: string;
  frequency?: string;
  language?: string;
  avatar?: string;
}

export function UpdateUser(props: UpdateUserProps) {
  const [open, setOpen] = useState(false);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { ...initialFormValues, ...props },
    mode: "onChange",
  });

  const { formState, register, setValue, handleSubmit, reset } = form;

  useEffect(() => {
    if (open) reset({ ...initialFormValues, ...props });
  }, [open, props, reset]);

  const onSubmit = async (data: UpdateUserSchema) => {
    try {
      const payload = {
        id: props.id,
        email: data.email,
        name: data.name,
        status: data.status || "active",
        phoneNumber: data.phoneNumber || "",
        birthday: props.birthday
          ? new Date(props.birthday).toISOString().split("T")[0]
          : "",
        country: data.country || "",
        city: data.city || "",
        state: data.state || "",
        region: data.region || "",
        zip: data.zip || "",
        address: data.address || "",
        tutorType: data.tutorType || "full-time",
        gender: data.gender || "other",
        duration: data.duration || "",
        frequency: data.frequency || "",
        language: data.language || "",
        avatar: data.avatar || "",
      };

      const result = await updateUser(payload);
      const error = getErrorInApiResult(result);
      if (error) return toast.error(error);

      toast.success("User updated successfully");
      setOpen(false);
    } catch (error) {
      console.error("Unexpected error during user update:", error);
      toast.error("An unexpected error occurred while updating the user.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={handleSubmit(onSubmit as any)}>
        <DialogTrigger asChild>
          <SquarePen className="cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white z-50 dark:bg-gray-800 dark:text-white/90">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Edit the user details.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Name */}
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {formState.errors.name && (
                <p className="text-sm text-red-500">
                  {formState.errors.name.message}
                </p>
              )}
            </div>
            {/* Email */}
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" {...register("email")} />
              {formState.errors.email && (
                <p className="text-sm text-red-500">
                  {formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(val) => setValue("status", val as any)}
                defaultValue={props.status || "active"}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
              {formState.errors.status && (
                <p className="text-sm text-red-500">
                  {formState.errors.status.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="grid gap-3">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" {...register("phoneNumber")} />
              {formState.errors.phoneNumber && (
                <p className="text-sm text-red-500">
                  {formState.errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Birthday */}
            <div className="grid gap-3">
              <Label htmlFor="birthday">Birthday</Label>
              <Input id="birthday" type="date" {...register("birthday")} />

              {formState.errors.birthday && (
                <p className="text-sm text-red-500">
                  {formState.errors.birthday.message}
                </p>
              )}
            </div>

            {/* Country */}
            <div className="grid gap-3">
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("country")} />
              {formState.errors.country && (
                <p className="text-sm text-red-500">
                  {formState.errors.country.message}
                </p>
              )}
            </div>

            {/* City */}
            <div className="grid gap-3">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
              {formState.errors.city && (
                <p className="text-sm text-red-500">
                  {formState.errors.city.message}
                </p>
              )}
            </div>

            {/* State */}
            <div className="grid gap-3">
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state")} />
              {formState.errors.state && (
                <p className="text-sm text-red-500">
                  {formState.errors.state.message}
                </p>
              )}
            </div>

            {/* Region */}
            <div className="grid gap-3">
              <Label htmlFor="region">Region</Label>
              <Input id="region" {...register("region")} />
              {formState.errors.region && (
                <p className="text-sm text-red-500">
                  {formState.errors.region.message}
                </p>
              )}
            </div>

            {/* Zip */}
            <div className="grid gap-3">
              <Label htmlFor="zip">Zip</Label>
              <Input id="zip" {...register("zip")} />
              {formState.errors.zip && (
                <p className="text-sm text-red-500">
                  {formState.errors.zip.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="grid gap-3">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register("address")} />
              {formState.errors.address && (
                <p className="text-sm text-red-500">
                  {formState.errors.address.message}
                </p>
              )}
            </div>

            {/* Tutor Type */}
            <div className="grid gap-3">
              <Label htmlFor="tutorType">Tutor Type</Label>
              <Select
                onValueChange={(val) => setValue("tutorType", val as any)}
                defaultValue={props.tutorType || "full-time"}
              >
                <SelectTrigger id="tutorType">
                  <SelectValue placeholder="Select Tutor Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-Time</SelectItem>
                  <SelectItem value="part-time">Part-Time</SelectItem>
                  <SelectItem value="gov">Gov</SelectItem>
                </SelectContent>
              </Select>
              {formState.errors.tutorType && (
                <p className="text-sm text-red-500">
                  {formState.errors.tutorType.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="grid gap-3">
              <Label htmlFor="gender">Gender</Label>
              <Select
                onValueChange={(val) => setValue("gender", val as any)}
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

            {/* Duration */}
            <div className="grid gap-3">
              <Label htmlFor="duration">Duration</Label>
              <Select
                onValueChange={(val) => setValue("duration", val as any)}
                defaultValue={props.duration || ""}
              >
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30 minutes">30 Minutes</SelectItem>
                  <SelectItem value="1 hour">1 Hour</SelectItem>
                  <SelectItem value="2 hours">2 Hours</SelectItem>
                </SelectContent>
              </Select>
              {formState.errors.duration && (
                <p className="text-sm text-red-500">
                  {formState.errors.duration.message}
                </p>
              )}
            </div>

            {/* Frequency */}
            <div className="grid gap-3">
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                onValueChange={(val) => setValue("frequency", val as any)}
                defaultValue={props.frequency || ""}
              >
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="once a week">Once a Week</SelectItem>
                  <SelectItem value="twice a week">Twice a Week</SelectItem>
                </SelectContent>
              </Select>
              {formState.errors.frequency && (
                <p className="text-sm text-red-500">
                  {formState.errors.frequency.message}
                </p>
              )}
            </div>

            {/* Language */}
            <div className="grid gap-3">
              <Label htmlFor="language">Language</Label>
              <Select
                onValueChange={(val) => setValue("language", val as any)}
                defaultValue={props.language || ""}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sinhala">Sinhala</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>
              {formState.errors.language && (
                <p className="text-sm text-red-500">
                  {formState.errors.language.message}
                </p>
              )}
            </div>

            {/* Avatar */}
            <div className="grid gap-3">
              <Label htmlFor="avatar">Avatar</Label>
              <Input id="avatar" {...register("avatar")} />
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
              onClick={handleSubmit(onSubmit as any)}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
