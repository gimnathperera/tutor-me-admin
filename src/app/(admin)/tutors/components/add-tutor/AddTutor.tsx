"use client";

import { YEARS_EXPERIENCE_OPTIONS } from "@/app/(admin)/tutors/constants";
import MultiSelect from "@/components/form/MultiSelect";
import { Button } from "@/components/ui/button/Button";
import DatePicker from "@/components/ui/DatePicker";

import {
  useFetchGradesQuery,
  useLazyFetchGradeByIdQuery,
} from "@/store/api/splits/grades";
import { useRef } from "react";

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
import { useWatch } from "react-hook-form";

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
  preferredLocationOptions,
  tutoringLevelOptions,
} from "../../constants";
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
  // watch selected grades and current subject selections
  const selectedGrades = useWatch({
    control,
    name: "grades",
    defaultValue: [],
  }) as string[];
  const selectedSubjects = useWatch({
    control,
    name: "subjects",
    defaultValue: [],
  }) as string[];
  const dob = useWatch({
    control,
    name: "dateOfBirth",
    defaultValue: "",
  }) as string;
  // Grades / Subjects state & queries (match client logic)
  const { data: gradesData } = useFetchGradesQuery({ page: 1, limit: 100 });
  const [fetchGradeById] = useLazyFetchGradeByIdQuery();

  // derive grade options for MultiSelect
  const gradeOptions =
    gradesData?.results?.map((g) => ({ value: g.id, text: g.title })) || [];

  const [subjectOptions, setSubjectOptions] = useState<
    { value: string; text: string }[]
  >([]);

  // keep a ref to the previous uniqueSubjects JSON to avoid useless setState
  const prevUniqueSubjectsRef = useRef<string | null>(null);

  useEffect(() => {
    // selectedGrades may be [] or array of ids
    if (!selectedGrades || selectedGrades.length === 0) {
      // only clear if we actually have any subject options or form subjects non-empty
      if (
        subjectOptions.length > 0 ||
        (selectedSubjects && selectedSubjects.length > 0)
      ) {
        setSubjectOptions([]);
        // only clear form subjects if not already empty
        if (selectedSubjects && selectedSubjects.length > 0) {
          setValue("subjects", [], { shouldValidate: true });
        }
      }
      prevUniqueSubjectsRef.current = null;
      return;
    }

    let cancelled = false;

    const loadSubjects = async () => {
      const allSubjects: { id: string; title: string }[] = [];

      for (const gradeId of selectedGrades) {
        const res = await fetchGradeById(gradeId);
        if (res?.data?.subjects) {
          allSubjects.push(...res.data.subjects);
        }
      }

      const uniqueSubjects = Array.from(
        new Map(allSubjects.map((s) => [s.id, s])).values(),
      );

      const uniqueJson = JSON.stringify(
        uniqueSubjects.map((s) => ({ id: s.id, title: s.title })),
      );

      if (cancelled) return;

      // only update subjectOptions if the list actually changed
      if (prevUniqueSubjectsRef.current !== uniqueJson) {
        setSubjectOptions(
          uniqueSubjects.map((s) => ({ value: s.id, text: s.title })),
        );
        prevUniqueSubjectsRef.current = uniqueJson;
      }

      // remove selected subjects that are no longer present
      const validSelected = (selectedSubjects || []).filter((sId: string) =>
        uniqueSubjects.some((us) => us.id === sId),
      );
      // only update form subjects if something changed
      if (validSelected.length !== (selectedSubjects || []).length) {
        setValue("subjects", validSelected, { shouldValidate: true });
      }
    };

    loadSubjects();

    return () => {
      cancelled = true;
    };
  }, [fetchGradeById, JSON.stringify(selectedGrades || []), setValue]);

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

  useEffect(() => {
    if (!dob) return;

    const d = new Date(dob);
    if (isNaN(d.getTime())) return;

    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
      age--;
    }

    if (age < 0) age = 0;

    setValue("age", age, { shouldValidate: true });
  }, [dob]);

  const handleYearsSelect = (val: string) => {
    const parsed = val === "10+" ? 10 : parseInt(val || "0", 10);
    setValue("yearsExperience", parsed, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

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

            <div className="grid z-60 gap-3">
              <MultiSelect
                label="Tutor Mediums *"
                options={[
                  ...["English", "Sinhala", "Tamil"].map((m) => ({
                    value: m,
                    text: m,
                  })),
                ]}
                defaultSelected={watch("tutorMediums")}
                onChange={(selected) =>
                  setValue(
                    "tutorMediums",
                    selected as AddTutorFormValues["tutorMediums"],
                    {
                      shouldValidate: true,
                    },
                  )
                }
              />
              {formState.errors.tutorMediums && (
                <p className="text-sm text-red-500">
                  {formState.errors.tutorMediums.message}
                </p>
              )}
            </div>

            {/* Grades (loaded from API) */}
            <div className="grid z-58 gap-3">
              <MultiSelect
                label="Grades *"
                options={gradeOptions}
                defaultSelected={watch("grades")}
                onChange={(selected) =>
                  setValue("grades", selected as AddTutorFormValues["grades"], {
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

            {/* Subjects (depends on grades) */}
            <div className="grid z-56 gap-3">
              <MultiSelect
                label="Subjects *"
                options={subjectOptions}
                defaultSelected={watch("subjects")}
                onChange={(selected) =>
                  setValue(
                    "subjects",
                    selected as AddTutorFormValues["subjects"],
                    {
                      shouldValidate: true,
                    },
                  )
                }
                disabled={!selectedGrades || selectedGrades.length === 0}
              />
              {formState.errors.subjects && (
                <p className="text-sm text-red-500">
                  {formState.errors.subjects.message}
                </p>
              )}
            </div>

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
