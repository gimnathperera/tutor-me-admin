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
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import { useState } from "react";

interface AssignmentDetailsProps {
  assignment: {
    title: string;
    assignmentNumber: string;
    address: string;
    duration: string;
    assignmentPrice: string;
  };
}

export default function ViewDetails({ assignment }: AssignmentDetailsProps) {
  const [open, setOpen] = useState(false);

  const displayFieldClass =
    "w-full rounded-md border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Eye cursor="pointer" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] max-h-[80vh] scrollbar-thin overflow-y-auto bg-white z-50 dark:bg-gray-800 dark:text-white/90">
        <DialogHeader>
          <DialogTitle>Assignment Details</DialogTitle>
          <DialogDescription>Full details of the assignment</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Title</Label>
            <div className={cn(displayFieldClass)}>{assignment.title}</div>
          </div>

          <div className="grid gap-2">
            <Label>Assignment Number</Label>
            <div className={cn(displayFieldClass)}>
              {assignment.assignmentNumber}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Address</Label>
            <div className={cn(displayFieldClass)}>{assignment.address}</div>
          </div>

          <div className="grid gap-2">
            <Label>Duration</Label>
            <div className={cn(displayFieldClass)}>{assignment.duration}</div>
          </div>

          <div className="grid gap-2">
            <Label>Price</Label>
            <div className={cn(displayFieldClass)}>
              {assignment.assignmentPrice}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
