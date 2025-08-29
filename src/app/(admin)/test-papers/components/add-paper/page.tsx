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
import { useCreateSubjectMutation } from "@/store/api/splits/subjects";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  CreateSubjectSchema,
  createSubjectSchema,
  initialFormValues,
} from "./schema";

export function AddPaper() {
  const [open, setOpen] = useState(false);
  const [createSubject, { isLoading }] = useCreateSubjectMutation();

  const createSubjectForm = useForm({
    resolver: zodResolver(createSubjectSchema),
    defaultValues: initialFormValues as CreateSubjectSchema,
    mode: "onChange",
  });

  const { formState } = createSubjectForm;

  const onSubmit = async (data: CreateSubjectSchema) => {
    const result = await createSubject(data);
    const error = getErrorInApiResult(result);
    if (error) {
      return toast.error(error);
    }
    if ("data" in result) {
      onRegisterSuccess();
    }
  };

  const onRegisterSuccess = () => {
    createSubjectForm.reset();
    toast.success("Paper created successfully");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={createSubjectForm.handleSubmit(onSubmit)}>
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
            <DialogDescription>
              Add a new paper to the list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Title"
                {...createSubjectForm.register("title")}
              />
              {formState.errors.title && (
                <p className="text-sm text-red-500">
                  {formState.errors.title.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Description"
                type="text"
                {...createSubjectForm.register("description")}
              />
              {formState.errors.description && (
                <p className="text-sm text-red-500">
                  {formState.errors.description.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="grade">Grade</Label>
              <Input
                id="grade"
                placeholder="Grade"
                type="text"
                {...createSubjectForm.register("grade")}
              />
              {formState.errors.grade && (
                <p className="text-sm text-red-500">
                  {formState.errors.grade.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Subject"
                type="text"
                {...createSubjectForm.register("subject")}
              />
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
                {...createSubjectForm.register("year")}
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
                {...createSubjectForm.register("url")}
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
              onClick={createSubjectForm.handleSubmit(onSubmit)}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
