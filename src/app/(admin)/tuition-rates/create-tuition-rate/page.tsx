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
import { useFetchLevelsQuery } from "@/store/api/splits/levels";
import { useFetchSubjectsQuery } from "@/store/api/splits/subjects";
import { useCreateTuitionRateMutation } from "@/store/api/splits/tuition-rates";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
  const { formState } = createTuitionRateForm;

  const [createRate, { isLoading }] = useCreateTuitionRateMutation();
  const { data: subjectsData } = useFetchSubjectsQuery({ page: 1, limit: 100 });
  const { data: gradeData } = useFetchGradesQuery({ page: 1, limit: 100 });
  const { data: levelData } = useFetchLevelsQuery({ page: 1, limit: 100 });

  const subjectOptions =
    subjectsData?.results.map((s) => ({
      value: s.id,
      label: s.title,
    })) || [];

  const gradeOptions =
    gradeData?.results.map((g) => ({
      value: g.id,
      label: g.title,
    })) || [];

  const levelOptions =
    levelData?.results.map((l) => ({
      value: l.id,
      label: l.title,
    })) || [];

  const onSubmit = async (data: CreateTuitionSchema) => {
    const result = await createRate(data);
    const error = getErrorInApiResult(result);
    if (error) return toast.error(error);
    if ("data" in result) {
      createTuitionRateForm.reset();
      toast.success("Tuition Rate created successfully");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              <Label>Subjects</Label>
              <Controller
                name="subject"
                control={createTuitionRateForm.control}
                render={({ field }) => (
                  <Select
                    options={subjectOptions}
                    value={field.value} // <-- correct usage
                    onChange={field.onChange}
                    placeholder="Select subject"
                  />
                )}
              />
              {formState.errors.subject && (
                <p className="text-sm text-red-500">
                  {formState.errors.subject.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label>Grades</Label>
              <Controller
                name="grade"
                control={createTuitionRateForm.control}
                render={({ field }) => (
                  <Select
                    options={gradeOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select grade"
                  />
                )}
              />
              {formState.errors.grade && (
                <p className="text-sm text-red-500">
                  {formState.errors.grade.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label>Levels</Label>
              <Controller
                name="level"
                control={createTuitionRateForm.control}
                render={({ field }) => (
                  <Select
                    options={levelOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select level"
                  />
                )}
              />
              {formState.errors.level && (
                <p className="text-sm text-red-500">
                  {formState.errors.level.message}
                </p>
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
