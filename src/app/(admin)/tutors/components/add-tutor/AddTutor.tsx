"use client";

import { YEARS_EXPERIENCE_OPTIONS } from "@/app/(admin)/tutors/constants";
import MultiSelect from "@/components/form/MultiSelect";
import MultiFileUploader from "@/components/MultiFileUploader";
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
  useFetchGradesQuery,
  useLazyFetchGradeByIdQuery,
} from "@/store/api/splits/grades";
import { useCreateTutorMutation } from "@/store/api/splits/tutors";
import { getErrorInApiResult } from "@/utils/api";
import {
  collapseTextSpaces,
  normalizeTextSpaces,
  stripLeadingSpaces,
} from "@/utils/form-normalizers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import {
  Controller,
  FieldValues,
  Path,
  useForm,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import toast from "react-hot-toast";
import {
  classTypeOptions,
  preferredLocationOptions,
  tutoringLevelOptions,
  tutorTypeOptions,
} from "../../constants";
import {
  AddTutorFormValues,
  addTutorSchema,
  initialTutorFormValues,
} from "./schema";

export function AddTutor() {
  const [open, setOpen] = useState(false);
  const [createTutor, { isLoading }] = useCreateTutorMutation();
  const formId = "add-tutor-form";

  const form = useForm<AddTutorFormValues>({
    resolver: zodResolver(addTutorSchema),
    defaultValues: initialTutorFormValues,
    mode: "onChange",
  });

  const { formState, reset, setValue, watch, control } = form;

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

  const { data: gradesData } = useFetchGradesQuery({ page: 1, limit: 100 });
  const [fetchGradeById] = useLazyFetchGradeByIdQuery();

  const gradeOptions =
    gradesData?.results?.map((g) => ({ value: g.id, text: g.title })) || [];

  const [subjectOptions, setSubjectOptions] = useState<
    { value: string; text: string }[]
  >([]);

  const prevUniqueSubjectsRef = useRef<string | null>(null);
  const selectedGradesJson = JSON.stringify(selectedGrades || []);

  useEffect(() => {
    const grades = JSON.parse(selectedGradesJson || "[]") as string[];

    if (grades.length === 0) {
      if (
        subjectOptions.length > 0 ||
        (selectedSubjects && selectedSubjects.length > 0)
      ) {
        setSubjectOptions([]);

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

      for (const gradeId of grades) {
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

      if (prevUniqueSubjectsRef.current !== uniqueJson) {
        setSubjectOptions(
          uniqueSubjects.map((s) => ({ value: s.id, text: s.title })),
        );
        prevUniqueSubjectsRef.current = uniqueJson;
      }

      const validSelected = (selectedSubjects || []).filter((sId) =>
        uniqueSubjects.some((us) => us.id === sId),
      );

      if (validSelected.length !== (selectedSubjects || []).length) {
        setValue("subjects", validSelected, { shouldValidate: true });
      }
    };

    loadSubjects();

    return () => {
      cancelled = true;
    };
  }, [
    fetchGradeById,
    selectedGradesJson,
    selectedSubjects,
    setValue,
    subjectOptions.length,
  ]);

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
  }, [dob, setValue]);

  const handleYearsSelect = (val: string) => {
    const parsed = val === "10+" ? 10 : parseInt(val || "0", 10);

    setValue("yearsExperience", parsed, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (data: AddTutorFormValues) => {
    const cleanedData = {
      ...data,
      fullName: normalizeTextSpaces(data.fullName) as string,
      academicDetails: normalizeTextSpaces(data.academicDetails || "") as string,
      teachingSummary: normalizeTextSpaces(data.teachingSummary) as string,
      studentResults: normalizeTextSpaces(data.studentResults) as string,
      sellingPoints: normalizeTextSpaces(data.sellingPoints) as string,
    };

    const result = await createTutor(cleanedData);

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

  const fullNameRegister = form.register("fullName", {
    onChange: (event) => {
      const cleaned = stripLeadingSpaces(event.target.value);

      if (cleaned !== event.target.value) {
        event.target.value = cleaned;
        setValue("fullName", cleaned, { shouldValidate: formState.isSubmitted });
      }
    },
    onBlur: (event) => {
      setValue("fullName", collapseTextSpaces(event.target.value), {
        shouldValidate: true,
      });
    },
  });

  const emailRegister = form.register("email", {
    onChange: (event) => {
      const cleaned = stripLeadingSpaces(event.target.value);

      if (cleaned !== event.target.value) {
        event.target.value = cleaned;
        setValue("email", cleaned, { shouldValidate: formState.isSubmitted });
      }
    },
    onBlur: (event) => {
      setValue("email", event.target.value.trim(), {
        shouldValidate: true,
      });
    },
  });

  const academicDetailsRegister = form.register("academicDetails", {
    onBlur: (event) => {
      setValue("academicDetails", collapseTextSpaces(event.target.value), {
        shouldValidate: true,
      });
    },
  });

  const teachingSummaryRegister = form.register("teachingSummary", {
    onBlur: (event) => {
      setValue("teachingSummary", collapseTextSpaces(event.target.value), {
        shouldValidate: true,
      });
    },
  });

  const studentResultsRegister = form.register("studentResults", {
    onBlur: (event) => {
      setValue("studentResults", collapseTextSpaces(event.target.value), {
        shouldValidate: true,
      });
    },
  });

  const sellingPointsRegister = form.register("sellingPoints", {
    onBlur: (event) => {
      setValue("sellingPoints", collapseTextSpaces(event.target.value), {
        shouldValidate: true,
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-blue-700 text-white hover:bg-blue-500"
          >
            Add Tutor
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[700px] bg-white dark:bg-gray-800 dark:text-white/90 p-0 overflow-hidden [&>div:last-child]:flex [&>div:last-child]:min-h-0 [&>div:last-child]:flex-col [&>div:last-child]:overflow-hidden [&>div:last-child]:p-0">
          <DialogHeader className="shrink-0 bg-white dark:bg-gray-800 px-6 py-4 border-b">
            <DialogTitle>Add Tutor</DialogTitle>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin px-6 py-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" {...fullNameRegister} />
                {formState.errors.fullName && (
                  <p className="text-sm text-red-500">
                    {formState.errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
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

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" {...emailRegister} />
                {formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                <div className="space-y-2">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <SelectField
                  label="Gender *"
                  id="gender"
                  value={watch("gender")}
                  error={formState.errors.gender?.message}
                  onChange={(val) =>
                    setValue("gender", val as AddTutorFormValues["gender"])
                  }
                  options={["Male", "Female", "Other"]}
                />

                <SelectField
                  label="Nationality *"
                  id="nationality"
                  value={watch("nationality")}
                  error={formState.errors.nationality?.message}
                  onChange={(val) =>
                    setValue(
                      "nationality",
                      val as AddTutorFormValues["nationality"],
                    )
                  }
                  options={["Sri Lankan", "Others"]}
                />

                <SelectField
                  label="Race *"
                  id="race"
                  value={watch("race")}
                  error={formState.errors.race?.message}
                  onChange={(val) =>
                    setValue("race", val as AddTutorFormValues["race"])
                  }
                  options={["Sinhalese", "Tamil", "Muslim", "Burgher", "Others"]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <MultiSelect
                    label="Tutor Type *"
                    options={tutorTypeOptions}
                    defaultSelected={watch("tutorType")}
                    onChange={(selected) =>
                      setValue(
                        "tutorType",
                        selected as AddTutorFormValues["tutorType"],
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

                <div className="space-y-2">
                  <MultiSelect
                    label="Class Type *"
                    options={classTypeOptions}
                    defaultSelected={watch("classType")}
                    onChange={(selected) =>
                      setValue(
                        "classType",
                        selected as AddTutorFormValues["classType"],
                        { shouldValidate: true },
                      )
                    }
                  />
                  {formState.errors.classType && (
                    <p className="text-sm text-red-500">
                      {formState.errors.classType.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <MultiSelect
                  label="Tutor Mediums *"
                  options={["English", "Sinhala", "Tamil"].map((m) => ({
                    value: m,
                    text: m,
                  }))}
                  defaultSelected={watch("tutorMediums")}
                  onChange={(selected) =>
                    setValue(
                      "tutorMediums",
                      selected as AddTutorFormValues["tutorMediums"],
                      { shouldValidate: true },
                    )
                  }
                />
                {formState.errors.tutorMediums && (
                  <p className="text-sm text-red-500">
                    {formState.errors.tutorMediums.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <MultiSelect
                  label="Grades *"
                  options={gradeOptions}
                  defaultSelected={watch("grades")}
                  onChange={(selected) =>
                    setValue(
                      "grades",
                      selected as AddTutorFormValues["grades"],
                      { shouldValidate: true },
                    )
                  }
                />
                {formState.errors.grades && (
                  <p className="text-sm text-red-500">
                    {formState.errors.grades.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <MultiSelect
                  label="Subjects *"
                  options={subjectOptions}
                  defaultSelected={watch("subjects")}
                  onChange={(selected) =>
                    setValue(
                      "subjects",
                      selected as AddTutorFormValues["subjects"],
                      { shouldValidate: true },
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

              <div className="space-y-2">
                <MultiSelect
                  label="Tutoring Levels"
                  options={tutoringLevelOptions}
                  defaultSelected={watch("tutoringLevels")}
                  onChange={(selected) =>
                    setValue(
                      "tutoringLevels",
                      selected as AddTutorFormValues["tutoringLevels"],
                      { shouldValidate: true },
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <MultiSelect
                  label="Preferred Locations"
                  options={preferredLocationOptions}
                  defaultSelected={watch("preferredLocations")}
                  onChange={(selected) =>
                    setValue(
                      "preferredLocations",
                      selected as AddTutorFormValues["preferredLocations"],
                      { shouldValidate: true },
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="yearsExperience">Years of Experience *</Label>
                  <Select
                    onValueChange={handleYearsSelect}
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

                <SelectField
                  label="Highest Education *"
                  id="highestEducation"
                  value={watch("highestEducation")}
                  error={formState.errors.highestEducation?.message}
                  onChange={(val) =>
                    setValue(
                      "highestEducation",
                      val as AddTutorFormValues["highestEducation"],
                    )
                  }
                  options={[
                    "PhD",
                    "Masters Degree",
                    "Undergraduate",
                    "Bachelor Degree",
                    "Diploma and Professional",
                    "Advanced Level (A/L)",
                  ]}
                />
              </div>

              <TextareaField
                label="Academic Details *"
                id="academicDetails"
                register={academicDetailsRegister}
                error={formState.errors.academicDetails?.message}
              />

              <TextareaField
                label="Teaching Summary *"
                id="teachingSummary"
                register={teachingSummaryRegister}
                error={formState.errors.teachingSummary?.message}
              />

              <TextareaField
                label="Student Results *"
                id="studentResults"
                register={studentResultsRegister}
                error={formState.errors.studentResults?.message}
              />

              <TextareaField
                label="Selling Points *"
                id="sellingPoints"
                register={sellingPointsRegister}
                error={formState.errors.sellingPoints?.message}
              />

              <div className="space-y-3 rounded-md border p-4">
                <Label>Certificates & Qualifications</Label>
                <MultiFileUploader
                  mode="certificate"
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

              <div className="space-y-3 pt-2">
                <CheckboxField<AddTutorFormValues>
                  label="I agree to Terms & Conditions *"
                  id="agreeTerms"
                  form={form}
                />

                <CheckboxField<AddTutorFormValues>
                  label="I agree to receive assignment info *"
                  id="agreeAssignmentInfo"
                  form={form}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="shrink-0 bg-white dark:bg-gray-800 px-6 py-4 border-t">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button
              form={formId}
              type="submit"
              className="bg-blue-700 text-white hover:bg-blue-500"
              isLoading={isLoading}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

function SelectField({
  label,
  id,
  value,
  error,
  onChange,
  options,
}: {
  label: string;
  id: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger id={id}>
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

function TextareaField({
  label,
  id,
  register,
  error,
}: {
  label: string;
  id: string;
  register: ReturnType<UseFormReturn<AddTutorFormValues>["register"]>;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} placeholder={label.replace(" *", "")} {...register} />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
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
    <div className="space-y-1">
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
