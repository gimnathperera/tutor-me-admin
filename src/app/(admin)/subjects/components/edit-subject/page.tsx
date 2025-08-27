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
import { useUpdateSubjectMutation } from "@/store/api/splits/subjects";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { UpdateSubjectSchema, updateSubjectSchema } from "./schema";

interface UpdateSubjectProps {
  id: string;
  title: string;
  description: string;
}

export function UpdateSubject({ id, title, description }: UpdateSubjectProps) {
  const [open, setOpen] = useState(false);

  const updateSubjectForm = useForm<UpdateSubjectSchema>({
    resolver: zodResolver(updateSubjectSchema),
    defaultValues: { title, description },
    mode: "onChange",
  });

  const [updateSubject, { isLoading }] = useUpdateSubjectMutation();

  const onSubmit = async (data: UpdateSubjectSchema) => {
    const result = await updateSubject({ id, ...data });
    const error = getErrorInApiResult(result);
    if (error) {
      return toast.error(error);
    }
    if ("data" in result) {
      onUpdateSuccess();
    }
  };

  const onUpdateSuccess = () => {
    setOpen(false);
    updateSubjectForm.reset();
    toast.success("Subject updated successfully");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={updateSubjectForm.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <SquarePen className="cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white z-50 dark:bg-gray-800 dark:text-white/90">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>Edit the subject details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Title"
                {...updateSubjectForm.register("title")}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Description"
                type="text"
                {...updateSubjectForm.register("description")}
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
              onClick={() => updateSubjectForm.handleSubmit(onSubmit)()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
