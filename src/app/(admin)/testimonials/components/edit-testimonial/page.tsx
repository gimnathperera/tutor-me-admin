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
  testimonialSchema,
  TestimonialSchema,
} from "@/schemas/testimonial.schema";
import { useUpdateTestimonialMutation } from "@/store/api/splits/testimonials";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface UpdateTestimonialProps {
  id: string;
  content: string;
  rating: number;
  owner: {
    name: string;
    role: string;
    avatar: string;
  };
}

export function UpdateTestimonial({
  id,
  content,
  rating,
  owner,
}: UpdateTestimonialProps) {
  const [open, setOpen] = useState(false);

  const updateTestimonialForm = useForm<TestimonialSchema>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      content,
      rating,
      owner,
    },
    mode: "onChange",
  });

  const [updateTestimonial, { isLoading }] = useUpdateTestimonialMutation();

  const onSubmit = async (data: TestimonialSchema) => {
    try {
      const payload = {
        id,
        ...data,
        rating: Number(data.rating),
      };

      const result = await updateTestimonial(payload);
      const error = getErrorInApiResult(result);
      if (error) {
        return toast.error(error);
      }
      if ("data" in result) {
        onUpdateSuccess();
      }
    } catch (error) {
      console.error("Unexpected error during testimonial update:", error);
      toast.error("An unexpected error occurred while updating the testimonial");
    }
  };

  const { formState } = updateTestimonialForm;

  const onUpdateSuccess = () => {
    const updatedValues = updateTestimonialForm.getValues();
    setOpen(false);
    updateTestimonialForm.reset(updatedValues);
    toast.success("Testimonial updated successfully");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={updateTestimonialForm.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <SquarePen className="cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white z-50 dark:bg-gray-800 dark:text-white/90">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
            <DialogDescription>
              Edit the testimonial details.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Content */}
            <div className="grid gap-3">
              <Label htmlFor="content">Content</Label>
              <Input
                id="content"
                placeholder="Content"
                {...updateTestimonialForm.register("content")}
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
              <Input
                id="rating"
                placeholder="1 - 5"
                type="number"
                min={1}
                max={5}
                {...updateTestimonialForm.register("rating", {
                  valueAsNumber: true,
                })}
              />
              {formState.errors.rating && (
                <p className="text-sm text-red-500">
                  {formState.errors.rating.message}
                </p>
              )}
            </div>

            {/* Owner Name */}
            <div className="grid gap-3">
              <Label htmlFor="owner.name">Owner Name</Label>
              <Input
                id="owner.name"
                placeholder="Owner name"
                {...updateTestimonialForm.register("owner.name")}
              />
              {formState.errors.owner?.name && (
                <p className="text-sm text-red-500">
                  {formState.errors.owner.name.message}
                </p>
              )}
            </div>

            {/* Owner Role */}
            <div className="grid gap-3">
              <Label htmlFor="owner.role">Owner Role</Label>
              <Input
                id="owner.role"
                placeholder="Owner role"
                {...updateTestimonialForm.register("owner.role")}
              />
              {formState.errors.owner?.role && (
                <p className="text-sm text-red-500">
                  {formState.errors.owner.role.message}
                </p>
              )}
            </div>

            {/* Owner Avatar */}
            <div className="grid gap-3">
              <Label htmlFor="owner.avatar">Owner Avatar (URL)</Label>
              <Input
                id="owner.avatar"
                placeholder="https://example.com/avatar.jpg"
                {...updateTestimonialForm.register("owner.avatar")}
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
              onClick={updateTestimonialForm.handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
