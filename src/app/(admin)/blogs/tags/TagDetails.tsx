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

interface TagDetailsProps {
  name: string;
  description: string;
}

export function TagDetails({ name, description }: TagDetailsProps) {
  const [open, setOpen] = useState(false);

  const displayFieldClass =
    "w-full rounded-md border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Eye cursor="pointer" className="text-blue-500 hover:text-blue-700" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white z-50 dark:bg-gray-800 dark:text-white/90">
        <DialogHeader>
          <DialogTitle>Details</DialogTitle>
          <DialogDescription>Tag Details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label>Title</Label>
            <div className={cn(displayFieldClass)}>{name}</div>
          </div>
          <div className="grid gap-3">
            <Label>Description</Label>
            <div
              className={cn(displayFieldClass, "min-h-[5rem]", "overflow-auto")}
            >
              {description}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
