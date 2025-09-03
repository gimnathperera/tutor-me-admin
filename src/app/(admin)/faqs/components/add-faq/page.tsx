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
import { useCreateFaqMutation } from "@/store/api/splits/faqs";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  CreateFaqSchema,
  createFaqSchema,
  initialFaqFormValues,
} from "./schema";

export function AddFAQ() {
  const [open, setOpen] = useState(false);

  const faqForm = useForm({
    resolver: zodResolver(createFaqSchema),
    defaultValues: initialFaqFormValues as CreateFaqSchema,
    mode: "onChange",
  });

  const [createFaq, { isLoading }] = useCreateFaqMutation();

  const onSubmit = async (data: CreateFaqSchema) => {
    try {
      const result = await createFaq(data);
      const error = getErrorInApiResult(result);
      if (error) {
        return toast.error(error);
      }
      if ("data" in result) {
        onRegisterSuccess();
      }
    } catch (error) {
      console.error("Unexpected error during FAQ creation:", error);
      toast.error("An unexpected error occurred while creating the FAQ.");
    }
  };

  const onRegisterSuccess = () => {
    faqForm.reset();
    toast.success("FAQ created successfully");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={faqForm.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-blue-700 text-white hover:bg-blue-500"
          >
            Add FAQ
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white z-[9999] dark:bg-gray-800 dark:text-white/90">
          <DialogHeader>
            <DialogTitle>Add FAQ</DialogTitle>
            <DialogDescription>
              Add a new FAQ item with question and answer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                placeholder="Enter FAQ question"
                {...faqForm.register("question")}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="answer">Answer</Label>
              <Input
                id="answer"
                placeholder="Enter FAQ answer"
                type="text"
                {...faqForm.register("answer")}
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
              onClick={faqForm.handleSubmit(onSubmit)}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
