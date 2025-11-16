"use client";

import Select from "@/components/form/Select";
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

import { useFetchGradesQuery } from "@/store/api/splits/grades";
import { useFetchSubjectsQuery } from "@/store/api/splits/subjects";
import { useUpdateTuitionRateMutation } from "@/store/api/splits/tuition-rates";
import { getErrorInApiResult } from "@/utils/api";

import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { UpdateTuitionSchema, updateTuitionSchema } from "./schema";

interface UpdateTuitionRateProps {
  id: string;
  subject: string;
  grade: string;
  fullTimeTuitionRate: { minimumRate: string; maximumRate: string }[];
  govTuitionRate: { minimumRate: string; maximumRate: string }[];
  partTimeTuitionRate: { minimumRate: string; maximumRate: string }[];
}

export function UpdateTuitionRate({
  id,
  subject,
  grade,
  fullTimeTuitionRate,
  govTuitionRate,
  partTimeTuitionRate,
}: UpdateTuitionRateProps) {
  const [open, setOpen] = useState(false);

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateTuitionSchema>({
    resolver: zodResolver(updateTuitionSchema),
    defaultValues: {
      subject: "",
      grade: "",
      fullTimeTuitionRate: [{ minimumRate: "", maximumRate: "" }],
      govTuitionRate: [{ minimumRate: "", maximumRate: "" }],
      partTimeTuitionRate: [{ minimumRate: "", maximumRate: "" }],
    },
    mode: "onChange",
  });

  const [updateTuition, { isLoading }] = useUpdateTuitionRateMutation();

  const { data: subjectsData, isLoading: isSubjectsLoading } =
    useFetchSubjectsQuery({ page: 1, limit: 50 });
  const { data: gradesData, isLoading: isGradesLoading } = useFetchGradesQuery({
    page: 1,
    limit: 50,
  });

  const subjectOptions =
    subjectsData?.results?.map((s) => ({ value: s.id, label: s.title })) || [];
  const gradeOptions =
    gradesData?.results?.map((g) => ({ value: g.id, label: g.title })) || [];

  const displayLoading =
    isSubjectsLoading || isGradesLoading;

  useEffect(() => {
    if (open) {
      reset({
        subject: subject || "",
        grade: grade || "",
        fullTimeTuitionRate: fullTimeTuitionRate.length
          ? fullTimeTuitionRate
          : [{ minimumRate: "", maximumRate: "" }],
        govTuitionRate: govTuitionRate.length
          ? govTuitionRate
          : [{ minimumRate: "", maximumRate: "" }],
        partTimeTuitionRate: partTimeTuitionRate.length
          ? partTimeTuitionRate
          : [{ minimumRate: "", maximumRate: "" }],
      });
    }
  }, [
    open,
    subject,
    grade,
    fullTimeTuitionRate,
    govTuitionRate,
    partTimeTuitionRate,
    reset,
  ]);

  const onSubmit = async (data: UpdateTuitionSchema) => {
    const payload = {
      id,
      subject: data.subject,
      grade: data.grade,
      fullTimeTuitionRate: data.fullTimeTuitionRate,
      govTuitionRate: data.govTuitionRate,
      partTimeTuitionRate: data.partTimeTuitionRate,
    };

    const result = await updateTuition(payload);
    const error = getErrorInApiResult(result);
    if (error) return toast.error(error);

    if ("data" in result) {
      toast.success("Tuition rate updated successfully");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SquarePen className="cursor-pointer text-blue-500 hover:text-blue-700" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-white z-[9999] dark:bg-gray-800 dark:text-white/90">
        <DialogHeader>
          <DialogTitle>Edit Tuition Rate</DialogTitle>
          <DialogDescription>
            Update the tuition rate information.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-1">
            <Label>Grade</Label>
            <Controller
              name="grade"
              control={control}
              render={({ field }) => (
                <Select
                  options={gradeOptions}
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="Select grade"
                />
              )}
            />
            {errors.grade && (
              <p className="text-red-500 text-sm">{errors.grade.message}</p>
            )}
          </div>

          <div className="grid gap-1">
            <Label>Subject</Label>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <Select
                  options={subjectOptions}
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Select subject"
                  className="w-full"
                />
              )}
            />

            {errors.subject && (
              <p className="text-red-500 text-sm">{errors.subject.message}</p>
            )}
          </div>

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
                {...register(`${key}.0.minimumRate` as const)}
              />
              {errors[key]?.[0]?.minimumRate && (
                <p className="text-red-500 text-sm">
                  {errors[key][0].minimumRate?.message}
                </p>
              )}

              <Input
                placeholder="Maximum Rate"
                {...register(`${key}.0.maximumRate` as const)}
              />
              {errors[key]?.[0]?.maximumRate && (
                <p className="text-red-500 text-sm">
                  {errors[key][0].maximumRate?.message}
                </p>
              )}
            </div>
          ))}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-700 text-white hover:bg-blue-500"
              isLoading={isLoading}
              disabled={displayLoading || !isDirty}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
