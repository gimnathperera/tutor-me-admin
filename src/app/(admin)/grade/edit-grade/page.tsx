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
import { useFetchSubjectsQuery } from "@/store/api/splits/subjects"; // ✅ assuming you have this hook
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { UpdateGradeSchema, updateGradeSchema } from "./schema";

interface UpdateGradeProps {
  id: string;
  title: string;
  description: string;
  subjects: string[]; // ✅ FIXED: should be array
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
    defaultValues: { title, description, subjects },
    mode: "onChange",
  });

  const [updateGrade, { isLoading }] = useUpdateGradeMutation();
  const { data: subjectsData, isLoading: isSubjectsLoading } =
    useFetchSubjectsQuery({
      page: 1,
      limit: 50,
    });

  const subjectOptions =
    subjectsData?.results?.map((s: any) => ({
      text: s.title,
      value: s.id,
      selected: subjects.includes(s.id),
    })) || [];

  const onSubmit = async (data: UpdateGradeSchema) => {
    const result = await updateGrade({ id, ...data });
    const error = getErrorInApiResult(result);
    if (error) {
      return toast.error(error);
    }
    if ("data" in result) {
      onUpdateSuccess();
    }
  };

  const onUpdateSuccess = () => {
    setOpen(false); // Close the dialog
    updateGradeForm.reset();
    toast.success("Grade updated successfully");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={updateGradeForm.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <SquarePen className="cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white z-[9999] dark:bg-gray-800 dark:text-white/90">
          <DialogHeader>
            <DialogTitle>Edit Grade</DialogTitle>
            <DialogDescription>Edit the grade details.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Title */}
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Title"
                {...updateGradeForm.register("title")}
              />
            </div>

            {/* Description */}
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Description"
                type="text"
                {...updateGradeForm.register("description")}
              />
            </div>

            {/* Subjects MultiSelect */}
            <div className="grid gap-3">
              <Label htmlFor="subjects">Subjects</Label>
              <MultiSelect
                label="Subjects"
                options={subjectOptions}
                defaultSelected={subjects}
                onChange={(values) =>
                  updateGradeForm.setValue("subjects", values)
                }
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
              onClick={() => updateGradeForm.handleSubmit(onSubmit)()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
