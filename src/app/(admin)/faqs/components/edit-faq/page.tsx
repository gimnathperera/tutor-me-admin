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
import { useUpdateFaqMutation } from "@/store/api/splits/faqs";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { UpdateFaqSchema, updateFaqSchema } from "./schema";

interface UpdateFAQProps {
  id: string;
  question: string;
  answer: string;
}

export function UpdateFAQ({ id, question, answer }: UpdateFAQProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateFaqSchema>({
    resolver: zodResolver(updateFaqSchema),
    defaultValues: { question, answer },
    mode: "onChange",
  });

  const [updateFaq, { isLoading }] = useUpdateFaqMutation();

  const onSubmit = async (data: UpdateFaqSchema) => {
    try {
      const result = await updateFaq({ id, body: { ...data } });
      const error = getErrorInApiResult(result);
      if (error) {
        return toast.error(error);
      }
      if ("data" in result) {
        onUpdateSuccess(data);
      }
    } catch (error) {
      console.error("Unexpected error during FAQ update:", error);
      toast.error("An unexpected error occurred while updating the FAQ.");
    }
  };

  const onUpdateSuccess = (updatedValues: UpdateFaqSchema) => {
    reset(updatedValues);
    setOpen(false);
    toast.success("FAQ updated successfully");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          reset({ question, answer });
        }
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <SquarePen className="cursor-pointer text-blue-500 hover:text-blue-700" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white z-50 dark:bg-gray-800 dark:text-white/90">
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
            <DialogDescription>Edit the question and answer.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="question">Question</Label>
              <Input
                className="dark:bg-gray-900 dark:placeholder:text-white/30"
                id="question"
                placeholder="Enter question"
                autoComplete="off"
                {...register("question")}
              />
              {errors.question && (
                <p className="text-sm text-red-500 dark:text-red-500/90">
                  {errors.question.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="answer">Answer</Label>
              <TextArea
                id="answer"
                placeholder="Enter answer"
                rows={6}
                autoComplete="off"
                {...register("answer")}
              />
              {errors.answer && (
                <p className="text-sm text-red-500 dark:text-red-500/90">
                  {errors.answer.message}
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
              onClick={() => handleSubmit(onSubmit)()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
