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
import { useCreateInquiryMutation } from "@/store/api/splits/inquiries";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TextArea from "@/components/form/input/TextArea";
import {
  CreateInquirySchema,
  createInquirySchema,
  initialInquiryFormValues,
} from "./schema";

export function AddInquiry() {
  const [open, setOpen] = useState(false);
  const inquiryForm = useForm<CreateInquirySchema>({
    resolver: zodResolver(createInquirySchema),
    defaultValues: initialInquiryFormValues as CreateInquirySchema,
    mode: "onChange",
  });

  const [createInquiry, { isLoading }] = useCreateInquiryMutation();

  const onSubmit = async (data: CreateInquirySchema) => {
    const payload = {
      sender: {
        name: data.senderName,
        email: data.senderEmail,
      },
      message: data.message,
    };

    const result = await createInquiry(payload);
    const error = getErrorInApiResult(result);
    if (error) return toast.error(error);

    if ("data" in result) onRegisterSuccess();
  };

  const onRegisterSuccess = () => {
    inquiryForm.reset();
    toast.success("Inquiry created successfully");
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          inquiryForm.reset();
        }
      }}
    >
      <form onSubmit={inquiryForm.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-blue-700 text-white hover:bg-blue-500"
          >
            Add Inquiry
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white z-[9999] dark:bg-gray-800 dark:text-white/90">
          <DialogHeader>
            <DialogTitle>Add Inquiry (Manually)</DialogTitle>
            <DialogDescription>
              Add a new inquiry with sender name, email, and inquiry.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="senderName">Sender Name</Label>
              <Input
                className="dark:bg-gray-900 dark:placeholder:text-white/30"
                id="senderName"
                placeholder="Enter sender name"
                {...inquiryForm.register("senderName")}
              />
              {inquiryForm.formState.errors.senderName && (
                <p className="text-sm text-red-500 dark:text-red-500/90">
                  {inquiryForm.formState.errors.senderName.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="senderEmail">Sender Email</Label>
              <Input
                className="dark:bg-gray-900 dark:placeholder:text-white/30"
                id="senderEmail"
                placeholder="Enter sender email"
                {...inquiryForm.register("senderEmail")}
              />
              {inquiryForm.formState.errors.senderEmail && (
                <p className="text-sm text-red-500 dark:text-red-500/90">
                  {inquiryForm.formState.errors.senderEmail.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="message">Inquiry</Label>
              <TextArea
                className="dark:bg-gray-900 dark:placeholder:text-white/30"
                id="message"
                placeholder="Enter inquiry"
                rows={6}
                {...inquiryForm.register("message")}
              />
              {inquiryForm.formState.errors.message && (
                <p className="text-sm text-red-500 dark:text-red-500/90">
                  {inquiryForm.formState.errors.message.message}
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
              onClick={inquiryForm.handleSubmit(onSubmit)}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
