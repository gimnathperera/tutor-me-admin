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
import { Eye, Star } from "lucide-react";
import { useState } from "react";

interface TestimonialDetailsProps {
  content: string;
  rating: string | number;
  owner?: {
    name?: string;
    role?: string;
    avatar?: string;
  };
}

export function TestimonialDetails({
  content,
  rating,
  owner,
}: TestimonialDetailsProps) {
  const [open, setOpen] = useState(false);

  const displayFieldClass =
    "w-full rounded-md border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Eye cursor="pointer" className="text-blue-500 hover:text-blue-700" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] scrollbar-thin overflow-y-auto bg-white z-50 dark:bg-gray-800 dark:text-white/90 pb-9">
        <DialogHeader>
          <DialogTitle>Details</DialogTitle>
          <DialogDescription>Testimonial Details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {/* Owner Section */}
          <div className="grid gap-3">
            <Label>Owner</Label>
            <div className="flex items-center gap-3">
              {owner?.avatar ? (
                <img
                  src={owner.avatar || "/images/user/user.png"}
                  alt={owner.name || "Owner"}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-600">
                  ?
                </div>
              )}
              <div>
                <div className="font-medium">{owner?.name || "Unknown"}</div>
                <div className="text-xs text-gray-500">
                  {owner?.role || "No role"}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="grid gap-3">
            <Label>Content</Label>
            <div className={cn(displayFieldClass)}>
              {content || "No content provided"}
            </div>
          </div>

          {/* Rating Section */}
          <div className="grid gap-3">
            <Label>Rating</Label>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={30}
                  className={
                    i < Number(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
