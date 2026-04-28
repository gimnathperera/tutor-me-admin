"use client";

import { YEARS_EXPERIENCE_OPTIONS } from "@/app/(admin)/tutors/constants";
import MultiSelect from "@/components/form/MultiSelect";
import { Button } from "@/components/ui/button/Button";
import DatePicker from "@/components/ui/DatePicker";

import {
  useFetchGradesQuery,
  useFetchSubjectsByGradesMutation,
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
import { Textarea } from "@/components/ui/textarea";
import { useWatch } from "react-hook-form";

import MultiFileUploadDropzone from "@/components/MultiFileUploader";
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
import { Eye, EyeOff } from "lucide-react";
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
  classTypeOptions,
  preferredLocationOptions,
  tutorTypeOptions,
} from "../../constants";
import {
  AddTutorFormValues,
  addTutorSchema,
  initialTutorFormValues,
} from "./schema";

const MAX_DOB = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().split("T")[0];
})();

export function AddTutor() {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [createTutor, { isLoading }] = useCreateTutorMutation();
  const [fetchSubjectsByGrades, { isLoading: isSubjectsLoading }] = useFetchSubjectsByGradesMutation();

  const form = useForm<AddTutorFormValues>({
    resolver: zodResolver(addTutorSchema),
    defaultValues: initialTutorFormValues,
    mode: "onChange",
  });

  const { formState, reset, setValue, watch, control } = form;

  const selectedGrades = useWatch({ control, name: "grades", defaultValue: [] }) as string[];
  const selectedSubjects = useWatch({ control, name: "subjects", defaultValue: [] }) as string[];
  const dob = useWatch({ control, name: "dateOfBirth", defaultValue: "" }) as string;

  const { data: gradesData } = useFetchGradesQuery({ page: 1, limit: 100 });
  const gradeOptions = gradesData?.results?.map((g) => ({ value: g.id, text: g.title })) || [];

  const [subjectOptions, setSubjectOptions] = useState<{ value: string; text: string }[]>([]);
  const prevGradesJsonRef = useRef<string | null>(null);

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
      prevGradesJsonRef.current = null;
      return;
    }

    if (prevGradesJsonRef.current === selectedGradesJson) return;
    prevGradesJsonRef.current = selectedGradesJson;

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
      .catch(() => {
        setSubjectOptions([]);
      });
  }, [selectedGradesJson]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) reset(initialTutorFormValues);
  }, [open, reset]);

  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) reset(initialTutorFormValues);
  };

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

  const handleYearsSelect = (val: string) => {
    const parsed = val === "10+" ? 10 : parseInt(val || "1", 10);
    setValue("yearsExperience", parsed, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (data: AddTutorFormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...payload } = data;
    const result = await createTutor(payload);

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
          <Button variant="outline" className="bg-blue-700 text-white hover:bg-blue-500">
            Add Tutor
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[700px] bg-white z-50 dark:bg-gray-800 dark:text-white/90 overflow-y-auto scrollbar-thin">
          <DialogHeader>
            <DialogTitle>Add Tutor</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 p-3">
            {/* Full Name */}
            <div className="grid gap-3">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input id="fullName" {...form.register("fullName")} />
              {formState.errors.fullName && (
                <p className="text-sm text-red-500">{formState.errors.fullName.message}</p>
              )}
            </div>

            {/* Contact Number */}
            <div className="grid gap-3">
              <Label htmlFor="contactNumber">Contact Number *</Label>
              <Controller
                name="contactNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    id="contactNumber"
                    type="tel"
                    placeholder="0712345678"
                    maxLength={10}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                      field.onChange(digits);
                    }}
                  />
                )}
              />
              {formState.errors.contactNumber && (
                <p className="text-sm text-red-500">{formState.errors.contactNumber.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="grid gap-3">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...form.register("email")} />
              {formState.errors.email && (
                <p className="text-sm text-red-500">{formState.errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-3">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formState.errors.password && (
                <p className="text-sm text-red-500">{formState.errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="grid gap-3">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...form.register("confirmPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">{formState.errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Date of Birth + Age */}
            <div className="grid grid-cols-2 gap-3">
              <div className="z-99">
                <DatePicker
                  label="Date of Birth"
                  required
                  value={watch("dateOfBirth")}
                  maxDate={MAX_DOB}
                  onChange={(date) =>
                    setValue("dateOfBirth", date, { shouldValidate: true, shouldDirty: true })
                  }
                  placeholder="Select date of birth"
                  error={formState.errors.dateOfBirth?.message}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  disabled
                  {...form.register("age", { valueAsNumber: true })}
                />
                {formState.errors.age && (
                  <p className="text-sm text-red-500">{formState.errors.age.message}</p>
                )}
              </div>
            </div>

            {/* Gender / Nationality / Race */}
            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-3">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  onValueChange={(val) => setValue("gender", val as AddTutorFormValues["gender"])}
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
                  <p className="text-sm text-red-500">{formState.errors.gender.message}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="nationality">Nationality *</Label>
                <Select
                  onValueChange={(val) => setValue("nationality", val as AddTutorFormValues["nationality"])}
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
                  <p className="text-sm text-red-500">{formState.errors.nationality.message}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="race">Race *</Label>
                <Select
                  onValueChange={(val) => setValue("race", val as AddTutorFormValues["race"])}
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
                  <p className="text-sm text-red-500">{formState.errors.race.message}</p>
                )}
              </div>
            </div>

            {/* Tutor Type + Class Type */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-3">
                <MultiSelect
                  label="Tutor Type *"
                  options={tutorTypeOptions}
                  defaultSelected={watch("tutorType")}
                  onChange={(selected) =>
                    setValue("tutorType", selected as AddTutorFormValues["tutorType"], { shouldValidate: true })
                  }
                />
                {formState.errors.tutorType && (
                  <p className="text-sm text-red-500">{formState.errors.tutorType.message}</p>
                )}
              </div>
              <div className="grid gap-3">
                <MultiSelect
                  label="Class Type *"
                  options={classTypeOptions}
                  defaultSelected={watch("classType")}
                  onChange={(selected) =>
                    setValue("classType", selected as AddTutorFormValues["classType"], { shouldValidate: true })
                  }
                />
                {formState.errors.classType && (
                  <p className="text-sm text-red-500">{formState.errors.classType.message}</p>
                )}
              </div>
            </div>

            {/* Tutor Mediums */}
            <div className="grid z-60 gap-3">
              <MultiSelect
                label="Tutor Mediums *"
                options={[...["English", "Sinhala", "Tamil"].map((m) => ({ value: m, text: m }))]}
                defaultSelected={watch("tutorMediums")}
                onChange={(selected) =>
                  setValue("tutorMediums", selected as AddTutorFormValues["tutorMediums"], { shouldValidate: true })
                }
              />
              {formState.errors.tutorMediums && (
                <p className="text-sm text-red-500">{formState.errors.tutorMediums.message}</p>
              )}
            </div>

            {/* Grades */}
            <div className="grid z-58 gap-3">
              <MultiSelect
                label="Grades *"
                options={gradeOptions}
                defaultSelected={watch("grades")}
                onChange={(selected) =>
                  setValue("grades", selected as AddTutorFormValues["grades"], { shouldValidate: true })
                }
              />
              {formState.errors.grades && (
                <p className="text-sm text-red-500">{formState.errors.grades.message}</p>
              )}
            </div>

            {/* Subjects */}
            <div className="grid z-56 gap-3">
              <MultiSelect
                label="Subjects *"
                options={subjectOptions}
                defaultSelected={watch("subjects")}
                onChange={(selected) =>
                  setValue("subjects", selected as AddTutorFormValues["subjects"], { shouldValidate: true })
                }
                disabled={!selectedGrades || selectedGrades.length === 0}
                isLoading={isSubjectsLoading}
              />
              {formState.errors.subjects && (
                <p className="text-sm text-red-500">{formState.errors.subjects.message}</p>
              )}
            </div>

            {/* Preferred Locations */}
            <MultiSelect
              label="Preferred Locations *"
              options={preferredLocationOptions}
              defaultSelected={watch("preferredLocations")}
              onChange={(selected) =>
                setValue("preferredLocations", selected as AddTutorFormValues["preferredLocations"], { shouldValidate: true })
              }
            />
            {formState.errors.preferredLocations && (
              <p className="text-sm text-red-500">{formState.errors.preferredLocations.message}</p>
            )}

            {/* Years of Experience + Highest Education */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-3">
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
                      <SelectItem key={String(opt.value)} value={String(opt.value)}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formState.errors.yearsExperience && (
                  <p className="text-sm text-red-500">{formState.errors.yearsExperience.message}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="highestEducation">Highest Education *</Label>
                <Select
                  onValueChange={(val) =>
                    setValue("highestEducation", val as AddTutorFormValues["highestEducation"])
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
                  <p className="text-sm text-red-500">{formState.errors.highestEducation.message}</p>
                )}
              </div>
            </div>

            {/* Academic Details */}
            <div className="grid gap-3">
              <Label htmlFor="academicDetails">Academic Details *</Label>
              <Textarea id="academicDetails" rows={3} {...form.register("academicDetails")} />
              <p className="text-xs text-gray-400 text-right">
                {(watch("academicDetails") ?? "").length} / 500
              </p>
              {formState.errors.academicDetails && (
                <p className="text-sm text-red-500">{formState.errors.academicDetails.message}</p>
              )}
            </div>

            {/* Teaching Summary */}
            <div className="grid gap-3">
              <Label htmlFor="teachingSummary">Teaching Summary *</Label>
              <Textarea id="teachingSummary" rows={3} {...form.register("teachingSummary")} />
              <p className="text-xs text-gray-400 text-right">
                {(watch("teachingSummary") ?? "").length} / 500
              </p>
              {formState.errors.teachingSummary && (
                <p className="text-sm text-red-500">{formState.errors.teachingSummary.message}</p>
              )}
            </div>

            {/* Student Results */}
            <div className="grid gap-3">
              <Label htmlFor="studentResults">Student Results *</Label>
              <Textarea id="studentResults" rows={3} {...form.register("studentResults")} />
              <p className="text-xs text-gray-400 text-right">
                {(watch("studentResults") ?? "").length} / 500
              </p>
              {formState.errors.studentResults && (
                <p className="text-sm text-red-500">{formState.errors.studentResults.message}</p>
              )}
            </div>

            {/* Selling Points */}
            <div className="grid gap-3">
              <Label htmlFor="sellingPoints">Selling Points *</Label>
              <Textarea id="sellingPoints" rows={3} {...form.register("sellingPoints")} />
              <p className="text-xs text-gray-400 text-right">
                {(watch("sellingPoints") ?? "").length} / 500
              </p>
              {formState.errors.sellingPoints && (
                <p className="text-sm text-red-500">{formState.errors.sellingPoints.message}</p>
              )}
            </div>

            {/* Certificates & Qualifications */}
            <div className="grid gap-3 border p-4 rounded-md">
              <Label>Certificates &amp; Qualifications</Label>
              <MultiFileUploadDropzone
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
          {(formState.errors as Record<string, { message?: string }>)[id]?.message}
        </p>
      )}
    </div>
  );
}
