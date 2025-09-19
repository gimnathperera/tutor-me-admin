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
import { StarRating } from "@/components/ui/StarRating";
import {
  initialFormValues,
  TestimonialSchema,
  testimonialSchema,
} from "@/schemas/testimonial.schema";
import { useCreateTestimonialMutation } from "@/store/api/splits/testimonials";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function AddTestimonial() {
  const [open, setOpen] = useState(false);
  const [createTestimonial, { isLoading }] = useCreateTestimonialMutation();

  const createTestimonialForm = useForm<TestimonialSchema>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: initialFormValues,
    mode: "onChange",
  });

  const { formState } = createTestimonialForm;

  const onSubmit = async (data: TestimonialSchema) => {
    try {
      const payload = {
        ...data,
        rating: Number(data.rating),
      };

      const result = await createTestimonial(payload);
      const error = getErrorInApiResult(result);
      if (error) {
        return toast.error(error);
      }
      if ("data" in result) {
        onRegisterSuccess();
      }
    } catch (error) {
      console.error("Unexpected error during testimonial creation:", error);
      toast.error(
        "An unexpected error occurred while creating the testimonial",
      );
    }
  };

  const onRegisterSuccess = () => {
    createTestimonialForm.reset();
    toast.success("Testimonial created successfully");
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          createTestimonialForm.reset();
        }
      }}
    >
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
              Fill in the details to create a new testimonial.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Content */}
            <div className="grid gap-3">
              <Label htmlFor="content">Content</Label>
              <Input
                id="content"
                placeholder="Content"
                {...createTestimonialForm.register("content")}
              />
              {formState.errors.content && (
                <p className="text-sm text-red-500">
                  {formState.errors.content.message}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="grid gap-3">
              <Label htmlFor="rating">Rating</Label>
              <div className="flex items-center space-x-2">
                <StarRating
                  value={createTestimonialForm.watch("rating")}
                  onChange={(val) =>
                    createTestimonialForm.setValue("rating", val)
                  }
                />
                <span className="text-gray-700 dark:text-gray-200 font-medium">
                  {createTestimonialForm.watch("rating")}/5
                </span>
              </div>
              {formState.errors.rating && (
                <p className="text-sm text-red-500">
                  {formState.errors.rating.message}
                </p>
              )}
            </div>

            {/* Owner name */}
            <div className="grid gap-3">
              <Label htmlFor="owner.name">Owner Name</Label>
              <Input
                id="owner.name"
                placeholder="Owner name"
                {...createTestimonialForm.register("owner.name")}
              />
              {formState.errors.owner?.name && (
                <p className="text-sm text-red-500">
                  {formState.errors.owner.name.message}
                </p>
              )}
            </div>

            {/* Owner role */}
            <div className="grid gap-3">
              <Label htmlFor="owner.role">Owner Role</Label>
              <Input
                id="owner.role"
                placeholder="Owner role"
                {...createTestimonialForm.register("owner.role")}
              />
              {formState.errors.owner?.role && (
                <p className="text-sm text-red-500">
                  {formState.errors.owner.role.message}
                </p>
              )}
            </div>

            {/* Owner avatar */}
            <div className="grid gap-3">
              <Label htmlFor="owner.avatar">Owner Avatar (URL)</Label>
              <Input
                id="owner.avatar"
                placeholder="https://example.com/avatar.jpg"
                {...createTestimonialForm.register("owner.avatar")}
              />
              {formState.errors.owner?.avatar && (
                <p className="text-sm text-red-500">
                  {formState.errors.owner.avatar.message}
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
