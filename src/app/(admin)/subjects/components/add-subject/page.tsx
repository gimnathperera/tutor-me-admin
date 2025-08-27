"use client"

import { Button } from "@/components/ui/button/Button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateSubjectMutation } from "@/store/api/splits/subjects";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CreateSubjectSchema, createSubjectSchema, initialFormValues } from "./schema";

export function AddSubject() {
  const [open, setOpen] = useState(false);

  const createSubjectForm = useForm({
    resolver: zodResolver(createSubjectSchema),
    defaultValues: initialFormValues as CreateSubjectSchema,
    mode: "onChange",
  });

  const [createSubject, { isLoading }] = useCreateSubjectMutation();

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
    toast.success("Subject created successfully");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={createSubjectForm.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-blue-700 text-white hover:bg-blue-500">Add Subject</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white z-50 dark:bg-gray-800 dark:text-white/90">
          <DialogHeader>
            <DialogTitle>Add Subject</DialogTitle>
            <DialogDescription>
              Add a new subject to the list.
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
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Description"
                type="text"
                {...createSubjectForm.register("description")}
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
