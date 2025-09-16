"use client";

import MultiSelect from "@/components/form/MultiSelect";
import DatePicker from "@/components/ui/DatePicker";
import { Button } from "@/components/ui/button/Button";
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
import { Textarea } from "@/components/ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  api,
  useFetchTutorByIdQuery,
  useUpdateTutorMutation,
} from "@/store/api/splits/tutors";
import { getErrorInApiResult } from "@/utils/api";
import { updateTutorSchema, UpdateTutorSchema } from "./schema";

interface EditTutorProps {
  id: string;
}

export function EditTutor({ id }: EditTutorProps) {
  const [open, setOpen] = useState(false);

  // Fetch tutor data
  const { data, isLoading } = useFetchTutorByIdQuery(id);

  // Mutation hook
  const [updateTutor, { isLoading: isUpdating }] = useUpdateTutorMutation();

  // Form setup
  const form = useForm<UpdateTutorSchema>({
    resolver: zodResolver(updateTutorSchema),
    defaultValues: {
      fullName: "",
      contactNumber: "",
      email: "",
      dateOfBirth: "",
      gender: "Male",
      age: 18,
      nationality: "Singaporean",
      race: "Chinese",
      last4NRIC: "",
      tutoringLevels: [],
      preferredLocations: [],
      tutorType: "Full Time Student",
      yearsExperience: 0,
      highestEducation: "Undergraduate",
      academicDetails: "",
      teachingSummary: "",
      studentResults: "",
      sellingPoints: "",
      agreeTerms: false,
      agreeAssignmentInfo: false,
    },
    mode: "onChange",
  });

  const { register, control, setValue, handleSubmit, reset, watch, formState } =
    form;

  // Populate form when data loads
  useEffect(() => {
    if (data) {
      reset({
        fullName: data.fullName || "",
        contactNumber: data.contactNumber || "",
        email: data.email || "",
        dateOfBirth: data.dateOfBirth || "",
        gender: data.gender || "Male",
        age: data.age || 18,
        nationality: data.nationality || "Singaporean",
        race: data.race || "Chinese",
        last4NRIC: data.last4NRIC || "",
        tutoringLevels: data.tutoringLevels || [],
        preferredLocations: data.preferredLocations || [],
        tutorType: data.tutorType || "Full Time Student",
        yearsExperience: data.yearsExperience || 0,
        highestEducation: data.highestEducation || "Undergraduate",
        academicDetails: data.academicDetails || "",
        teachingSummary: data.teachingSummary || "",
        studentResults: data.studentResults || "",
        sellingPoints: data.sellingPoints || "",
        agreeTerms: data.agreeTerms || false,
        agreeAssignmentInfo: data.agreeAssignmentInfo || false,
      });
    }
  }, [data, reset]);

  // Reset when dialog closes
  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && data) reset(data);
  };

  const onSubmit = async (values: UpdateTutorSchema) => {
    try {
      // Update tutor and unwrap result
      const result = await updateTutor({ id, ...values }).unwrap();

      // Update RTK Query cache
      api.util.updateQueryData("fetchTutorById", id, (draft) => {
        Object.assign(draft, result);
      });

      toast.success("Tutor updated successfully");
      reset(result); // Update form with new values
      setOpen(false);
    } catch (err: any) {
      const error = getErrorInApiResult(err);
      toast.error(error || "Failed to update tutor");
    }
  };

  if (isLoading) return <p>Loading tutor details...</p>;

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <SquarePen className="cursor-pointer text-blue-600 hover:text-blue-800" />
        </DialogTrigger>

        <DialogContent className="sm:max-w-[700px] bg-white z-50 dark:bg-gray-800 dark:text-white/90">
          <DialogHeader>
            <DialogTitle>Edit Tutor</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 p-3 max-h-[75vh] overflow-y-auto">
            {/* Full Name */}
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...register("fullName")} />
              {formState.errors.fullName && (
                <p className="text-sm text-red-500">
                  {formState.errors.fullName.message}
                </p>
              )}
            </div>

            {/* Contact Number */}
            <div className="grid gap-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                type="tel"
                {...register("contactNumber")}
              />
              {formState.errors.contactNumber && (
                <p className="text-sm text-red-500">
                  {formState.errors.contactNumber.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {formState.errors.email && (
                <p className="text-sm text-red-500">
                  {formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <DatePicker
              label="Date of Birth"
              value={watch("dateOfBirth")}
              onChange={(date) =>
                setValue("dateOfBirth", date, { shouldValidate: true })
              }
              error={formState.errors.dateOfBirth?.message}
            />

            {/* Gender */}
            <div className="grid gap-2">
              <Label>Gender</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Age */}
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" {...register("age")} />
            </div>

            {/* Nationality */}
            <div className="grid gap-2">
              <Label>Nationality</Label>
              <Controller
                name="nationality"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Singaporean">Singaporean</SelectItem>
                      <SelectItem value="Singapore PR">Singapore PR</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Race */}
            <div className="grid gap-2">
              <Label>Race</Label>
              <Controller
                name="race"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Race" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Chinese",
                        "Malay",
                        "Indian",
                        "Eurasian",
                        "Caucasian",
                        "Punjabi",
                        "Others",
                      ].map((race) => (
                        <SelectItem key={race} value={race}>
                          {race}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Last 4 NRIC */}
            <div className="grid gap-2">
              <Label htmlFor="last4NRIC">Last 4 digits of NRIC</Label>
              <Input id="last4NRIC" {...register("last4NRIC")} />
            </div>

            {/* Tutor Type */}
            <div className="grid gap-2">
              <Label>Tutor Type</Label>
              <Controller
                name="tutorType"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Tutor Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Full Time Student",
                        "Undergraduate",
                        "Part Time Tutor",
                        "Full Time Tutor",
                        "Ex/Current MOE Teacher",
                        "Ex-MOE Teacher",
                        "Current MOE Teacher",
                      ].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Years Experience */}
            <div className="grid gap-2">
              <Label htmlFor="yearsExperience">Years of Experience</Label>
              <Input
                id="yearsExperience"
                type="number"
                {...register("yearsExperience")}
              />
            </div>

            {/* Highest Education */}
            <div className="grid gap-2">
              <Label>Highest Education</Label>
              <Controller
                name="highestEducation"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Education" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "PhD",
                        "Diploma",
                        "Masters",
                        "Undergraduate",
                        "Bachelor Degree",
                        "Diploma and Professional",
                        "JC/A Levels",
                        "Poly",
                        "Others",
                      ].map((edu) => (
                        <SelectItem key={edu} value={edu}>
                          {edu}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Academic Details */}
            <div className="grid gap-2">
              <Label htmlFor="academicDetails">Academic Details</Label>
              <Textarea id="academicDetails" {...register("academicDetails")} />
            </div>

            {/* Tutoring Levels */}
            <MultiSelect
              label="Tutoring Levels"
              options={[
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
              ].map((v) => ({ value: v, text: v }))}
              defaultSelected={watch("tutoringLevels")}
              onChange={(selected) =>
                setValue("tutoringLevels", selected as string[], {
                  shouldValidate: true,
                })
              }
            />

            {/* Preferred Locations */}
            <MultiSelect
              label="Preferred Locations"
              options={[
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
              ].map((v) => ({ value: v, text: v }))}
              defaultSelected={watch("preferredLocations")}
              onChange={(selected) =>
                setValue("preferredLocations", selected as string[], {
                  shouldValidate: true,
                })
              }
            />

            {/* Teaching Summary */}
            <div className="grid gap-2">
              <Label htmlFor="teachingSummary">Teaching Summary</Label>
              <Textarea id="teachingSummary" {...register("teachingSummary")} />
            </div>

            {/* Student Results */}
            <div className="grid gap-2">
              <Label htmlFor="studentResults">Student Results</Label>
              <Textarea id="studentResults" {...register("studentResults")} />
            </div>

            {/* Selling Points */}
            <div className="grid gap-2">
              <Label htmlFor="sellingPoints">Selling Points</Label>
              <Textarea id="sellingPoints" {...register("sellingPoints")} />
            </div>

            {/* Agreement */}
            <div className="grid gap-2">
              <Label>
                <input type="checkbox" {...register("agreeTerms")} /> Agree to
                Terms
              </Label>
              <Label>
                <input type="checkbox" {...register("agreeAssignmentInfo")} />{" "}
                Agree to Assignment Info
              </Label>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-700 text-white hover:bg-blue-500"
              isLoading={isUpdating}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
