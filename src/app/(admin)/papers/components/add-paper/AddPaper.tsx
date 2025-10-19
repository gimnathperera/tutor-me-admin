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
import { Textarea } from "@/components/ui/textarea";
import {
  initialFormValues,
  PaperSchema,
  paperSchema,
} from "@/schemas/paper.schema";
import {
  useFetchGradeByIdQuery,
  useFetchGradesQuery,
} from "@/store/api/splits/grades";
import { useCreatePaperMutation } from "@/store/api/splits/papers";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function AddPaper() {
  const [open, setOpen] = useState(false);
  const [createPaper, { isLoading }] = useCreatePaperMutation();
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);
  const { data: gradeData, isLoading: isGradesLoading } = useFetchGradesQuery(
    {},
  );

  const createPaperForm = useForm({
    resolver: zodResolver(paperSchema),
    defaultValues: initialFormValues as PaperSchema,
    mode: "onChange",
  });

  const { data: gradeDetails, isLoading: isGradeDetailsLoading } =
    useFetchGradeByIdQuery(selectedGradeId!, { skip: !selectedGradeId });

  const onSubmit = async (data: PaperSchema) => {
    try {
      const result = await createPaper(data);
      const error = getErrorInApiResult(result);
      if (error) {
        return toast.error(error);
      }
      if ("data" in result) {
        onRegisterSuccess();
      }
    } catch (error) {
      console.error("Unexpected error during paper creation:", error);
      toast.error("An unexpected error occurred while creating the paper");
    }
  };

  const onRegisterSuccess = () => {
    createPaperForm.reset();
    toast.success("Paper created successfully");
    setOpen(false);
  };

  const { formState, watch, setValue } = createPaperForm;
  const selectedGrade = watch("grade");

  useEffect(() => {
    setValue("subject", "");
    setSelectedGradeId(selectedGrade || null);
  }, [selectedGrade, setValue]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={createPaperForm.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-blue-700 text-white hover:bg-blue-500"
          >
            Add Paper
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white z-50 dark:bg-gray-800 dark:text-white/90">
          <DialogHeader>
            <DialogTitle>Add Paper</DialogTitle>
            <DialogDescription>Add a new paper to the list.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 max-h-[67vh] overflow-y-auto">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Title"
                {...createPaperForm.register("title")}
              />
              {formState.errors.title && (
                <p className="text-sm text-red-500">
                  {formState.errors.title.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description"
                {...createPaperForm.register("description")}
                rows={1}
                onInput={(e) => {
                  const target = e.currentTarget;
                  target.style.height = "auto";
                  target.style.height = target.scrollHeight + "px";
                }}
                className="resize-none overflow-hidden"
              />
              {formState.errors.description && (
                <p className="text-sm text-red-500">
                  {formState.errors.description.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="grade">Grade</Label>
              <Select
                onValueChange={(value) =>
                  createPaperForm.setValue("grade", value)
                }
                value={createPaperForm.watch("grade")}
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
            <div className="grid gap-3">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                placeholder="Year"
                type="text"
                {...createPaperForm.register("year")}
              />
              {formState.errors.year && (
                <p className="text-sm text-red-500">
                  {formState.errors.year.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="URL"
                type="text"
                {...createPaperForm.register("url")}
              />
              {formState.errors.url && (
                <p className="text-sm text-red-500">
                  {formState.errors.url.message}
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
              isLoading={isLoading}
              onClick={createPaperForm.handleSubmit(onSubmit)}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
