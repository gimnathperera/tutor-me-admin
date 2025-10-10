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

interface Subject {
  id?: string;
  title: string;
}

interface TutorDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  state?: string;
  region?: string;
  zip?: string;
  studentSchool?: string;
  preferredTutorType?: string;
  genderPreference?: string;
  bilingual?: string;
  createdAt?: string;
  grade?: { title: string; description?: string; subjects?: Subject[] }[];
  tutors?: {
    subjects?: Subject[];
    duration: string;
    frequency: string;
  }[];
}

interface ViewTutorProps {
  tutor: TutorDetails;
}

export function ViewTutor({ tutor }: ViewTutorProps) {
  const [open, setOpen] = useState(false);

  const displayFieldClass =
    "w-full rounded-md border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 min-h-[2rem] overflow-auto scrollbar-thin";

  const tagClass =
    "inline-block bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium mr-1 mb-1 px-2 py-1 rounded";

  const getSafeValue = (value: string | undefined | null, fallback = "N/A") =>
    value && value.trim() !== "" ? value : fallback;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Eye className="cursor-pointer text-blue-500 hover:text-blue-700" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 dark:text-white/90 scrollbar-thin">
        <DialogHeader>
          <DialogTitle>Tutor Request Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {/* General Info */}
          <div className="grid gap-3">
            <Label>Full Name</Label>
            <div className={displayFieldClass}>
              {getSafeValue(`${tutor.firstName} ${tutor.lastName}`)}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Email</Label>
            <div className={displayFieldClass}>{getSafeValue(tutor.email)}</div>
          </div>

          <div className="grid gap-3">
            <Label>Phone Number</Label>
            <div className={displayFieldClass}>
              {getSafeValue(tutor.phoneNumber)}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>City / Region / State / ZIP</Label>
            <div className={displayFieldClass}>
              {getSafeValue(
                `${tutor.city}, ${tutor.region || ""}, ${tutor.state || ""}, ${
                  tutor.zip || ""
                }`,
              )}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Student School</Label>
            <div className={displayFieldClass}>
              {getSafeValue(tutor.studentSchool)}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Preferred Tutor Type</Label>
            <div className={displayFieldClass}>
              {getSafeValue(tutor.preferredTutorType)}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Gender Preference</Label>
            <div className={displayFieldClass}>
              {getSafeValue(tutor.genderPreference)}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Bilingual</Label>
            <div className={displayFieldClass}>
              {getSafeValue(tutor.bilingual)}
            </div>
          </div>

          {/* Grades */}
          <div className="grid gap-3">
            <Label>Grades</Label>
            <div className="flex flex-wrap gap-1">
              {(tutor.grade || []).map((g, idx) => (
                <span key={idx} className={tagClass} title={g.description}>
                  {g.title}
                </span>
              ))}
            </div>
          </div>

          {/* Tutors & Subjects */}
          <div className="grid gap-3">
            <Label>Tutors</Label>
            <div className="flex flex-col gap-2">
              {(tutor.tutors || []).map((t, idx) => (
                <div key={idx} className="p-2 border rounded">
                  <div className="flex flex-wrap gap-1">
                    {(t.subjects || []).map((s, sidx) => (
                      <span key={sidx} className={tagClass}>
                        {s.title}
                      </span>
                    ))}
                  </div>
                  <div>
                    Duration: <strong>{t.duration}</strong>, Frequency:{" "}
                    <strong>{t.frequency}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Created At</Label>
            <div className={displayFieldClass}>
              {tutor.createdAt
                ? new Date(tutor.createdAt).toLocaleString()
                : "N/A"}
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
