"use client";

import MultiSelect from "@/components/form/MultiSelect";
import { Button } from "@/components/ui/button/Button";
import DatePicker from "@/components/ui/DatePicker";

import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { useCreateTutorMutation } from "@/store/api/splits/tutors";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  Controller,
  FieldValues,
  Path,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import toast from "react-hot-toast";
import {
  AddTutorFormValues,
  addTutorSchema,
  initialTutorFormValues,
} from "./schema";

export function AddTutor() {
  const [open, setOpen] = useState(false);
  const [createTutor, { isLoading }] = useCreateTutorMutation();

  const form = useForm<AddTutorFormValues>({
    resolver: zodResolver(addTutorSchema),
    defaultValues: initialTutorFormValues,
    mode: "onChange",
  });

  const { formState, reset, setValue, watch, control } = form;

  useEffect(() => {
    if (!open) {
      reset(initialTutorFormValues);
    }
  }, [open, reset]);

  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset(initialTutorFormValues);
    }
  };

  const handleYearsSelect = (val: string) => {
    const parsed = val === "10+" ? 10 : parseInt(val || "0", 10);
    setValue("yearsExperience", parsed, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const preferredLocationOptions = [
    "Admiralty",
    "Ang Mo Kio",
    "Bishan",
    "Boon Lay",
    "Bukit Batok",
    "Bukit Panjang",
    "Choa Chu Kang",
    "Clementi",
    "Jurong East",
    "Jurong West",
    "Kranji",
    "Marsiling",
    "Sembawang",
    "Sengkang",
    "Woodlands",
    "Yew Tee",
    "Yishun",
    "Bedok",
    "Changi",
    "East Coast",
    "Geylang",
    "Hougang",
    "Katong",
    "Marine Parade",
    "Pasir Ris",
    "Punggol",
    "Serangoon",
    "Tampines",
    "Ubi",
    "No Preference",
  ].map((v) => ({ value: v, text: v }));

  const tutoringLevelOptions = [
    "Pre-School",
    "Primary School",
    "Lower Secondary",
    "Upper Secondary",
    "Junior College",
    "IB/IGCSE",
    "Diploma / Degree",
    "Language",
    "Computing",
    "Special Skills",
    "Music",
  ].map((v) => ({ value: v, text: v }));

  const onSubmit = async (data: AddTutorFormValues) => {
    const result = await createTutor({ ...data });

    const error = getErrorInApiResult(result);
    if (error) {
      toast.error(error);
      return;
    }

    if ("data" in result) {
      reset(initialTutorFormValues);
      toast.success("Tutor added successfully");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-blue-700 text-white hover:bg-blue-500"
          >
            Add Tutor
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[700px] bg-white z-50 dark:bg-gray-800 dark:text-white/90 overflow-y-auto scrollbar-thin">
          <DialogHeader>
            <DialogTitle>Add Tutor</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 p-3">
            {/* Personal Info */}
            <div className="grid gap-3">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input id="fullName" {...form.register("fullName")} />
              {formState.errors.fullName && (
                <p className="text-sm text-red-500">
                  {formState.errors.fullName.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="contactNumber">Contact Number *</Label>
              <Controller
                name="contactNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    id="contactNumber"
                    type="tel"
                    placeholder="912345678"
                    maxLength={10}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const digits = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      field.onChange(digits);
                    }}
                  />
                )}
              />
              {formState.errors.contactNumber && (
                <p className="text-sm text-red-500">
                  {formState.errors.contactNumber.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...form.register("email")} />
              {formState.errors.email && (
                <p className="text-sm text-red-500">
                  {formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="z-99">
                <DatePicker
                  label="Date of Birth"
                  required
                  value={watch("dateOfBirth")}
                  onChange={(date) =>
                    setValue("dateOfBirth", date, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  placeholder="Select your date of birth"
                  error={formState.errors.dateOfBirth?.message}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  {...form.register("age", { valueAsNumber: true })}
                  min={1}
                />
                {formState.errors.age && (
                  <p className="text-sm text-red-500">
                    {formState.errors.age.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Gender */}
              <div className="grid gap-3">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  onValueChange={(val) =>
                    setValue("gender", val as AddTutorFormValues["gender"])
                  }
                  value={watch("gender")}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {formState.errors.gender && (
                  <p className="text-sm text-red-500">
                    {formState.errors.gender.message}
                  </p>
                )}
              </div>

              {/* Nationality */}
              <div className="grid gap-3">
                <Label htmlFor="nationality">Nationality *</Label>
                <Select
                  onValueChange={(val) =>
                    setValue(
                      "nationality",
                      val as AddTutorFormValues["nationality"],
                    )
                  }
                  value={watch("nationality")}
                >
                  <SelectTrigger id="nationality">
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Singaporean">Singaporean</SelectItem>
                    <SelectItem value="Singapore PR">Singapore PR</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
                {formState.errors.nationality && (
                  <p className="text-sm text-red-500">
                    {formState.errors.nationality.message}
                  </p>
                )}
              </div>

              {/* Race */}
              <div className="grid gap-3">
                <Label htmlFor="race">Race *</Label>
                <Select
                  onValueChange={(val) =>
                    setValue("race", val as AddTutorFormValues["race"])
                  }
                  value={watch("race")}
                >
                  <SelectTrigger id="race">
                    <SelectValue placeholder="Select race" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chinese">Chinese</SelectItem>
                    <SelectItem value="Malay">Malay</SelectItem>
                    <SelectItem value="Indian">Indian</SelectItem>
                    <SelectItem value="Eurasian">Eurasian</SelectItem>
                    <SelectItem value="Caucasian">Caucasian</SelectItem>
                    <SelectItem value="Punjabi">Punjabi</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
                {formState.errors.race && (
                  <p className="text-sm text-red-500">
                    {formState.errors.race.message}
                  </p>
                )}
              </div>
            </div>

            {/* NRIC & Tutor Type */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-3">
                <Label htmlFor="last4NRIC">Last 4 digits of NRIC *</Label>
                <Input
                  id="last4NRIC"
                  maxLength={4}
                  {...form.register("last4NRIC")}
                />
                {formState.errors.last4NRIC && (
                  <p className="text-sm text-red-500">
                    {formState.errors.last4NRIC.message}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tutorType">Tutor Type *</Label>
                <Select
                  onValueChange={(val) =>
                    setValue(
                      "tutorType",
                      val as AddTutorFormValues["tutorType"],
                    )
                  }
                  value={watch("tutorType")}
                >
                  <SelectTrigger id="tutorType">
                    <SelectValue placeholder="Select tutor type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Time Student">
                      Full Time Student
                    </SelectItem>
                    <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="Part Time Tutor">
                      Part Time Tutor
                    </SelectItem>
                    <SelectItem value="Full Time Tutor">
                      Full Time Tutor
                    </SelectItem>
                    <SelectItem value="Ex/Current MOE Teacher">
                      Ex/Current MOE Teacher
                    </SelectItem>
                    <SelectItem value="Ex-MOE Teacher">
                      Ex-MOE Teacher
                    </SelectItem>
                    <SelectItem value="Current MOE Teacher">
                      Current MOE Teacher
                    </SelectItem>
                  </SelectContent>
                </Select>
                {formState.errors.tutorType && (
                  <p className="text-sm text-red-500">
                    {formState.errors.tutorType.message}
                  </p>
                )}
              </div>
            </div>

            {/* Tutoring Preferences */}
            <div className="z-50">
              <MultiSelect
                label="Tutoring Levels"
                options={tutoringLevelOptions}
                defaultSelected={watch("tutoringLevels")}
                onChange={(selected) =>
                  setValue(
                    "tutoringLevels",
                    selected as AddTutorFormValues["tutoringLevels"],
                    {
                      shouldValidate: true,
                    },
                  )
                }
              />
            </div>

            <MultiSelect
              label="Preferred Locations"
              options={preferredLocationOptions}
              defaultSelected={watch("preferredLocations")}
              onChange={(selected) =>
                setValue(
                  "preferredLocations",
                  selected as AddTutorFormValues["preferredLocations"],
                  {
                    shouldValidate: true,
                  },
                )
              }
            />

            {/* Years & Education */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-3">
                <Label htmlFor="yearsExperience">Years of Experience *</Label>
                <Select
                  onValueChange={(val) => handleYearsSelect(val)}
                  value={String(watch("yearsExperience"))}
                >
                  <SelectTrigger id="yearsExperience">
                    <SelectValue placeholder="Select years" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "0",
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                      "10+",
                    ].map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formState.errors.yearsExperience && (
                  <p className="text-sm text-red-500">
                    {formState.errors.yearsExperience.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="highestEducation">Highest Education *</Label>
                <Select
                  onValueChange={(val) =>
                    setValue(
                      "highestEducation",
                      val as AddTutorFormValues["highestEducation"],
                    )
                  }
                  value={watch("highestEducation")}
                >
                  <SelectTrigger id="highestEducation">
                    <SelectValue placeholder="Select education" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PhD">PhD</SelectItem>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                    <SelectItem value="Masters">Masters</SelectItem>
                    <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="Bachelor Degree">
                      Bachelor Degree
                    </SelectItem>
                    <SelectItem value="Diploma and Professional">
                      Diploma and Professional
                    </SelectItem>
                    <SelectItem value="JC/A Levels">JC/A Levels</SelectItem>
                    <SelectItem value="Poly">Poly</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
                {formState.errors.highestEducation && (
                  <p className="text-sm text-red-500">
                    {formState.errors.highestEducation.message}
                  </p>
                )}
              </div>
            </div>

            {/* Academic Details */}
            <div className="grid gap-3">
              <Label htmlFor="academicDetails">Academic Details</Label>
              <Input
                id="academicDetails"
                {...form.register("academicDetails")}
              />
              {formState.errors.academicDetails && (
                <p className="text-sm text-red-500">
                  {formState.errors.academicDetails.message}
                </p>
              )}
            </div>

            {/* Tutor Profile */}
            <div className="grid gap-3">
              <Label htmlFor="teachingSummary">Teaching Summary *</Label>
              <Input
                id="teachingSummary"
                {...form.register("teachingSummary")}
              />
              {formState.errors.teachingSummary && (
                <p className="text-sm text-red-500">
                  {formState.errors.teachingSummary.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="studentResults">Student Results *</Label>
              <Input id="studentResults" {...form.register("studentResults")} />
              {formState.errors.studentResults && (
                <p className="text-sm text-red-500">
                  {formState.errors.studentResults.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="sellingPoints">Selling Points *</Label>
              <Input id="sellingPoints" {...form.register("sellingPoints")} />
              {formState.errors.sellingPoints && (
                <p className="text-sm text-red-500">
                  {formState.errors.sellingPoints.message}
                </p>
              )}
            </div>

            {/* Agreements */}
            <div className="mt-2">
              <CheckboxField<AddTutorFormValues>
                label="I agree to Terms & Conditions *"
                id="agreeTerms"
                form={form}
              />
            </div>
            <div>
              <CheckboxField<AddTutorFormValues>
                label="I agree to receive assignment info *"
                id="agreeAssignmentInfo"
                form={form}
              />
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
              onClick={form.handleSubmit(onSubmit)}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

// Strongly typed reusable Checkbox
function CheckboxField<T extends FieldValues>({
  label,
  id,
  form,
}: {
  label: string;
  id: Path<T>;
  form: UseFormReturn<T>;
}) {
  const { formState } = form;
  return (
    <div className="grid gap-1">
      <Label className="flex items-center gap-2">
        <input type="checkbox" {...form.register(id)} />
        <span>{label}</span>
      </Label>
      {formState.errors[id] && (
        <p className="text-sm text-red-500">
          {
            (formState.errors as Record<string, { message?: string }>)[id]
              ?.message
          }
        </p>
      )}
    </div>
  );
}
