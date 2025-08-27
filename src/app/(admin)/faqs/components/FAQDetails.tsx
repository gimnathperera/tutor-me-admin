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
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";
import { useState } from "react";

interface FAQDetailsProps {
  id: string | number;
  question: string;
  answer: string;
  createdAt: string;
}

export function FAQDetails({
  id,
  question,
  answer,
  createdAt,
}: FAQDetailsProps) {
  const [open, setOpen] = useState(false);

  const displayFieldClass =
    "w-full rounded-md border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Eye className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] max-h-[75vh] scrollbar-thin overflow-y-auto bg-white z-[9999] dark:bg-gray-800 dark:text-white/90">
        <DialogHeader >
          <DialogTitle >Details</DialogTitle>
          <DialogDescription>FAQ Details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label>ID</Label>
            <div className={displayFieldClass}>{id}</div>
          </div>
          <div className="grid gap-3">
            <Label>Created At</Label>
            <div className={displayFieldClass}>{createdAt}</div>
          </div>
          <div className="grid gap-3">
            <Label>Question</Label>
            <div className={displayFieldClass}>{question}</div>
          </div>
          <div className="grid gap-3">
            <Label>Answer</Label>
            <div className={`${displayFieldClass} min-h-[5rem]`}>{answer}</div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
