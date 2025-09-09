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
import { useUpdateTestimonialMutation } from "@/store/api/splits/testimonials";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { UpdateTestimonialSchema, updateTestimonialSchema } from "./schema";

interface UpdateTestimonialProps {
  id: string;
  title: string;
  description: string;
}

export function UpdateTestimonial({ id, title, description }: UpdateTestimonialProps) {
  const [open, setOpen] = useState(false);

  const updateTestimonialForm = useForm<UpdateTestimonialSchema>({
    resolver: zodResolver(updateTestimonialSchema),
    defaultValues: { title, description },
    mode: "onChange",
  });

  const [updateTestimonial, { isLoading }] = useUpdateTestimonialMutation();

  const onSubmit = async (data: UpdateTestimonialSchema) => {
    try {
      const result = await updateTestimonial({ id, ...data });
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
            <DialogDescription>Edit the testimonial details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Title"
                {...updateTestimonialForm.register("title")}
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
                {...updateTestimonialForm.register("description")}
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
