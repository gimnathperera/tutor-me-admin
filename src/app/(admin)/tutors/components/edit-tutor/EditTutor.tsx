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
import { Textarea } from "@/components/ui/textarea";
import {
  useFetchTutorByIdQuery,
  useUpdateTutorMutation,
} from "@/store/api/splits/tutors";

import {
  classTypeOptions,
  tutorTypeOptions,
  YEARS_EXPERIENCE_OPTIONS,
} from "@/app/(admin)/tutors/constants";
import MultiFileUploadDropzone from "@/components/MultiFileUploader";
import {
  useFetchGradesQuery,
  useFetchSubjectsByGradesMutation,
} from "@/store/api/splits/grades";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { UpdateTutorSchema, updateTutorSchema } from "./schema";

export type StringLike =
  | string
  | number
  | null
  | undefined
  | { id?: string; title?: string; name?: string };
export type UnknownObject = Record<string, unknown>;

interface EditTutorProps {
  id: string;
}

const genderOptions = ["Male", "Female", "Others"] as const;
const nationalityOptions = ["Sri Lankan", "Others"] as const;
const raceOptions = [
  "Sinhalese",
  "Tamil",
  "Muslim",
  "Burgher",
  "Others",
] as const;

const educationOptions = [
  "PhD",
  "Masters",
  "Bachelor Degree",
  "Undergraduate",
  "Diploma and Professional",
  "AL",
] as const;

const locationOptions = [
  "Kollupitiya (Colombo 3)",
  "Bambalapitiya (Colombo 4)",
  "Havelock Town (Colombo 5)",
  "Wellawatte (Colombo 6)",
  "Cinnamon Gardens (Colombo 7)",
  "Borella (Colombo 8)",
  "Dehiwala",
  "Mount Lavinia",
  "Nugegoda",
  "Rajagiriya",
  "Kotte",
  "Battaramulla",
  "Malabe",
  "Moratuwa",
  "Gampaha",
  "Negombo",
  "Kadawatha",
  "Kiribathgoda",
  "Kelaniya",
  "Wattala",
  "Ja-Ela",
  "Kalutara",
  "Panadura",
  "Horana",
  "Wadduwa",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Kurunegala",
  "Puttalam",
  "Chilaw",
  "Ratnapura",
  "Kegalle",
  "Badulla",
  "Bandarawela",
  "Anuradhapura",
  "Polonnaruwa",
  "Jaffna",
  "Vavuniya",
  "Trincomalee",
  "Batticaloa",
  "No Preference",
] as const;

const tutorTypeValues = [
  "Private Tutor",
  "Government Teacher",
  "University Student",
  "Coach",
] as const;

const classTypeValues = [
  "Online - Individual",
  "Online - Group",
  "Physical - Individual",
  "Physical - Group",
] as const;

export function EditTutor({ id }: EditTutorProps) {
  const [open, setOpen] = useState(false);
  const { data: tutorData, isLoading: isFetching } = useFetchTutorByIdQuery(id);
  const [updateTutor, { isLoading: isUpdating }] = useUpdateTutorMutation();

  const { data: gradesData } = useFetchGradesQuery({ page: 1, limit: 100 });
  const [fetchSubjectsByGrades, { isLoading: isSubjectsLoading }] = useFetchSubjectsByGradesMutation();
  const gradeOptions =
    gradesData?.results?.map((g) => ({ value: g.id, text: g.title })) || [];

  const [subjectOptions, setSubjectOptions] = useState<
    { value: string; text: string }[]
  >([]);
  const prevUniqueSubjectsRef = useRef<string | null>(null);

  const form = useForm<UpdateTutorSchema>({
    resolver: zodResolver(updateTutorSchema),
    defaultValues: {
      fullName: "",
      contactNumber: "",
      email: "",
      dateOfBirth: "",
      gender: "Male",
      age: 18,
      tutorMediums: [],
      grades: [],
      subjects: [],
      nationality: "Sri Lankan",
      race: "Sinhalese",
      status: "pending",
      classType: [],
      preferredLocations: [],
      tutorType: [],
      yearsExperience: 0,
      highestEducation: "Undergraduate",
      academicDetails: "",
      teachingSummary: "",
      studentResults: "",
      sellingPoints: "",
      certificatesAndQualifications: [],
    },
    mode: "onChange",
  });

  const { formState, reset, setValue, watch, control, handleSubmit } = form;

  const selectedGrades = useWatch({
    control,
    name: "grades",
    defaultValue: [] as string[],
  }) as string[];
  const selectedSubjects = useWatch({
    control,
    name: "subjects",
    defaultValue: [] as string[],
  }) as string[];
  const dob = useWatch({ control, name: "dateOfBirth", defaultValue: "" }) as string;

  const safeEnumValue = <T extends string>(
    value: string | undefined,
    enumValues: readonly T[],
    fallback: T,
  ): T => {
    if (!value) return fallback;
    return enumValues.includes(value as T) ? (value as T) : fallback;
  };

  const formatDateForForm = (isoDate: string | undefined): string => {
    if (!isoDate) return "";
    try {
      const date = new Date(isoDate);
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const safeArrayEnumValue = <T extends string>(
    values: string[] | undefined,
    enumValues: readonly T[],
  ): T[] => {
    if (!values) return [];
    return values.filter((value) => enumValues.includes(value as T)) as T[];
  };

  const selectedGradesJson = JSON.stringify(selectedGrades || []);

  useEffect(() => {
    const grades = JSON.parse(selectedGradesJson || "[]") as string[];

    if (grades.length === 0) {
      if (subjectOptions.length > 0 || (selectedSubjects && selectedSubjects.length > 0)) {
        setSubjectOptions([]);
        if (selectedSubjects && selectedSubjects.length > 0) {
          setValue("subjects", [], { shouldValidate: true });
        }
      }
      prevUniqueSubjectsRef.current = null;
      return;
    }

    if (prevUniqueSubjectsRef.current === selectedGradesJson) return;
    prevUniqueSubjectsRef.current = selectedGradesJson;

    fetchSubjectsByGrades({ gradeIds: grades })
      .unwrap()
      .then((res) => {
        const subjects = res.subjects ?? [];
        setSubjectOptions(subjects.map((s) => ({ value: s.id, text: s.title })));
        const validSelected = (selectedSubjects || []).filter((sId) =>
          subjects.some((s) => s.id === sId),
        );
        if (validSelected.length !== (selectedSubjects || []).length) {
          setValue("subjects", validSelected, { shouldValidate: true });
        }
      })
      .catch(() => setSubjectOptions([]));
  }, [selectedGradesJson]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!dob) return;
    const d = new Date(dob);
    if (isNaN(d.getTime())) return;
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
    if (age < 0) age = 0;
    setValue("age", age, { shouldValidate: true });
  }, [dob, setValue]);

  const buildResetValues = (data: typeof tutorData) => {
    if (!data) return {};
    return {
      fullName: data.fullName || "",
      contactNumber: data.contactNumber || "",
      email: data.email || "",
      dateOfBirth: formatDateForForm(data.dateOfBirth),
      gender: safeEnumValue(data.gender, genderOptions, "Male"),
      age: data.age || 18,
      tutorMediums: data.tutorMediums || [],
      grades: data.grades || [],
      subjects: data.subjects || [],
      nationality: safeEnumValue(data.nationality, nationalityOptions, "Sri Lankan"),
      race: safeEnumValue(data.race, raceOptions, "Sinhalese"),
      status: safeEnumValue(
        data.status,
        ["pending", "approved", "rejected", "suspended"] as const,
        "pending",
      ),
      classType: safeArrayEnumValue(data.classType, classTypeValues),
      preferredLocations: safeArrayEnumValue(data.preferredLocations, locationOptions),
      tutorType: safeArrayEnumValue(
        data.tutorType,
        tutorTypeValues,
      ) as UpdateTutorSchema["tutorType"],
      yearsExperience: data.yearsExperience || 1,
      highestEducation: safeEnumValue(data.highestEducation, educationOptions, "Undergraduate"),
      academicDetails: data.academicDetails || "",
      teachingSummary: data.teachingSummary || "",
      studentResults: data.studentResults || "",
      sellingPoints: data.sellingPoints || "",
      agreeTerms:
        typeof data.agreeTerms === "boolean" ? data.agreeTerms : undefined,
      agreeAssignmentInfo:
        typeof data.agreeAssignmentInfo === "boolean"
          ? data.agreeAssignmentInfo
          : undefined,
      certificatesAndQualifications: data.certificatesAndQualifications || [],
    };
  };

  useEffect(() => {
    if (tutorData && open) {
      reset(buildResetValues(tutorData));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorData, open, reset]);

  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && tutorData) {
      reset(buildResetValues(tutorData));
    }
  };

  const handleYearsSelect = (val: string) => {
    const parsed = val === "10+" ? 10 : parseInt(val || "0", 10);
    setValue("yearsExperience", parsed, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const preferredLocationOptions = locationOptions.map((v) => ({
    value: v,
    text: v,
  }));

  const onSubmit = async (data: UpdateTutorSchema) => {
    try {
      const result = await updateTutor({ id, ...data });
      const error = getErrorInApiResult(result);

      if (error) {
        toast.error(error);
        return;
      }

      if ("data" in result) {
        const updatedValues = form.getValues();
        reset(updatedValues);
        toast.success("Tutor updated successfully");
        setOpen(false);
      }
    } catch (error) {
      console.error("Unexpected error during tutor update:", error);
      toast.error("An unexpected error occurred while updating the tutor");
    }
  };

  if (isFetching) {
    return <p>Loading tutor details...</p>;
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <SquarePen className="cursor-pointer text-blue-500 hover:text-blue-700" />
        </DialogTrigger>

        <DialogContent className="sm:max-w-[700px] bg-white z-50 dark:bg-gray-800 dark:text-white/90 max-h-[80vh] overflow-y-auto scrollbar-thin">
          <DialogHeader>
            <DialogTitle>Edit Tutor</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 p-3">
            {/* Status */}
            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(val) =>
                  setValue("status", val as UpdateTutorSchema["status"])
                }
                value={watch("status")}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Personal Info */}
            <div className="grid gap-3">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Full Name"
                {...form.register("fullName")}
              />
              {formState.errors.fullName && (
                <p className="text-sm text-red-500">
                  {formState.errors.fullName.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Controller
                name="contactNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    id="contactNumber"
                    type="tel"
                    placeholder="912345678"
                    maxLength={15}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const digits = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 15);
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                readOnly
                className="bg-gray-50 cursor-not-allowed"
                {...form.register("email")}
              />
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
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  disabled
                  {...form.register("age", { valueAsNumber: true })}
                />
                {formState.errors.age && (
                  <p className="text-sm text-red-500">
                    {formState.errors.age.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-3">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  onValueChange={(val) =>
                    setValue("gender", val as UpdateTutorSchema["gender"])
                  }
                  value={watch("gender")}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
                {formState.errors.gender && (
                  <p className="text-sm text-red-500">
                    {formState.errors.gender.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="nationality">Nationality</Label>
                <Select
                  onValueChange={(val) =>
                    setValue(
                      "nationality",
                      val as UpdateTutorSchema["nationality"],
                    )
                  }
                  value={watch("nationality")}
                >
                  <SelectTrigger id="nationality">
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sri Lankan">Sri Lankan</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
                {formState.errors.nationality && (
                  <p className="text-sm text-red-500">
                    {formState.errors.nationality.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="race">Race</Label>
                <Select
                  onValueChange={(val) =>
                    setValue("race", val as UpdateTutorSchema["race"])
                  }
                  value={watch("race")}
                >
                  <SelectTrigger id="race">
                    <SelectValue placeholder="Select race" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sinhalese">Sinhalese</SelectItem>
                    <SelectItem value="Tamil">Tamil</SelectItem>
                    <SelectItem value="Muslim">Muslim</SelectItem>
                    <SelectItem value="Burgher">Burgher</SelectItem>
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

            <div className="grid grid-cols-2 gap-3 z-62">
              <div className="grid gap-3">
                <MultiSelect
                  label="Tutor Type *"
                  options={tutorTypeOptions}
                  defaultSelected={watch("tutorType")}
                  onChange={(selected) =>
                    setValue(
                      "tutorType",
                      selected as UpdateTutorSchema["tutorType"],
                      { shouldValidate: true },
                    )
                  }
                />
                {formState.errors.tutorType && (
                  <p className="text-sm text-red-500">
                    {formState.errors.tutorType.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <MultiSelect
                  label="Class Type *"
                  options={classTypeOptions}
                  defaultSelected={watch("classType")}
                  onChange={(selected) =>
                    setValue("classType", selected as string[], {
                      shouldValidate: true,
                    })
                  }
                />
                {formState.errors.classType && (
                  <p className="text-sm text-red-500">
                    {formState.errors.classType.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid z-60 gap-3">
              <MultiSelect
                label="Tutor Mediums *"
                options={["English", "Sinhala", "Tamil"].map((m) => ({
                  value: m,
                  text: m,
                }))}
                defaultSelected={watch("tutorMediums")}
                onChange={(selected) =>
                  setValue("tutorMediums", selected as string[], {
                    shouldValidate: true,
                  })
                }
              />
              {formState.errors.tutorMediums && (
                <p className="text-sm text-red-500">
                  {formState.errors.tutorMediums.message}
                </p>
              )}
            </div>

            <div className="grid z-58 gap-3">
              <MultiSelect
                label="Grades *"
                options={gradeOptions}
                defaultSelected={watch("grades")}
                onChange={(selected) =>
                  setValue("grades", selected as string[], {
                    shouldValidate: true,
                  })
                }
              />
              {formState.errors.grades && (
                <p className="text-sm text-red-500">
                  {formState.errors.grades.message}
                </p>
              )}
            </div>

            <div className="grid z-56 gap-3">
              <MultiSelect
                label="Subjects *"
                options={subjectOptions}
                defaultSelected={watch("subjects")}
                onChange={(selected) =>
                  setValue("subjects", selected as string[], {
                    shouldValidate: true,
                  })
                }
                disabled={!selectedGrades || selectedGrades.length === 0}
                isLoading={isSubjectsLoading}
              />
              {formState.errors.subjects && (
                <p className="text-sm text-red-500">
                  {formState.errors.subjects.message}
                </p>
              )}
            </div>

            <div className="grid gap-3 border p-4 rounded-md">
              <Label>Certificates & Qualifications</Label>
              <MultiFileUploadDropzone
                mode="certificate"
                defaultFiles={tutorData?.certificatesAndQualifications || []}
                onUploaded={(items) =>
                  setValue("certificatesAndQualifications", items, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
              {formState.errors.certificatesAndQualifications && (
                <p className="text-sm text-red-500">
                  {formState.errors.certificatesAndQualifications.message}
                </p>
              )}
            </div>

            <MultiSelect
              label="Preferred Locations"
              options={preferredLocationOptions}
              defaultSelected={watch("preferredLocations")}
              onChange={(selected) =>
                setValue(
                  "preferredLocations",
                  selected as UpdateTutorSchema["preferredLocations"],
                  { shouldValidate: true },
                )
              }
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-3">
                <Label htmlFor="yearsExperience">Years of Experience</Label>
                <Select
                  onValueChange={(val) => handleYearsSelect(val)}
                  value={String(watch("yearsExperience"))}
                >
                  <SelectTrigger id="yearsExperience">
                    <SelectValue placeholder="Select years" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS_EXPERIENCE_OPTIONS.map((opt) => (
                      <SelectItem
                        key={String(opt.value)}
                        value={String(opt.value)}
                      >
                        {opt.label}
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
                <Label htmlFor="highestEducation">Highest Education</Label>
                <Select
                  onValueChange={(val) =>
                    setValue(
                      "highestEducation",
                      val as UpdateTutorSchema["highestEducation"],
                    )
                  }
                  value={watch("highestEducation")}
                >
                  <SelectTrigger id="highestEducation">
                    <SelectValue placeholder="Select education" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PhD">PhD</SelectItem>
                    <SelectItem value="Masters">Master&apos;s Degree</SelectItem>
                    <SelectItem value="Bachelor Degree">Bachelor Degree</SelectItem>
                    <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="Diploma and Professional">Diploma and Professional</SelectItem>
                    <SelectItem value="AL">Advanced Level (A/L)</SelectItem>
                  </SelectContent>
                </Select>
                {formState.errors.highestEducation && (
                  <p className="text-sm text-red-500">
                    {formState.errors.highestEducation.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="academicDetails">Academic Details</Label>
              <Textarea id="academicDetails" rows={3} {...form.register("academicDetails")} />
              <p className="text-xs text-gray-400 text-right">
                {(watch("academicDetails") ?? "").length} / 500
              </p>
              {formState.errors.academicDetails && (
                <p className="text-sm text-red-500">{formState.errors.academicDetails.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="teachingSummary">Teaching Summary</Label>
              <Textarea id="teachingSummary" rows={3} {...form.register("teachingSummary")} />
              <p className="text-xs text-gray-400 text-right">
                {(watch("teachingSummary") ?? "").length} / 500
              </p>
              {formState.errors.teachingSummary && (
                <p className="text-sm text-red-500">{formState.errors.teachingSummary.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="studentResults">Student Results</Label>
              <Textarea id="studentResults" rows={3} {...form.register("studentResults")} />
              <p className="text-xs text-gray-400 text-right">
                {(watch("studentResults") ?? "").length} / 500
              </p>
              {formState.errors.studentResults && (
                <p className="text-sm text-red-500">{formState.errors.studentResults.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="sellingPoints">Selling Points</Label>
              <Textarea id="sellingPoints" rows={3} {...form.register("sellingPoints")} />
              <p className="text-xs text-gray-400 text-right">
                {(watch("sellingPoints") ?? "").length} / 500
              </p>
              {formState.errors.sellingPoints && (
                <p className="text-sm text-red-500">{formState.errors.sellingPoints.message}</p>
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
              isLoading={isUpdating}
              onClick={handleSubmit(onSubmit)}
            >
              Update Tutor
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
