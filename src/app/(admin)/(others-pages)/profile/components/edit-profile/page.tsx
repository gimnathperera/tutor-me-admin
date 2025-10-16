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
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { updateUserSchema, UpdateUserSchema } from "./schema";
import { Pencil } from "lucide-react";
import DatePicker from "@/components/ui/DatePicker";

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
    mode: "onChange",
  });

  const genderValue = watch("gender") || "not specified";
  const avatarUrl = watch("avatar");

  const [imageSrc, setImageSrc] = useState<string>(
    user?.avatar || "/images/user/user.png",
  );
  const [hasImageError, setHasImageError] = useState(false);

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

      setImageSrc(user.avatar || "/images/user/user.png");
      setHasImageError(false);
    }
  }, [user, isModalOpen, reset]);

  useEffect(() => {
    if (avatarUrl) {
      setImageSrc(avatarUrl);
      setHasImageError(false);
    }
  }, [avatarUrl]);

  const [initialValues, setInitialValues] = useState<UpdateUserSchema | null>(
    null,
  );

  useEffect(() => {
    if (user && isModalOpen) {
      const formattedBirthday = user.birthday
        ? new Date(user.birthday).toISOString().split("T")[0]
        : "";

      const defaultValues: UpdateUserSchema = {
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
      };

      reset(defaultValues);
      setInitialValues(defaultValues);

      setImageSrc(user.avatar || "/images/user/user.png");
      setHasImageError(false);
    }
  }, [user, isModalOpen, reset]);

  const watchedValues = watch();
  const isFormChanged = initialValues
    ? Object.keys(initialValues).some(
        (key) => (watchedValues as any)[key] !== (initialValues as any)[key],
      )
    : false;

  const onSubmit = async (data: UpdateUserSchema) => {
    if (!user) return;

    const payload = {
      ...data,
    };

    try {
      await updateUser({ id: user.id, ...payload }).unwrap();
      toast.success("Profile updated successfully");
      setIsModalOpen(false);
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };

  if (isLoading) return <p>Loading user data...</p>;
  if (!user) return <p>No user data found</p>;

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
      >
        <Pencil />
        Edit Profile
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-2xl"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-6 max-h-[85vh] px-2"
        >
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-semibold">Edit Profile</h2>
            <p className="text-sm text-gray-600 italic">* Required</p>
          </div>
          <div className="max-h-[75vh] overflow-y-auto scrollbar-thin space-y-4 px-4 ">
            <Label className="text-md font-semibold">
              Personal Information
            </Label>
            {/* Name */}
            <div className="grid gap-3">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="grid gap-3">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...register("email")} />
              <div className="mt-1">
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Avatar */}
            <div className="grid gap-3">
              <Label htmlFor="avatar">Profile Image URL *</Label>
              <Input
                id="avatar"
                placeholder="https://example.com/avatar.jpg"
                {...register("avatar")}
                className={hasImageError ? "border-red-500" : ""}
              />
              <div className="mt-1">
                {errors.avatar && (
                  <p className="text-sm text-red-500">
                    {errors.avatar.message}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2">
                <img
                  src={imageSrc}
                  alt="avatar preview"
                  className="w-30 h-30 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                  onError={() => {
                    setImageSrc("/images/user/user.png");
                    setHasImageError(true);
                  }}
                />
                {hasImageError && (
                  <p className="text-sm text-red-500">
                    Failed to load image. Showing default avatar.
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gender */}
              <div className="flex flex-col">
                <Label htmlFor="gender" className="mb-3">
                  Gender *
                </Label>
                <Select
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                  value={genderValue}
                  onChange={(value) =>
                    setValue("gender", value as "male" | "female" | "other", {
                      shouldValidate: true,
                    })
                  }
                />
                <div className="mt-1">
                  {errors.gender && (
                    <p className="text-sm text-red-500">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col">
                <Label htmlFor="phoneNumber" className="mb-3">
                  Phone Number *
                </Label>
                <Input id="phoneNumber" {...register("phoneNumber")} />
                <div className="mt-1">
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-500">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Birthday */}
              <div className="flex flex-col">
                <Label htmlFor="birthday" className="mb-3">
                  Birthday *
                </Label>
                <DatePicker
                  value={watch("birthday")}
                  onChange={(date) =>
                    setValue("birthday", date, {
                      shouldValidate: true,
                    })
                  }
                  error={errors.birthday?.message}
                  placeholder="DD/MM/YYYY"
                  label=""
                  required
                />
                <div className="mt-1">
                  {errors.birthday && (
                    <p className="text-sm text-red-500">
                      {errors.birthday.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Label className="text-md font-semibold">
              Location Information
            </Label>
            {/* Address */}
            <div className="grid gap-3">
              <Label htmlFor="address">Address *</Label>
              <Input id="address" {...register("address")} />
              <div className="mt-1">
                {errors.address && (
                  <p className="text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City */}
              <div className="flex flex-col">
                <Label htmlFor="city" className="mb-3">
                  City *
                </Label>
                <Input id="city" {...register("city")} />
                <div className="mt-1">
                  {errors.city && (
                    <p className="text-sm text-red-500">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Country */}
              <div className="flex flex-col">
                <Label htmlFor="country" className="mb-3">
                  Country *
                </Label>
                <Input id="country" {...register("country")} />
                <div className="mt-1">
                  {errors.country && (
                    <p className="text-sm text-red-500">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Zip */}
              <div className="flex flex-col">
                <Label htmlFor="zip" className="mb-3">
                  Zip / Postal Code *
                </Label>
                <Input id="zip" {...register("zip")} />
                <div className="mt-1">
                  {errors.zip && (
                    <p className="text-sm text-red-500">{errors.zip.message}</p>
                  )}
                </div>
              </div>

              {/* State */}
              <div className="flex flex-col">
                <Label htmlFor="state" className="mb-3">
                  State
                </Label>
                <Input id="state" {...register("state")} />
                <div className="mt-1">
                  {errors.state && (
                    <p className="text-sm text-red-500">
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Region */}
              <div className="flex flex-col md:col-span-2">
                <Label htmlFor="region" className="mb-3">
                  Region
                </Label>
                <Input id="region" {...register("region")} />
                <div className="mt-1">
                  {errors.region && (
                    <p className="text-sm text-red-500">
                      {errors.region.message}
                    </p>
                  )}
                </div>
              </div>
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
              <Button
                type="submit"
                isLoading={isUpdating}
                disabled={!isFormChanged}
                className="bg-blue-700 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
