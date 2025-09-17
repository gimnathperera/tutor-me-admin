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
  level: EntityRef;
  grade: EntityRef;
  subject: EntityRef;
  fullTimeTuitionRate?: TuitionRate[];
  govTuitionRate?: TuitionRate[];
  partTimeTuitionRate?: TuitionRate[];
}

export function TuitionRateDetails({
  level,
  grade,
  subject,
  fullTimeTuitionRate = [],
  govTuitionRate = [],
  partTimeTuitionRate = [],
}: TuitionRateDetailsProps) {
  const [open, setOpen] = useState(false);

  const displayFieldClass =
    "w-full rounded-md border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90";

  const renderRateList = (rates: TuitionRate[]) =>
    rates.length > 0 ? (
      rates.map((rate, idx) => (
        <div key={idx} className={displayFieldClass}>
          Min: Rs. {rate.minimumRate} <br /> Max: Rs. {rate.maximumRate}
        </div>
      ))
    ) : (
      <div className={displayFieldClass}>No rates</div>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Eye className="cursor-pointer" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[80vh] scrollbar-thin overflow-y-auto bg-white z-[9999] dark:bg-gray-800 dark:text-white/90">
        <DialogHeader>
          <DialogTitle>Tuition Rate Details</DialogTitle>
          <DialogDescription>
            View the level, grade, subject, and tuition rates.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label>Level</Label>
            <div className={displayFieldClass}>{level.title}</div>
          </div>
          <div className="grid gap-3">
            <Label>Grade</Label>
            <div className={displayFieldClass}>{grade.title}</div>
          </div>
          <div className="grid gap-3">
            <Label>Subject</Label>
            <div className={displayFieldClass}>{subject.title}</div>
          </div>
          <div className="grid gap-3">
            <Label>Full-Time Tuition Rate</Label>
            <div className="flex flex-col gap-2">
              {renderRateList(fullTimeTuitionRate)}
            </div>
          </div>
          <div className="grid gap-3">
            <Label>Government Tuition Rate</Label>
            <div className="flex flex-col gap-2">
              {renderRateList(govTuitionRate)}
            </div>
          </div>
          <div className="grid gap-3">
            <Label>Part-Time Tuition Rate</Label>
            <div className="flex flex-col gap-2">
              {renderRateList(partTimeTuitionRate)}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
