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
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import { useState } from "react";

interface ViewTutorProps {
  tutor: {
    fullName: string;
    email: string;
    contactNumber: string;
    dateOfBirth: string;
    gender: string;
    age: number;
    nationality: string;
    race: string;
    last4NRIC: string;
    tutorType: string;
    yearsExperience: number;
    highestEducation: string;
    academicDetails: string;
    teachingSummary: string;
    studentResults: string;
    sellingPoints: string;
    tutoringLevels: string[];
    preferredLocations: string[];
    agreeTerms: boolean;
    agreeAssignmentInfo: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export function ViewTutor({ tutor }: ViewTutorProps) {
  const [open, setOpen] = useState(false);

  const displayFieldClass =
    "w-full rounded-md border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Eye className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white z-50 dark:bg-gray-800 dark:text-white/90">
        <DialogHeader>
          <DialogTitle>Tutor Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 max-h-[70vh] overflow-y-auto">
          {/* General Info */}
          <div className="grid gap-2">
            <Label>Full Name</Label>
            <div className={cn(displayFieldClass)}>{tutor.fullName}</div>
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <div className={cn(displayFieldClass)}>{tutor.email}</div>
          </div>
          <div className="grid gap-2">
            <Label>Contact Number</Label>
            <div className={cn(displayFieldClass)}>{tutor.contactNumber}</div>
          </div>
          <div className="grid gap-2">
            <Label>Date of Birth</Label>
            <div className={cn(displayFieldClass)}>
              {new Date(tutor.dateOfBirth).toLocaleDateString()}
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Gender</Label>
            <div className={cn(displayFieldClass)}>{tutor.gender}</div>
          </div>
          <div className="grid gap-2">
            <Label>Age</Label>
            <div className={cn(displayFieldClass)}>{tutor.age}</div>
          </div>
          <div className="grid gap-2">
            <Label>Nationality</Label>
            <div className={cn(displayFieldClass)}>{tutor.nationality}</div>
          </div>
          <div className="grid gap-2">
            <Label>Race</Label>
            <div className={cn(displayFieldClass)}>{tutor.race}</div>
          </div>
          <div className="grid gap-2">
            <Label>Last 4 NRIC</Label>
            <div className={cn(displayFieldClass)}>{tutor.last4NRIC}</div>
          </div>

          {/* Tutor Info */}
          <div className="grid gap-2">
            <Label>Tutor Type</Label>
            <div className={cn(displayFieldClass)}>{tutor.tutorType}</div>
          </div>
          <div className="grid gap-2">
            <Label>Years of Experience</Label>
            <div className={cn(displayFieldClass)}>{tutor.yearsExperience}</div>
          </div>
          <div className="grid gap-2">
            <Label>Highest Education</Label>
            <div className={cn(displayFieldClass)}>
              {tutor.highestEducation}
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Academic Details</Label>
            <div className={cn(displayFieldClass)}>{tutor.academicDetails}</div>
          </div>
          <div className="grid gap-2">
            <Label>Teaching Summary</Label>
            <div className={cn(displayFieldClass)}>{tutor.teachingSummary}</div>
          </div>
          <div className="grid gap-2">
            <Label>Student Results</Label>
            <div className={cn(displayFieldClass)}>{tutor.studentResults}</div>
          </div>
          <div className="grid gap-2">
            <Label>Selling Points</Label>
            <div className={cn(displayFieldClass)}>{tutor.sellingPoints}</div>
          </div>

          {/* Arrays */}
          <div className="grid gap-2">
            <Label>Tutoring Levels</Label>
            <div className={cn(displayFieldClass)}>
              {tutor.tutoringLevels.join(", ")}
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Preferred Locations</Label>
            <div className={cn(displayFieldClass)}>
              {tutor.preferredLocations.join(", ")}
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
