"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import { useState } from "react";

interface PaperDetailsProps {
  title: string;
  description: string;
  subject: string;
  grade: string;
  year: string;
  url: string;
}

export function PaperDetails({
  title,
  description,
  subject,
  grade,
  year,
  url,
}: PaperDetailsProps) {
  const [open, setOpen] = useState(false);

  console.log(subject, grade);

  const displayFieldClass =
    "w-full rounded-md border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Eye cursor="pointer" className="text-blue-500 hover:text-blue-700" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] scrollbar-thin overflow-y-auto bg-white z-50 dark:bg-gray-800 dark:text-white/90">
        <DialogHeader>
          <DialogTitle>Paper Details</DialogTitle>
          <DialogDescription>Information about this paper</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 overflow-y-auto">
          <div className="grid gap-3">
            <Label>Title</Label>
            <div className={cn(displayFieldClass)}>{title}</div>
          </div>

          <div className="grid gap-3">
            <Label>Description</Label>
            <div
              className={cn(displayFieldClass, "min-h-[5rem]", "overflow-auto")}
            >
              {description}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Grade</Label>
            <div className={cn(displayFieldClass)}>{grade}</div>
          </div>

          <div className="grid gap-3">
            <Label>Subject</Label>
            <div className={cn(displayFieldClass)}>{subject}</div>
          </div>

          <div className="grid gap-3">
            <Label>Year</Label>
            <div className={cn(displayFieldClass)}>{year}</div>
          </div>

          <div className="grid gap-3">
            <Label>URL</Label>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                displayFieldClass,
                "text-blue-600 dark:text-blue-400 underline",
              )}
            >
              {url}
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
