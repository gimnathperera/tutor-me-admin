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
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { updateUserSchema, UpdateUserSchema } from "./schema";

interface UpdateUserProps {
  id: string;
  email: string;
  password?: string;
  name: string;
  phoneNumber?: string;
  birthday?: string;
  status: "active" | "inactive";
  country?: string;
  city?: string;
  zip?: string;
  address?: string;
  role?: "admin" | "user" | "tutor";
  state?: string;
  region?: string;
  tutorType?: "full-time" | "part-time" | "gov";
  gender?: "male" | "female" | "other";
  duration?: string;
  frequency?: string;
  timezone?: string;
  language?: string;
  avatar?: string;
}

export function UpdateUser(props: UpdateUserProps) {
  const [open, setOpen] = useState(false);

  const updateUserForm = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: props, // preload from props
    mode: "onChange",
  });

  const { control, register, handleSubmit, reset } = updateUserForm;
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  useEffect(() => {
    if (open) {
      reset(props); // reset form with fresh props when dialog opens
    }
  }, [open, props, reset]);

  const onSubmit = async (data: UpdateUserSchema) => {
    try {
      const result = await updateUser({ id: props.id, ...data });
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
      <DialogTrigger asChild>
        <SquarePen className="cursor-pointer" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] bg-white z-[9999] dark:bg-gray-800 dark:text-white/90 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Edit the user details.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Name */}
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
            </div>

            {/* Email */}
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" {...register("email")} />
            </div>

            {/* Password */}
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" {...register("password")} />
            </div>

            {/* Role */}
            <div className="grid gap-3">
              <Label htmlFor="role">Role</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="tutor">Tutor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Status */}
            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Phone Number */}
            <div className="grid gap-3">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" {...register("phoneNumber")} />
            </div>

            {/* Birthday */}
            <div className="grid gap-3">
              <Label htmlFor="birthday">Birthday</Label>
              <Input type="date" id="birthday" {...register("birthday")} />
            </div>

            {/* Address fields */}
            <div className="grid gap-3">
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("country")} />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state")} />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="region">Region</Label>
              <Input id="region" {...register("region")} />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="zip">Zip</Label>
              <Input id="zip" {...register("zip")} />
            </div>

            <div className="grid gap-3 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register("address")} />
            </div>

            {/* Tutor Type */}
            <div className="grid gap-3">
              <Label htmlFor="tutorType">Tutor Type</Label>
              <Controller
                control={control}
                name="tutorType"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Tutor Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-Time</SelectItem>
                      <SelectItem value="part-time">Part-Time</SelectItem>
                      <SelectItem value="gov">Gov</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Gender */}
            <div className="grid gap-3">
              <Label htmlFor="gender">Gender</Label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Duration */}
            <div className="grid gap-3">
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" {...register("duration")} />
            </div>

            {/* Frequency */}
            <div className="grid gap-3">
              <Label htmlFor="frequency">Frequency</Label>
              <Input id="frequency" {...register("frequency")} />
            </div>

            {/* Time Zone */}
            <div className="grid gap-3">
              <Label htmlFor="timezone">Time Zone</Label>
              <Input id="timezone" {...register("timezone")} />
            </div>

            {/* Language */}
            <div className="grid gap-3">
              <Label htmlFor="language">Language</Label>
              <Input id="language" {...register("language")} />
            </div>

            {/* Avatar */}
            <div className="grid gap-3 sm:col-span-2">
              <Label htmlFor="avatar">Avatar</Label>
              <Input id="avatar" {...register("avatar")} />
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
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
