"use client";

import { Button } from "@/components/ui/button";
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
import { useFetchRequestForTutorsByIdQuery } from "@/store/api/splits/request-tutor";
import { Eye } from "lucide-react";
import { useState } from "react";

interface ViewTutorProps {
  tutorId: string;
}

export function ViewTutorRequests({ tutorId }: ViewTutorProps) {
  const [open, setOpen] = useState(false);

  const { data: tutor, isLoading } = useFetchRequestForTutorsByIdQuery(tutorId);

  const displayFieldClass =
    "w-full rounded-md border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 min-h-[2rem] overflow-auto scrollbar-thin";

  const tagClass =
    "inline-block bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium mr-1 mb-1 px-2 py-1 rounded";

  if (isLoading) return <div>Loading...</div>;

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
          <div className="grid gap-3">
            <Label>Full Name</Label>
            <div className={displayFieldClass}>{tutor?.name ?? "N/A"}</div>
          </div>

          <div className="grid gap-3">
            <Label>Email</Label>
            <div className={displayFieldClass}>{tutor?.email ?? "N/A"}</div>
          </div>

          <div className="grid gap-3">
            <Label>Phone Number</Label>
            <div className={displayFieldClass}>
              {tutor?.phoneNumber ?? "N/A"}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Medium</Label>
            <div className={displayFieldClass}>{tutor?.medium ?? "N/A"}</div>
          </div>

          <div className="grid gap-3">
            <Label>District / City</Label>
            <div className={displayFieldClass}>
              {[tutor?.district, tutor?.city].filter(Boolean).join(", ") ||
                "N/A"}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Grades</Label>
            <div className="flex flex-wrap gap-1">
              {tutor?.grade?.map((g, idx) => (
                <span key={idx} className={tagClass} title={g.description}>
                  {g.title}
                </span>
              )) || <span className="text-gray-400 italic">No grades</span>}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Tutors</Label>
            <div className="flex flex-col gap-2">
              {tutor?.tutors?.map((t, idx) => (
                <div key={t._id || idx} className="p-2 border rounded">
                  <div className="flex flex-wrap gap-1">
                    Subjects:{" "}
                    {t.subjects?.map((s, sidx) => (
                      <span key={sidx} className={tagClass}>
                        {typeof s === "string" ? s : s.title}
                      </span>
                    ))}
                  </div>

                  {t.assignedTutor?.length ? (
                    <div>
                      Assigned Tutors:{" "}
                      {t.assignedTutor.map((a, aidx) => (
                        <span key={aidx} className={tagClass}>
                          {a.fullName}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {t.preferredTutorType && (
                    <div>
                      Preferred Type: <strong>{t.preferredTutorType}</strong>
                    </div>
                  )}
                  <div>
                    Duration: <strong>{t.duration}</strong>
                  </div>
                  <div>
                    Frequency: <strong>{t.frequency}</strong>
                  </div>
                </div>
              )) || <span className="text-gray-400 italic">No tutors</span>}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Created At</Label>
            <div className={displayFieldClass}>
              {tutor?.createdAt
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
