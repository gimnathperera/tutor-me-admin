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
  tutorTypeOptions,
  YEARS_EXPERIENCE_OPTIONS,
} from "@/app/(admin)/tutors/constants";
import MultiFileUploader from "@/components/MultiFileUploader";
import {
  useFetchGradesQuery,
  useLazyFetchGradeByIdQuery,
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

const genderOptions = ["Male", "Female"] as const;
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
  "Diploma",
  "Masters",
  "Undergraduate",
  "Bachelor Degree",
  "Diploma and Professional",
  "JC/A Levels",
  "Poly",
  "Others",
] as const;

const tutoringLevelsList = [
  "Pre-School / Montessori",
  "Primary School (Grades 1-5)",
  "Ordinary Level (O/L) (Grades 6-11)",
  "Advanced Level (A/L) (Grades 12-13)",
  "International Syllabus (Cambridge, Edexcel, IB)",
  "Undergraduate",
  "Diploma / Degree",
  "Language (e.g., English, French, Japanese)",
  "Computing (e.g., Programming, Graphic Design)",
  "Music & Arts",
  "Special Skills",
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

export function EditTutor({ id }: EditTutorProps) {
  const [open, setOpen] = useState(false);
  const { data: tutorData, isLoading: isFetching } = useFetchTutorByIdQuery(id);
  const [updateTutor, { isLoading: isUpdating }] = useUpdateTutorMutation();

  // tutorTypeOptions imported from constants

  const { data: gradesData } = useFetchGradesQuery({ page: 1, limit: 100 });
  const [fetchGradeById] = useLazyFetchGradeByIdQuery();
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

      tutoringLevels: [],
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
        try {
          const res = await fetchGradeById(gradeId);
          if (res?.data?.subjects) {
            allSubjects.push(...res.data.subjects);
          }
        } catch (err) {
          console.error(err);
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

      const validSelected = (selectedSubjects || []).filter((sId: string) =>
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
    setValue,
    selectedSubjects,
    subjectOptions.length,
  ]);

  useEffect(() => {
    if (tutorData && open) {
      reset({
        fullName: tutorData.fullName || "",
        contactNumber: tutorData.contactNumber || "",
        email: tutorData.email || "",
        dateOfBirth: formatDateForForm(tutorData.dateOfBirth),
        gender: safeEnumValue(tutorData.gender, genderOptions, "Male"),
        age: tutorData.age || 18,
        tutorMediums: tutorData.tutorMediums || [],
        grades: tutorData.grades || [],
        subjects: tutorData.subjects || [],

        nationality: safeEnumValue(
          tutorData.nationality,
          nationalityOptions,
          "Sri Lankan",
        ),
        race: safeEnumValue(tutorData.race, raceOptions, "Sinhalese"),

        tutoringLevels: safeArrayEnumValue(
          tutorData.tutoringLevels,
          tutoringLevelsList,
        ),
        preferredLocations: safeArrayEnumValue(
          tutorData.preferredLocations,
          locationOptions,
        ),
        tutorType: safeArrayEnumValue(
          tutorData.tutorType,
          tutorTypeOptions.map((o) => o.value),
        ) as UpdateTutorSchema["tutorType"],
        yearsExperience: tutorData.yearsExperience || 0,
        highestEducation: safeEnumValue(
          tutorData.highestEducation,
          educationOptions,
          "Undergraduate",
        ),
        academicDetails: tutorData.academicDetails || "",
        teachingSummary: tutorData.teachingSummary || "",
        studentResults: tutorData.studentResults || "",
        sellingPoints: tutorData.sellingPoints || "",
        agreeTerms:
          typeof tutorData.agreeTerms === "boolean"
            ? tutorData.agreeTerms
            : undefined,
        agreeAssignmentInfo:
          typeof tutorData.agreeAssignmentInfo === "boolean"
            ? tutorData.agreeAssignmentInfo
            : undefined,
        certificatesAndQualifications:
          tutorData.certificatesAndQualifications || [],
      });
    }
  }, [tutorData, open, reset]);

  // Reset form when dialog closes
  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && tutorData) {
      reset({
        fullName: tutorData.fullName || "",
        contactNumber: tutorData.contactNumber || "",
        email: tutorData.email || "",
        dateOfBirth: formatDateForForm(tutorData.dateOfBirth),
        gender: safeEnumValue(tutorData.gender, genderOptions, "Male"),
        age: tutorData.age || 18,
        tutorMediums: tutorData.tutorMediums || [],
        grades: tutorData.grades || [],
        subjects: tutorData.subjects || [],

        nationality: safeEnumValue(
          tutorData.nationality,
          nationalityOptions,
          "Sri Lankan",
        ),
        race: safeEnumValue(tutorData.race, raceOptions, "Sinhalese"),

        tutoringLevels: safeArrayEnumValue(
          tutorData.tutoringLevels,
          tutoringLevelsList,
        ),
        preferredLocations: safeArrayEnumValue(
          tutorData.preferredLocations,
          locationOptions,
        ),
        tutorType: safeArrayEnumValue(
          tutorData.tutorType,
          tutorTypeOptions.map((o) => o.value),
        ) as UpdateTutorSchema["tutorType"],
        yearsExperience: tutorData.yearsExperience || 0,
        highestEducation: safeEnumValue(
          tutorData.highestEducation,
          educationOptions,
          "Undergraduate",
        ),
        academicDetails: tutorData.academicDetails || "",
        teachingSummary: tutorData.teachingSummary || "",
        studentResults: tutorData.studentResults || "",
        sellingPoints: tutorData.sellingPoints || "",
        agreeTerms:
          typeof tutorData.agreeTerms === "boolean"
            ? tutorData.agreeTerms
            : undefined,
        agreeAssignmentInfo:
          typeof tutorData.agreeAssignmentInfo === "boolean"
            ? tutorData.agreeAssignmentInfo
            : undefined,
        certificatesAndQualifications:
          tutorData.certificatesAndQualifications || [],
      });
    }
  };

  useEffect(() => {
    if (!open) return;
    if (tutorData?.grades && tutorData.grades.length > 0) {
    }
  }, [open, tutorData]);

  // Helper for mapping years select value -> numeric
  const handleYearsSelect = (val: string) => {
    const parsed = val === "10+" ? 10 : parseInt(val || "0", 10);
    setValue("yearsExperience", parsed, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const preferredLocationOptions = [
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
  ].map((v) => ({ value: v, text: v }));

  const tutoringLevelOptions = [
    "Pre-School / Montessori",
    "Primary School (Grades 1-5)",
    "Ordinary Level (O/L) (Grades 6-11)",
    "Advanced Level (A/L) (Grades 12-13)",
    "International Syllabus (Cambridge, Edexcel, IB)",
    "Undergraduate",
    "Diploma / Degree",
    "Language (e.g., English, French, Japanese)",
    "Computing (e.g., Programming, Graphic Design)",
    "Music & Arts",
    "Special Skills",
  ].map((v) => ({ value: v, text: v }));

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
                  placeholder="Age"
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

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-3">
                <MultiSelect
                  label="Tutor Type *"
                  options={tutorTypeOptions}
                  defaultSelected={watch("tutorType")}
                  onChange={(selected) =>
                    setValue(
                      "tutorType",
                      selected as UpdateTutorSchema["tutorType"],
                      {
                        shouldValidate: true,
                      },
                    )
                  }
                />
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
              />
              {formState.errors.subjects && (
                <p className="text-sm text-red-500">
                  {formState.errors.subjects.message}
                </p>
              )}
            </div>

            <div className="grid gap-3 border p-4 rounded-md">
              <Label>Certificates & Qualifications</Label>
              <MultiFileUploader
                defaultFiles={tutorData?.certificatesAndQualifications || []}
                onUploaded={(urls) =>
                  setValue(
                    "certificatesAndQualifications" as never,
                    urls as never,
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    },
                  )
                }
              />
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
                    selected as UpdateTutorSchema["tutoringLevels"],
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
                  selected as UpdateTutorSchema["preferredLocations"],
                  {
                    shouldValidate: true,
                  },
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
              <Textarea
                id="academicDetails"
                placeholder="Academic Details"
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
              <Label htmlFor="teachingSummary">Teaching Summary</Label>
              <Textarea
                id="teachingSummary"
                placeholder="Teaching Summary"
                {...form.register("teachingSummary")}
              />
              {formState.errors.teachingSummary && (
                <p className="text-sm text-red-500">
                  {formState.errors.teachingSummary.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="studentResults">Student Results</Label>
              <Textarea
                id="studentResults"
                placeholder="Student Results"
                {...form.register("studentResults")}
              />
              {formState.errors.studentResults && (
                <p className="text-sm text-red-500">
                  {formState.errors.studentResults.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="sellingPoints">Selling Points</Label>
              <Textarea
                id="sellingPoints"
                placeholder="Selling Points"
                {...form.register("sellingPoints")}
              />
              {formState.errors.sellingPoints && (
                <p className="text-sm text-red-500">
                  {formState.errors.sellingPoints.message}
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
