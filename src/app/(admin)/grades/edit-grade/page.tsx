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
import { useForm } from "react-hook-form";
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
  subjects = [],
}: UpdateGradeProps) {
  const [open, setOpen] = useState(false);

  const updateGradeForm = useForm<UpdateGradeSchema>({
    resolver: zodResolver(updateGradeSchema),
    defaultValues: {
      title,
      description,
      subjects,
    },
    mode: "onChange",
  });

  const { register, handleSubmit, setValue, reset } = updateGradeForm;
  const [updateGrade, { isLoading }] = useUpdateGradeMutation();
  const { data: subjectsData } = useFetchSubjectsQuery({ page: 1, limit: 50 });

  useEffect(() => {
    if (subjectsData) {
      reset({ title, description, subjects });
    }
  }, [title, description, subjects, subjectsData, reset]);

  const subjectOptions =
    subjectsData?.results?.map((s) => ({
      text: s.title,
      value: s.id,
      selected: subjects.includes(s.id),
    })) || [];

  const handleDialogClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset({ title, description, subjects });
    }
  };

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
    <Dialog open={open} onOpenChange={handleDialogClose}>
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
              <MultiSelect
                key={open ? "open" : "closed"}
                label=""
                options={subjectOptions}
                defaultSelected={subjects}
                onChange={(values: string[]) => setValue("subjects", values)}
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
