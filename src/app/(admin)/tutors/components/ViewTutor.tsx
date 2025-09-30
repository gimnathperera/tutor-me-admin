"use client";

import { Button } from "@/components/ui/button/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";
import { useState } from "react";

interface ViewTutorProps {
  tutor: {
    fullName?: string;
    email?: string;
    contactNumber?: string;
    dateOfBirth?: string;
    gender?: string;
    age?: number;
    nationality?: string;
    race?: string;
    last4NRIC?: string;
    tutorType?: string;
    yearsExperience?: number;
    highestEducation?: string;
    academicDetails?: string;
    teachingSummary?: string;
    studentResults?: string;
    sellingPoints?: string;
    tutoringLevels?: string[];
    preferredLocations?: string[];
    agreeTerms?: boolean;
    agreeAssignmentInfo?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
}

export function ViewTutor({ tutor }: ViewTutorProps) {
  const [open, setOpen] = useState(false);

  const displayFieldClass =
    "w-full rounded-md border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 min-h-[2rem] overflow-auto scrollbar-thin";

  const tagClass =
    "inline-block bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium mr-1 mb-1 px-2 py-1 rounded";

  const getSafeValue = (
    value: string | number | undefined | null,
    fallback = "N/A",
  ) =>
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "")
      ? fallback
      : value;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Eye className="cursor-pointer text-blue-500 hover:text-blue-700" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 dark:text-white/90 scrollbar-thin">
        <DialogHeader>
          <DialogTitle>Tutor Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {/** General Info */}
          <div className="grid gap-3">
            <Label>Full Name</Label>
            <div className={displayFieldClass}>
              {getSafeValue(tutor.fullName)}
            </div>
          </div>
          <div className="grid gap-3">
            <Label>Email</Label>
            <div className={displayFieldClass}>{getSafeValue(tutor.email)}</div>
          </div>
          <div className="grid gap-3">
            <Label>Contact Number</Label>
            <div className={displayFieldClass}>
              {getSafeValue(tutor.contactNumber)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-3">
              <Label>Date of Birth</Label>
              <div className={displayFieldClass}>
                {tutor.dateOfBirth
                  ? new Date(tutor.dateOfBirth)
                      .toLocaleDateString("en-CA")
                      .replace(/-/g, "/")
                  : "N/A"}
              </div>
            </div>
            <div className="grid gap-3">
              <Label>Gender</Label>
              <div className={displayFieldClass}>
                {getSafeValue(tutor.gender)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-3">
              <Label>Age</Label>
              <div className={displayFieldClass}>{getSafeValue(tutor.age)}</div>
            </div>
            <div className="grid gap-3">
              <Label>Nationality</Label>
              <div className={displayFieldClass}>
                {getSafeValue(tutor.nationality)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-3">
              <Label>Race</Label>
              <div className={displayFieldClass}>
                {getSafeValue(tutor.race)}
              </div>
            </div>
            <div className="grid gap-3">
              <Label>Last 4 NRIC</Label>
              <div className={displayFieldClass}>
                {getSafeValue(tutor.last4NRIC)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-3">
              <Label>Tutor Type</Label>
              <div className={displayFieldClass}>
                {getSafeValue(tutor.tutorType)}
              </div>
            </div>
            <div className="grid gap-3">
              <Label>Years of Experience</Label>
              <div className={displayFieldClass}>
                {getSafeValue(tutor.yearsExperience)}
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Highest Education</Label>
            <div className={displayFieldClass}>
              {getSafeValue(tutor.highestEducation)}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Academic Details</Label>
            <div className={displayFieldClass}>
              {getSafeValue(tutor.academicDetails)}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Teaching Summary</Label>
            <div className={displayFieldClass}>
              {getSafeValue(tutor.teachingSummary)}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Student Results</Label>
            <div className={displayFieldClass}>
              {getSafeValue(tutor.studentResults)}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Selling Points</Label>
            <div className={displayFieldClass}>
              {getSafeValue(tutor.sellingPoints)}
            </div>
          </div>

          {/** Arrays */}
          <div className="grid gap-3">
            <Label>Tutoring Levels</Label>
            <div className="flex flex-wrap">
              {(tutor.tutoringLevels || []).map((level, idx) => (
                <span key={idx} className={tagClass}>
                  {level}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Preferred Locations</Label>
            <div className="flex flex-wrap">
              {(tutor.preferredLocations || []).map((loc, idx) => (
                <span key={idx} className={tagClass}>
                  {loc}
                </span>
              ))}
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
