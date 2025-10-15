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

import MultiSelect from "@/components/form/MultiSelect";
import { useUpdateGradeMutation } from "@/store/api/splits/grades";
import { useFetchSubjectsQuery } from "@/store/api/splits/subjects";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { UpdateGradeSchema, updateGradeSchema } from "./schema";

interface UpdateGradeProps {
  id: string;
  title: string;
  description: string;
  subjects: string[];
}

export function UpdateGrade({
  id,
  title,
  description,
  subjects,
}: UpdateGradeProps) {
  const [open, setOpen] = useState(false);

  const updateGradeForm = useForm<UpdateGradeSchema>({
    resolver: zodResolver(updateGradeSchema),
    defaultValues: { title: "", description: "", subjects: [] },
    mode: "onChange",
  });

  const { reset, control, register, handleSubmit } = updateGradeForm;

  const [updateGrade, { isLoading }] = useUpdateGradeMutation();
  const { data: subjectsData } = useFetchSubjectsQuery({ page: 1, limit: 50 });

  const subjectOptions =
    subjectsData?.results?.map((s) => ({
      text: s.title,
      value: s.id,
    })) || [];
  useEffect(() => {
    if (open && subjectsData) {
      const subjectIds = subjects
        .map((title) => {
          const found = subjectsData.results.find((s) => s.title === title);
          return found ? found.id : null;
        })
        .filter(Boolean) as string[];

      reset({ title, description, subjects: subjectIds });
    }
  }, [open, title, description, subjects, subjectsData, reset]);

  const onSubmit = async (data: UpdateGradeSchema) => {
    try {
      const result = await updateGrade({ id, ...data });
      const error = getErrorInApiResult(result);
      if (error) return toast.error(error);

      if ("data" in result) {
        toast.success("Grade updated successfully");
        setOpen(false);
      }
    } catch (error) {
      console.error("Unexpected error during grade update:", error);
      toast.error("An unexpected error occurred while updating the grade.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SquarePen className="cursor-pointer text-blue-500 hover:text-blue-700" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-white z-[9999] dark:bg-gray-800 dark:text-white/90">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Grade</DialogTitle>
            <DialogDescription>Edit the grade details.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Title" {...register("title")} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Description"
                {...register("description")}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="subjects">Subjects</Label>
              <Controller
                control={control}
                name="subjects"
                render={({ field }) => (
                  <MultiSelect
                    label=""
                    options={subjectOptions}
                    defaultSelected={field.value}
                    onChange={field.onChange}
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
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
