"use client";

import TextArea from "@/components/form/input/TextArea";
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
import { initialFormValues, tagSchema, TagSchema } from "@/schemas/tag.schema";
import { useCreateTagMutation } from "@/store/api/splits/tags";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function AddTag() {
  const [open, setOpen] = useState(false);
  const [createTag, { isLoading }] = useCreateTagMutation();

  const createTagForm = useForm({
    resolver: zodResolver(tagSchema),
    defaultValues: initialFormValues as TagSchema,
    mode: "onChange",
  });

  const { formState } = createTagForm;

  const onSubmit = async (data: TagSchema) => {
    try {
      const result = await createTag(data);
      const error = getErrorInApiResult(result);
      if (error) {
        return toast.error(error);
      }
      if ("data" in result) {
        onRegisterSuccess();
      }
    } catch (error) {
      console.error("Unexpected error during tag creation:", error);
      toast.error("An unexpected error occurred while creating the tag");
    }
  };

  const onRegisterSuccess = () => {
    createTagForm.reset();
    toast.success("Tag created successfully");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={createTagForm.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-blue-700 text-white hover:bg-blue-500"
          >
            Add Tag
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white z-50 dark:bg-gray-800 dark:text-white/90">
          <DialogHeader>
            <DialogTitle>Add Tag</DialogTitle>
            <DialogDescription>Add a new tag to the list.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Title</Label>
              <Input
                id="name"
                placeholder="Title"
                {...createTagForm.register("name")}
              />
              {formState.errors.name && (
                <p className="text-sm text-red-500">
                  {formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <TextArea
                id="description"
                placeholder="Description"
                {...createTagForm.register("description")}
              />
              {formState.errors.description && (
                <p className="text-sm text-red-500">
                  {formState.errors.description.message}
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
              onClick={createTagForm.handleSubmit(onSubmit)}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
