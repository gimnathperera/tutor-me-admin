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
  medium: string;
  subject: string;
  grade: string;
  year: string;
  url: string;
}

export function PaperDetails({
  title,
  medium,
  subject,
  grade,
  year,
  url,
}: PaperDetailsProps) {
  const [open, setOpen] = useState(false);

  const displayFieldClass =
    "w-full min-w-0 rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 break-words whitespace-pre-wrap overflow-x-hidden dark:border-gray-700 dark:bg-gray-700 dark:text-white/90";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Eye cursor="pointer" className="text-blue-500 hover:text-blue-700" />
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-[500px] max-h-[80vh] overflow-x-hidden overflow-y-auto scrollbar-thin bg-white z-50 dark:bg-gray-800 dark:text-white/90">
        <DialogHeader>
          <DialogTitle>Paper Details</DialogTitle>
          <DialogDescription>Information about this paper</DialogDescription>
        </DialogHeader>

        <div className="grid min-w-0 gap-4">
          <div className="grid min-w-0 gap-3">
            <Label>Title</Label>
            <div className={cn(displayFieldClass)}>{title}</div>
          </div>

          <div className="grid min-w-0 gap-3">
            <Label>Medium</Label>
            <div className={cn(displayFieldClass, "min-h-20")}>{medium}</div>
          </div>

          <div className="grid min-w-0 gap-3">
            <Label>Grade</Label>
            <div className={cn(displayFieldClass)}>{grade}</div>
          </div>

          <div className="grid min-w-0 gap-3">
            <Label>Subject</Label>
            <div className={cn(displayFieldClass)}>{subject}</div>
          </div>

          <div className="grid min-w-0 gap-3">
            <Label>Year</Label>
            <div className={cn(displayFieldClass)}>{year}</div>
          </div>

          <div className="grid min-w-0 gap-3">
            <Label>URL</Label>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                displayFieldClass,
                "block text-blue-600 underline break-all dark:text-blue-400",
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
