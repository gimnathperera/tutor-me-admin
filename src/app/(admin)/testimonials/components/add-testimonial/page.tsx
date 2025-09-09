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
import { useCreateTestimonialMutation } from "@/store/api/splits/testimonials";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  CreateTestimonialSchema,
  createTestimonialSchema,
  initialFormValues,
} from "./schema";

export function AddTestimonial() {
  const [open, setOpen] = useState(false);
  const [createTestimonial, { isLoading }] = useCreateTestimonialMutation();

  const createTestimonialForm = useForm({
    resolver: zodResolver(createTestimonialSchema),
    defaultValues: initialFormValues as CreateTestimonialSchema,
    mode: "onChange",
  });

  const { formState } = createTestimonialForm;

  const onSubmit = async (data: CreateTestimonialSchema) => {
    try {
      const result = await createTestimonial(data);
      const error = getErrorInApiResult(result);
      if (error) {
        return toast.error(error);
      }
      if ("data" in result) {
        onRegisterSuccess();
      }
    } catch (error) {
      console.error("Unexpected error during testimonial creation:", error);
      toast.error("An unexpected error occurred while creating the testimonial");
    }
  };

  const onRegisterSuccess = () => {
    createTestimonialForm.reset();
    toast.success("Testimonial created successfully");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={createTestimonialForm.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-blue-700 text-white hover:bg-blue-500"
          >
            Add Testimonial
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white z-50 dark:bg-gray-800 dark:text-white/90">
          <DialogHeader>
            <DialogTitle>Add Testimonial</DialogTitle>
            <DialogDescription>
              Add a new testimonial to the list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Title"
                {...createTestimonialForm.register("title")}
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
                {...createTestimonialForm.register("description")}
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
              onClick={createTestimonialForm.handleSubmit(onSubmit)}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
