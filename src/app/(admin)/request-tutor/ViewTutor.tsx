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

  const { data: tutor, isLoading } = useFetchRequestForTutorsByIdQuery(tutorId, {
    skip: !open || !tutorId,
  });

  const displayFieldClass =
    "w-full rounded-md border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90 min-h-[2rem] overflow-auto scrollbar-thin";

  const tagClass =
    "inline-block bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium mr-1 mb-1 px-2 py-1 rounded";

  const getSafeValue = (value: unknown, fallback = "N/A") => {
    if (value === undefined || value === null) {
      return fallback;
    }

    const stringValue = String(value).trim();
    return stringValue === "" ? fallback : stringValue;
  };

  const getAssignedTutorLabel = (assignedTutor: unknown) => {
    if (!assignedTutor) {
      return "";
    }

    if (typeof assignedTutor === "string") {
      return assignedTutor.trim();
    }

    if (Array.isArray(assignedTutor)) {
      return assignedTutor
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          if (item && typeof item === "object" && "fullName" in item) {
            return String(item.fullName ?? "");
          }

          return "";
        })
        .filter(Boolean)
        .join(", ");
    }

    if (typeof assignedTutor === "object" && "fullName" in assignedTutor) {
      return String(assignedTutor.fullName ?? "");
    }

    return "";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Eye className="cursor-pointer text-blue-500 hover:text-blue-700" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 dark:text-white/90 scrollbar-thin">
        <DialogHeader>
          <DialogTitle>Tutor Request Details</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="text-sm text-gray-500 dark:text-white/70">
            Loading request details...
          </div>
        )}

        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label>Full Name</Label>
            <div className={displayFieldClass}>{getSafeValue(tutor?.name)}</div>
          </div>

          <div className="grid gap-3">
            <Label>Email</Label>
            <div className={displayFieldClass}>{getSafeValue(tutor?.email)}</div>
          </div>

          <div className="grid gap-3">
            <Label>Phone Number</Label>
            <div className={displayFieldClass}>{getSafeValue(tutor?.phoneNumber)}</div>
          </div>

          <div className="grid gap-3">
            <Label>Medium</Label>
            <div className={displayFieldClass}>{getSafeValue(tutor?.medium)}</div>
          </div>

          <div className="grid gap-3">
            <Label>District / City</Label>
            <div className={displayFieldClass}>
              {[getSafeValue(tutor?.district, ""), getSafeValue(tutor?.city, "")]
                .filter(Boolean)
                .join(", ") ||
                "N/A"}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Grade</Label>
            <div className={displayFieldClass}>
              {getSafeValue(tutor?.grade, "") || (
                <span className="text-gray-400 italic">No grade</span>
              )}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Status</Label>
            <div className={displayFieldClass}>{getSafeValue(tutor?.status)}</div>
          </div>

          <div className="grid gap-3">
            <Label>Tutors</Label>
            <div className="flex flex-col gap-2">
              {Array.isArray(tutor?.tutors) && tutor.tutors.length ? (
                tutor.tutors.map((t, idx) => {
                  const assignedTutorLabel = getAssignedTutorLabel(t.assignedTutor);

                  return (
                    <div key={t._id || idx} className="p-3 border rounded space-y-1 bg-gray-50 dark:bg-gray-700">
                      <div>
                        Subject:{" "}
                        <span className={tagClass}>{getSafeValue(t.subject)}</span>
                      </div>

                      {assignedTutorLabel && (
                        <div>
                          Assigned Tutor:{" "}
                          <span className={`${tagClass} bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200`}>
                            {assignedTutorLabel}
                          </span>
                        </div>
                      )}

                      {t.preferredTutorType && (
                        <div>
                          Preferred Type: <strong>{getSafeValue(t.preferredTutorType)}</strong>
                        </div>
                      )}
                      <div>
                        Duration: <strong>{getSafeValue(t.duration)}</strong>
                      </div>
                      <div>
                        Frequency: <strong>{getSafeValue(t.frequency)}</strong>
                      </div>
                    </div>
                  );
                })
              ) : (
                <span className="text-gray-400 italic">No tutors</span>
              )}
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
