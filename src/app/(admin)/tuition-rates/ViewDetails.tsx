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

interface TuitionRate {
  minimumRate: string;
  maximumRate: string;
}

interface EntityRef {
  id: string;
  title: string;
}

interface TuitionRateDetailsProps {
  grade: EntityRef;
  subject: EntityRef;
  universityStudentsRate?: TuitionRate;
  partTimeTutorRate?: TuitionRate;
  fullTimeTutorRate?: TuitionRate;
  moeTeacherRate?: TuitionRate;
}

export function TuitionRateDetails({
  grade,
  subject,
  universityStudentsRate,
  partTimeTutorRate,
  fullTimeTutorRate,
  moeTeacherRate,
}: TuitionRateDetailsProps) {
  const [open, setOpen] = useState(false);

  const displayFieldClass =
    "w-full rounded-md border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90";

  const renderRate = (rate?: TuitionRate) =>
    rate ? (
      <div className={displayFieldClass}>
        Min: Rs. {rate.minimumRate} <br /> Max: Rs. {rate.maximumRate}
      </div>
    ) : (
      <div className={displayFieldClass}>No rates</div>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Eye className="cursor-pointer text-blue-500 hover:text-blue-700" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-white z-9999 dark:bg-gray-800 dark:text-white/90 p-0 overflow-hidden [&>div:last-child]:flex [&>div:last-child]:min-h-0 [&>div:last-child]:flex-col [&>div:last-child]:overflow-hidden [&>div:last-child]:p-0">
        <DialogHeader className="shrink-0 px-6 py-4 border-b bg-white dark:bg-gray-800">
          <DialogTitle>Tuition Rate Details</DialogTitle>
          <DialogDescription>
            View the grade, subject, and tuition rates.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin px-6 py-6 grid gap-4">
          <div className="grid gap-3">
            <Label>Grade</Label>
            <div className={displayFieldClass}>{grade.title}</div>
          </div>
          <div className="grid gap-3">
            <Label>Subject</Label>
            <div className={displayFieldClass}>{subject.title}</div>
          </div>
          <div className="grid gap-3">
            <Label>University Students Rate</Label>
            {renderRate(universityStudentsRate)}
          </div>
          <div className="grid gap-3">
            <Label>Part-Time Tutor Rate</Label>
            {renderRate(partTimeTutorRate)}
          </div>
          <div className="grid gap-3">
            <Label>Full-Time Tutor Rate</Label>
            {renderRate(fullTimeTutorRate)}
          </div>
          <div className="grid gap-3">
            <Label>Ex/Current MOE Teacher Rate</Label>
            {renderRate(moeTeacherRate)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
