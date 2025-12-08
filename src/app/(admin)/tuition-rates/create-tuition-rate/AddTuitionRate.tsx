"use client";

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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useFetchGradeByIdQuery,
  useFetchGradesQuery,
} from "@/store/api/splits/grades";

import {
  useCreateTuitionRateMutation,
  useFetchTuitionRatesQuery,
} from "@/store/api/splits/tuition-rates";

import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  CreateTuitionSchema,
  createTuitionSchema,
  initialFormValues,
} from "./schema";

export function AddTuitionRate() {
  const [open, setOpen] = useState(false);

  const createTuitionRateForm = useForm<CreateTuitionSchema>({
    resolver: zodResolver(createTuitionSchema),
    defaultValues: initialFormValues,
    mode: "onChange",
  });

  const { data: tuitionRates } = useFetchTuitionRatesQuery({});

  const [createRate, { isLoading }] = useCreateTuitionRateMutation();

  const { data: gradeData, isLoading: isGradesLoading } = useFetchGradesQuery(
    {},
  );

  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);

  const { data: gradeDetails, isLoading: isGradeDetailsLoading } =
    useFetchGradeByIdQuery(selectedGradeId!, { skip: !selectedGradeId });

  const onSubmit = async (data: CreateTuitionSchema) => {
    const gradeId = String(data.grade);
    const subjectId = String(data.subject);

    const existingRates = tuitionRates?.results ?? [];
    const isDuplicate = existingRates.some(
      (rate) =>
        String(rate.grade?.id) === gradeId &&
        String(rate.subject?.id) === subjectId,
    );

    if (isDuplicate) {
      return toast.error(
        "A tuition rate for this grade and subject already exists.",
      );
    }

    const result = await createRate(data);
    const error = getErrorInApiResult(result);

    if (error) return toast.error(error);

    if ("data" in result) {
      createTuitionRateForm.reset();
      toast.success("Tuition Rate created successfully");
      setOpen(false);
    }
  };

  const { formState, watch, setValue } = createTuitionRateForm;
  const selectedGrade = watch("grade");

  useEffect(() => {
    setValue("subject", "");
    setSelectedGradeId(selectedGrade || null);
  }, [selectedGrade, setValue]);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          createTuitionRateForm.reset();
        }
      }}
    >
      <form onSubmit={createTuitionRateForm.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-blue-700 text-white hover:bg-blue-500"
          >
            Add Tuition Rate
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[500px] bg-white z-[9999] dark:bg-gray-800 dark:text-white/90">
          <DialogHeader>
            <DialogTitle>Add Tuition Rate</DialogTitle>
            <DialogDescription>
              Add a new tuition rate to the list.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="grade">Grade</Label>
              <Select
                onValueChange={(value) =>
                  createTuitionRateForm.setValue("grade", value)
                }
                value={createTuitionRateForm.watch("grade")}
                disabled={isGradesLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a grade" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectGroup>
                    <SelectLabel>Grades</SelectLabel>
                    {gradeData?.results?.map((grade) => (
                      <SelectItem key={grade.id} value={grade.id}>
                        {grade.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {formState.errors.grade && (
                <p className="text-sm text-red-500">
                  {formState.errors.grade.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="subject">Subject</Label>
              <Select
                onValueChange={(value) => setValue("subject", value)}
                value={watch("subject")}
                disabled={!selectedGradeId || isGradeDetailsLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectGroup>
                    <SelectLabel>Subjects</SelectLabel>
                    {gradeDetails?.subjects?.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {formState.errors.subject && (
                <p className="text-sm text-red-500">
                  {formState.errors.subject.message}
                </p>
              )}
            </div>

            {/* RATES */}
            {(
              [
                "fullTimeTuitionRate",
                "govTuitionRate",
                "partTimeTuitionRate",
              ] as const
            ).map((key) => (
              <div key={key} className="grid gap-2">
                <Label>
                  {key === "fullTimeTuitionRate"
                    ? "Full-Time Tuition Rate"
                    : key === "govTuitionRate"
                      ? "Government Tuition Rate"
                      : "Part-Time Tuition Rate"}
                </Label>

                <Input
                  placeholder="Minimum Rate"
                  {...createTuitionRateForm.register(
                    `${key}.0.minimumRate` as const,
                  )}
                />
                {formState.errors[key]?.[0]?.minimumRate && (
                  <p className="text-red-500 text-sm">
                    {formState.errors[key][0].minimumRate?.message}
                  </p>
                )}

                <Input
                  placeholder="Maximum Rate"
                  {...createTuitionRateForm.register(
                    `${key}.0.maximumRate` as const,
                  )}
                />
                {formState.errors[key]?.[0]?.maximumRate && (
                  <p className="text-red-500 text-sm">
                    {formState.errors[key][0].maximumRate?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button
              type="submit"
              className="bg-blue-700 text-white hover:bg-blue-500"
              isLoading={isLoading}
              onClick={createTuitionRateForm.handleSubmit(onSubmit)}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
