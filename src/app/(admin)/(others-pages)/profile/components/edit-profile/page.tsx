"use client";

import Select from "@/components/form/Select";
import { Button } from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { useAuthContext } from "@/context";
import {
  useFetchUserByIdQuery,
  useUpdateUserMutation,
} from "@/store/api/splits/users";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { updateUserSchema, UpdateUserSchema } from "./schema";

export default function UpdateUser() {
  const { user: authUser } = useAuthContext();
  const { data: user, isLoading } = useFetchUserByIdQuery(authUser?.id!, {
    skip: !authUser?.id,
  });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
  });

  const genderValue = watch("gender") || "not specified";
  const avatarUrl = watch("avatar");

  useEffect(() => {
    if (user && isModalOpen) {
      let formattedBirthday = "";
      if (user.birthday) {
        try {
          const date = new Date(user.birthday);
          if (!isNaN(date.getTime())) {
            formattedBirthday = date.toISOString().split("T")[0];
          }
        } catch (error) {
          console.warn("Invalid birthday format:", user.birthday);
        }
      }
      reset({
        avatar: user.avatar || "",
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        birthday: formattedBirthday,
        country: user.country || "",
        city: user.city || "",
        state: user.state || "",
        region: user.region || "",
        zip: user.zip || "",
        address: user.address || "",
        gender: (user.gender as "male" | "female" | "other") ?? "other",
      });
    }
  }, [user, isModalOpen, reset]);

  const onSubmit = async (data: UpdateUserSchema) => {
    if (!user) return;

    const payload = {
      ...data,
      birthday: data.birthday ? new Date(data.birthday).toISOString() : null,
    };

    try {
      const result = await updateUser({ id: user.id, ...payload });
      const error = getErrorInApiResult(result);
      if (error) return toast.error(error);
      toast.success("Profile updated successfully");
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    }
  };

  const getPreviewImage = () => {
    const currentAvatarUrl = avatarUrl || user?.avatar;
    return currentAvatarUrl || "/images/user/user.png";
  };

  if (isLoading) return <p>Loading user data...</p>;
  if (!user) return <p>No user data found</p>;

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
      >
        Edit Profile
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-2xl"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 p-6 max-h-[85vh]"
        >
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <div className="max-h-[75vh] overflow-y-auto scrollbar-thin space-y-4 px-4">
            {/* Avatar */}
            <div className="grid gap-3">
              <Label htmlFor="avatar">Profile Image URL</Label>
              <Input
                id="avatar"
                placeholder="https://example.com/avatar.jpg"
                {...register("avatar")}
              />
              {errors.avatar && (
                <p className="text-sm text-red-500">{errors.avatar.message}</p>
              )}

              <div className="flex items-center gap-4 mt-2">
                <img
                  src={getPreviewImage()}
                  alt="avatar preview"
                  className="w-30 h-30 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                />
                {/* {avatarUrl && avatarUrl !== user?.avatar && (
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Preview of new avatar
                  </div>
                )} */}
              </div>
            </div>

            {/* Name */}
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Gender */}
            <div className="grid gap-3">
              <Label htmlFor="gender">Gender</Label>
              <Select
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
                value={genderValue}
                onChange={(value) => setValue("gender", value)}
              />
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="grid gap-3">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" {...register("phoneNumber")} />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Birthday */}
            <div className="grid gap-3">
              <Label htmlFor="birthday">Birthday</Label>
              <Input id="birthday" type="date" {...register("birthday")} />
              {errors.birthday && (
                <p className="text-sm text-red-500">
                  {errors.birthday.message}
                </p>
              )}
            </div>

            {/* Country */}
            <div className="grid gap-3">
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("country")} />
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>

            {/* City */}
            <div className="grid gap-3">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>

            {/* State */}
            <div className="grid gap-3">
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state")} />
              {errors.state && (
                <p className="text-sm text-red-500">{errors.state.message}</p>
              )}
            </div>

            {/* Region */}
            <div className="grid gap-3">
              <Label htmlFor="region">Region</Label>
              <Input id="region" {...register("region")} />
              {errors.region && (
                <p className="text-sm text-red-500">{errors.region.message}</p>
              )}
            </div>

            {/* Zip */}
            <div className="grid gap-3">
              <Label htmlFor="zip">Zip</Label>
              <Input id="zip" {...register("zip")} />
              {errors.zip && (
                <p className="text-sm text-red-500">{errors.zip.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="grid gap-3">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register("address")} />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-4 py-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isUpdating}>
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
