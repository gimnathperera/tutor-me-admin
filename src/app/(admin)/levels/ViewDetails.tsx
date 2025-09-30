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

interface LevelDetailsProps {
  title: string;
  details?: string[];
  challanges?: string[];
  subjects?: Subject[];
}

export function LevelDetails({
  title,
  details = [],
  challanges = [],
  subjects = [],
}: LevelDetailsProps) {
  const [open, setOpen] = useState(false);

  const displayFieldClass =
    "w-full rounded-md border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Eye cursor="pointer" className="text-blue-500 hover:text-blue-700" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] scrollbar-thin overflow-y-auto bg-white z-[50] dark:bg-gray-800 dark:text-white/90">
        <DialogHeader>
          <DialogTitle>Level Details</DialogTitle>
          <DialogDescription>
            View the title, details, challenges, and subjects of this level.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label>Title</Label>
            <div className={displayFieldClass}>{title}</div>
          </div>

          <div className="grid gap-3">
            <Label>Details</Label>
            <div className={`${displayFieldClass} min-h-[5rem] overflow-auto`}>
              {details.length > 0 ? (
                <ul className="list-disc pl-5">
                  {details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              ) : (
                <div>No details</div>
              )}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Challenges</Label>
            <div className={`${displayFieldClass} min-h-[5rem] overflow-auto`}>
              {challanges.length > 0 ? (
                <ul className="list-disc pl-5">
                  {challanges.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              ) : (
                <div>No challenges</div>
              )}
            </div>
          </div>

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
