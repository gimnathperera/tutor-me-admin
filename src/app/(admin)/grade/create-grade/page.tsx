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
import { useCreateGradeMutation } from "@/store/api/splits/grades";
import { useFetchSubjectsQuery } from "@/store/api/splits/subjects";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  CreateGradeSchema,
  createGradeSchema,
  initialFormValues,
} from "./schema";

export function AddGrade() {
  const [open, setOpen] = useState(false);

  const createGradeForm = useForm({
    resolver: zodResolver(createGradeSchema),
    defaultValues: initialFormValues as CreateGradeSchema,
    mode: "onChange",
  });

  const [createGrade, { isLoading }] = useCreateGradeMutation();
  const { data: subjectsData, isLoading: subjectsLoading } =
    useFetchSubjectsQuery({ page: 1, limit: 100 });

  const subjectOptions =
    subjectsData?.results.map((s) => ({
      value: s.id,
      text: s.title,
      selected: false,
    })) || [];

  const onSubmit = async (data: CreateGradeSchema) => {
    try {
      console.log("Submitting grade:", data);

      const result = await createGrade(data);
      const error = getErrorInApiResult(result);
      if (error) return toast.error(error);

      if ("data" in result) {
        onRegisterSuccess();
      }
    } catch (error) {
      console.error("Unexpected error during grade creation:", error);
      toast.error("An unexpected error occurred while creating the grade.");
    }
  };

  const onRegisterSuccess = () => {
    createGradeForm.reset();
    toast.success("Grade created successfully");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={createGradeForm.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-blue-700 text-white hover:bg-blue-500"
          >
            Add Grade
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] bg-white z-[9999] dark:bg-gray-800 dark:text-white/90">
          <DialogHeader>
            <DialogTitle>Add Grade</DialogTitle>
            <DialogDescription>Add a new grade to the list.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Title"
                {...createGradeForm.register("title")}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Description"
                type="text"
                {...createGradeForm.register("description")}
              />
            </div>
            <div className="grid gap-3">
              <Label>Subjects</Label>
              <Controller
                name="subjects"
                control={createGradeForm.control}
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

          {/* Footer */}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-700 text-white hover:bg-blue-500"
              isLoading={isLoading}
              onClick={createGradeForm.handleSubmit(onSubmit)}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
