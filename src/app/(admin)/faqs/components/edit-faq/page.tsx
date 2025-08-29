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

  const updateFaqForm = useForm<UpdateFaqSchema>({
    resolver: zodResolver(updateFaqSchema),
    defaultValues: { question, answer },
    mode: "onChange",
  });

  const [updateFaq, { isLoading }] = useUpdateFaqMutation();

  const onSubmit = async (data: UpdateFaqSchema) => {
    const result = await updateFaq({ id, body: { ...data } });
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
    updateFaqForm.reset();
    toast.success("FAQ updated successfully");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={updateFaqForm.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <SquarePen className="cursor-pointer" />
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
                id="question"
                placeholder="Enter question"
                {...updateFaqForm.register("question")}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="answer">Answer</Label>
              <Input
                id="answer"
                placeholder="Enter answer"
                type="text"
                {...updateFaqForm.register("answer")}
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
              onClick={() => updateFaqForm.handleSubmit(onSubmit)()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
