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
import { Textarea } from "@/components/ui/textarea";
import { tagSchema, TagSchema } from "@/schemas/tag.schema";
import { useUpdateTagMutation } from "@/store/api/splits/tags";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface UpdateTagProps {
  id: string;
  name: string;
  description: string;
}

export function UpdateTag({ id, name, description }: UpdateTagProps) {
  const [open, setOpen] = useState(false);

  const updateTagForm = useForm<TagSchema>({
    resolver: zodResolver(tagSchema),
    defaultValues: { name, description },
    mode: "onChange",
  });

  const {
    handleSubmit,
    register,
    reset,
    getValues,
    formState: { errors, isDirty },
  } = updateTagForm;

  useEffect(() => {
    reset({ name, description });
  }, [name, description, reset]);

  const [updateTag, { isLoading }] = useUpdateTagMutation();

  const handleDialogClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset({ name, description });
    }
  };

  const handleCancel = () => {
    reset({ name, description });
    setOpen(false);
  };

  const onSubmit = async (data: TagSchema) => {
    try {
      const result = await updateTag({ id, ...data });
      const error = getErrorInApiResult(result);
      if (error) {
        return toast.error(error);
      }
      if ("data" in result) {
        onUpdateSuccess();
      }
    } catch (error) {
      console.error("Unexpected error during tag update:", error);
      toast.error("An unexpected error occurred while updating the tag");
    }
  };

  const onUpdateSuccess = () => {
    const updatedValues = getValues();
    setOpen(false);
    reset(updatedValues);
    toast.success("Tag updated successfully");
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <SquarePen className="cursor-pointer text-blue-500 hover:text-blue-700" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white z-50 dark:bg-gray-800 dark:text-white/90">
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>Edit the tag details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Title</Label>
              <Input id="name" placeholder="Title" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-700 text-white hover:bg-blue-500"
              isLoading={isLoading}
              disabled={!isDirty}
              onClick={updateTagForm.handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
