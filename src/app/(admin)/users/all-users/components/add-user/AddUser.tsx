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
import { useCreateUserMutation } from "@/store/api/splits/users";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  createUserSchema,
  CreateUserSchema,
  initialFormValues,
} from "./schema";
import TimeZoneSelect from "./timezone";

export default function AddUser() {
  const [open, setOpen] = useState(false);
  const [createUser, { isLoading }] = useCreateUserMutation();

  const createUserForm = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: initialFormValues as CreateUserSchema,
    mode: "onChange",
  });

  const { formState, setValue } = createUserForm;

  const onSubmit = async (data: CreateUserSchema) => {
    try {
      const result = await createUser(data);
      const error = getErrorInApiResult(result);
      if (error) {
        return toast.error(error);
      }
      if ("data" in result) {
        onRegisterSuccess();
      }
    } catch (error) {
      console.error("Unexpected error during user creation:", error);
      toast.error("An unexpected error occurred while creating the user");
    }
  };

  const onRegisterSuccess = () => {
    createUserForm.reset();
    toast.success("User created successfully");
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          createUserForm.reset();
        }
      }}
    >
      <form onSubmit={createUserForm.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-blue-700 text-white hover:bg-blue-500"
          >
            Add User
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px] bg-white z-50 dark:bg-gray-800 dark:text-white/90">
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>
              Add a new user to the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {/* Email */}
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Email"
                {...createUserForm.register("email")}
              />
              {formState.errors.email && (
                <p className="text-sm text-red-500">
                  {formState.errors.email.message}
                </p>
              )}
            </div>
            {/* Password */}
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                {...createUserForm.register("password")}
              />
              {formState.errors.password && (
                <p className="text-sm text-red-500">
                  {formState.errors.password.message}
                </p>
              )}
            </div>
            {/* Name */}
            <div className="grid gap-3">
              <Label htmlFor="email">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Name"
                {...createUserForm.register("name")}
              />
              {formState.errors.name && (
                <p className="text-sm text-red-500">
                  {formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="grid gap-3">
              <Label htmlFor="role">Role</Label>
              <Select
                onValueChange={(val: CreateUserSchema["role"]) =>
                  setValue("role", val)
                }
                defaultValue={initialFormValues.role}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
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
            {/* Phone Number */}
            <div className="grid gap-3">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="text"
                placeholder="ex: 0712345678"
                {...createUserForm.register("phoneNumber")}
              />
              {formState.errors.phoneNumber && (
                <p className="text-sm text-red-500">
                  {formState.errors.phoneNumber.message}
                </p>
              )}
            </div>
            {/* Birthday */}
            <div className="grid gap-3">
              <Label htmlFor="birthday">Birthday</Label>
              <Input
                id="birthday"
                type="date"
                placeholder="Birthday"
                {...createUserForm.register("birthday")}
              />
              {formState.errors.birthday && (
                <p className="text-sm text-red-500">
                  {formState.errors.birthday.message}
                </p>
              )}
            </div>
            {/* Country */}
            <div className="grid gap-3">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                type="text"
                placeholder="Country"
                {...createUserForm.register("country")}
              />
              {formState.errors.country && (
                <p className="text-sm text-red-500">
                  {formState.errors.country.message}
                </p>
              )}
            </div>
            {/* City */}
            <div className="grid gap-3">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                type="text"
                placeholder="City"
                {...createUserForm.register("city")}
              />
              {formState.errors.city && (
                <p className="text-sm text-red-500">
                  {formState.errors.city.message}
                </p>
              )}
            </div>
            {/* State */}
            <div className="grid gap-3">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                type="text"
                placeholder="State"
                {...createUserForm.register("state")}
              />
              {formState.errors.state && (
                <p className="text-sm text-red-500">
                  {formState.errors.state.message}
                </p>
              )}
            </div>
            {/* region */}
            <div className="grid gap-3">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                type="text"
                placeholder="Region"
                {...createUserForm.register("region")}
              />
              {formState.errors.region && (
                <p className="text-sm text-red-500">
                  {formState.errors.region.message}
                </p>
              )}
            </div>
            {/* zip */}
            <div className="grid gap-3">
              <Label htmlFor="zip">Zip</Label>
              <Input
                id="zip"
                type="text"
                placeholder="Zip"
                {...createUserForm.register("zip")}
              />
              {formState.errors.zip && (
                <p className="text-sm text-red-500">
                  {formState.errors.zip.message}
                </p>
              )}
            </div>
            {/* Address */}
            <div className="grid gap-3">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="Address"
                {...createUserForm.register("address")}
              />
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
                onValueChange={(val) =>
                  setValue("tutorType", val as CreateUserSchema["tutorType"])
                }
                defaultValue={initialFormValues.tutorType}
              >
                <SelectTrigger id="tutorType">
                  <SelectValue placeholder="Select tutorType" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="part-time">PART_TIME</SelectItem>
                  <SelectItem value="full-time">FULL_TIME</SelectItem>
                  <SelectItem value="gov">GOV</SelectItem>
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
                onValueChange={(val) =>
                  setValue("gender", val as CreateUserSchema["gender"])
                }
                defaultValue={initialFormValues.gender}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
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
                onValueChange={(val) =>
                  setValue("duration", val as CreateUserSchema["duration"])
                }
                defaultValue={initialFormValues.duration}
              >
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30 minutes">Thirty Minutes</SelectItem>
                  <SelectItem value="1 hour">One Hour</SelectItem>
                  <SelectItem value="2 hours">Two Hours</SelectItem>
                </SelectContent>
              </Select>
              {formState.errors.duration && (
                <p className="text-sm text-red-500">
                  {formState.errors.duration.message}
                </p>
              )}
            </div>
            {/* frequency */}
            <div className="grid gap-3">
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                onValueChange={(val) =>
                  setValue("frequency", val as CreateUserSchema["frequency"])
                }
                defaultValue={initialFormValues.frequency}
              >
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select frequency" />
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
            {/* Time Zone */}
            <div className="grid gap-3">
              <Label htmlFor="timeZone">Time Zone</Label>
              <TimeZoneSelect
                setValue={setValue}
                defaultValue={initialFormValues.timeZone}
              />

              {formState.errors.timeZone && (
                <p className="text-sm text-red-500">
                  {formState.errors.timeZone.message}
                </p>
              )}
            </div>
            {/* Language */}
            <div className="grid gap-3">
              <Label htmlFor="language">Language</Label>
              <Select
                onValueChange={(val) =>
                  setValue("language", val as CreateUserSchema["language"])
                }
                defaultValue={initialFormValues.language}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Sinhala</SelectItem>
                  <SelectItem value="once a week">English</SelectItem>
                </SelectContent>
              </Select>
              {formState.errors.language && (
                <p className="text-sm text-red-500">
                  {formState.errors.language.message}
                </p>
              )}
            </div>
            {/* Status */}
            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(val) =>
                  setValue("status", val as CreateUserSchema["status"])
                }
                defaultValue={initialFormValues.status}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
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
            {/* Avatar */}
            <div className="grid gap-3">
              <Label htmlFor="avatar">Avatar</Label>
              <FileUploadDropzone
                onUploaded={(url) => setValue("avatar", url)}
              />

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
              onClick={createUserForm.handleSubmit(onSubmit)}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
