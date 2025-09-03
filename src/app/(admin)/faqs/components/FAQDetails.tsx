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
import { Copy, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

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

  const copyID = async () => {
    try {
      await navigator.clipboard.writeText(String(id));
      toast.success("FAQ ID copied to clipboard");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Eye className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] max-h-[75vh] scrollbar-thin overflow-y-auto bg-white z-50 dark:bg-gray-800 dark:text-white/90">
        <DialogHeader>
          <DialogTitle>Details</DialogTitle>
          <DialogDescription>FAQ Details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label>ID</Label>
            <div
              className={cn(
                "flex items-center justify-between cursor-pointer group",
                displayFieldClass,
              )}
              onClick={copyID}
            >
              <span>{id}</span>
              <span className="opacity-0 group-hover:opacity-100 text-gray-400 duration-300">
                ( Click to copy )
              </span>
              <Copy className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 text-gray-700 dark:text-gray-300 duration-300" />
            </div>
          </div>
          <div className="grid gap-3">
            <Label>Created At</Label>
            <div className={displayFieldClass}>
              {new Date(createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
          <div className="grid gap-3">
            <Label>Question</Label>
            <div className={displayFieldClass}>{question}</div>
          </div>
          <div className="grid gap-3">
            <Label>Answer</Label>
            <div className={cn("min-h-[5rem]", displayFieldClass)}>
              {answer}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
