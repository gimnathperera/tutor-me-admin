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
import { Ellipsis } from "lucide-react";
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
        <Ellipsis className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white z-[9999] dark:bg-gray-800 dark:text-white/90">
        <DialogHeader>
          <DialogTitle>Grade Details</DialogTitle>
          <DialogDescription>
            View the title, description, and subjects of this grade.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Title */}
          <div className="grid gap-3">
            <Label>Title</Label>
            <div className={displayFieldClass}>{title}</div>
          </div>

          {/* Description */}
          <div className="grid gap-3">
            <Label>Description</Label>
            <div className={`${displayFieldClass} min-h-[5rem] overflow-auto`}>
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

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
