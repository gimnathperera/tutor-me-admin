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
import { Eye } from "lucide-react";
import { useState } from "react";

interface Subject {
  id: string;
  title: string;
}

interface GradeDetailsProps {
  title: string;
  description: string;
  subjects?: Subject[];
}

export function GradeDetails({
  title,
  description,
  subjects = [],
}: GradeDetailsProps) {
  const [open, setOpen] = useState(false);

  const displayFieldClass =
    "w-full rounded-md border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Eye cursor="pointer " className="text-blue-500 hover:text-blue-700" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[75vh] overflow-hidden bg-white z-50 dark:bg-gray-800 dark:text-white/90 p-0 [&>div:last-child]:flex [&>div:last-child]:min-h-0 [&>div:last-child]:flex-col [&>div:last-child]:overflow-hidden [&>div:last-child]:p-0">
        <DialogHeader className="shrink-0 px-6 py-4 border-b bg-white dark:bg-gray-800">
          <DialogTitle>Grade Details</DialogTitle>
          <DialogDescription>
            View the title, description, and subjects of this grade.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin px-6 py-4 grid gap-4">
          {/* Title */}
          <div className="grid gap-3">
            <Label>Title</Label>
            <div className={displayFieldClass}>{title}</div>
          </div>

          {/* Description */}
          <div className="grid gap-3">
            <Label>Description</Label>
            <div className={`${displayFieldClass} min-h-20 overflow-auto`}>
              {description}
            </div>
          </div>

          {/* Subjects as display fields */}
          <div className="grid gap-3">
            <Label>Subjects</Label>
            <div className="flex flex-col gap-2">
              {subjects.length > 0 ? (
                subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className={displayFieldClass}
                    title={subject.title}
                  >
                    {subject.title}
                  </div>
                ))
              ) : (
                <div className={displayFieldClass}>No subjects</div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
