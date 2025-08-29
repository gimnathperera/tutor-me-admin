"use client";

import MultiSelect from "@/components/form/MultiSelect";
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
import { useCreateLevelMutation } from "@/store/api/splits/levels";
import { useFetchSubjectsQuery } from "@/store/api/splits/subjects";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  CreateLevelSchema,
  createLevelSchema,
  initialFormValues,
} from "./schema";

export function AddLevel() {
  const [open, setOpen] = useState(false);

  const createLevelForm = useForm<CreateLevelSchema>({
    resolver: zodResolver(createLevelSchema),
    defaultValues: initialFormValues,
    mode: "onChange",
  });

  const { control, register, handleSubmit, reset, formState } = createLevelForm;
  const { errors } = formState;

  const detailsArray = useFieldArray({ control, name: "details" });
  const challangesArray = useFieldArray({ control, name: "challanges" });

  const [createLevel, { isLoading }] = useCreateLevelMutation();
  const { data: subjectsData } = useFetchSubjectsQuery({ page: 1, limit: 100 });

  const subjectOptions =
    subjectsData?.results.map((s) => ({
      value: s.id,
      text: s.title,
      selected: false,
    })) || [];

  const onSubmit = async (data: CreateLevelSchema) => {
    const result = await createLevel(data);
    const error = getErrorInApiResult(result);
    if (error) return toast.error(error);

    if ("data" in result) {
      reset();
      toast.success("Level created successfully");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-blue-700 text-white hover:bg-blue-500"
          >
            Add Level
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[700px] bg-white z-[9999] dark:bg-gray-800 dark:text-white/90">
          <DialogHeader>
            <DialogTitle>Add Level</DialogTitle>
            <DialogDescription>Add a new level to the list.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Title" {...register("title")} />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* Details */}
            <div className="grid gap-3">
              <Label>Details</Label>
              <div className="space-y-2">
                {detailsArray.fields.map((field, idx) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <input
                      placeholder={`Detail ${idx + 1}`}
                      className="border rounded p-2 flex-1"
                      {...register(`details.${idx}` as const)}
                    />
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => detailsArray.remove(idx)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => detailsArray.append("")}
                  className="text-blue-500"
                >
                  + Add Detail
                </button>
                {errors.details && (
                  <p className="text-red-500 text-sm">
                    {(errors.details as any)?.message}
                  </p>
                )}
              </div>
            </div>

            {/* Challenges */}
            <div className="grid gap-3">
              <Label>Challenges</Label>
              <div className="space-y-2">
                {challangesArray.fields.map((field, idx) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <input
                      placeholder={`Challenge ${idx + 1}`}
                      className="border rounded p-2 flex-1"
                      {...register(`challanges.${idx}` as const)}
                    />
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => challangesArray.remove(idx)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => challangesArray.append("")}
                  className="text-blue-500"
                >
                  + Add Challenge
                </button>
                {errors.challanges && (
                  <p className="text-red-500 text-sm">
                    {(errors.challanges as any)?.message}
                  </p>
                )}
              </div>
            </div>

            {/* Subjects */}
            <div className="grid gap-3">
              <Label>Subjects</Label>
              <Controller
                name="subjects"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    label="Select Subjects"
                    options={subjectOptions}
                    defaultSelected={field.value || []}
                    onChange={(values) => field.onChange(values)}
                    value={[]}
                  />
                )}
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
              onClick={() => handleSubmit(onSubmit)()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
