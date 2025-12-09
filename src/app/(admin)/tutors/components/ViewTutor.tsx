"use client";

import { formatYearsExperience } from "@/app/(admin)/tutors/constants";
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
import { useFetchGradesQuery } from "@/store/api/splits/grades";
import { Eye } from "lucide-react";
import { useMemo, useState } from "react";

type ArrayItem =
  | string
  | number
  | null
  | undefined
  | { id?: string; title?: string; name?: string };

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
    tutoringLevels?: string[] | { id?: string; title?: string }[];
    preferredLocations?: string[] | { id?: string; title?: string }[];
    agreeTerms?: boolean;
    agreeAssignmentInfo?: boolean;
    createdAt?: string;
    updatedAt?: string;
    tutorMediums?: string[] | { id?: string; title?: string }[];
    grades?: string[] | { id?: string; title?: string }[];
    subjects?: string[] | { id?: string; title?: string }[];
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

  const normalizeArrayToStrings = (arr?: ArrayItem[]) => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.map((it) => {
      if (typeof it === "string") return it;
      if (typeof it === "number") return String(it);
      if (it == null) return "N/A";
      return it.title ?? it.name ?? it.id ?? JSON.stringify(it);
    });
  };

  const mediumList = normalizeArrayToStrings(tutor.tutorMediums);
  const levels = normalizeArrayToStrings(tutor.tutoringLevels);
  const locations = normalizeArrayToStrings(tutor.preferredLocations);
  const { data: gradesData } = useFetchGradesQuery({ page: 1, limit: 200 });

  const { gradeIdToTitle, subjectIdToTitle } = useMemo(() => {
    const gradeMap = new Map<string, string>();
    const subjectMap = new Map<string, string>();

    const grades = gradesData?.results ?? [];
    for (const g of grades) {
      if (g?.id) gradeMap.set(g.id, g.title ?? String(g.id));
      if (Array.isArray((g as any).subjects)) {
        (g as any).subjects.forEach((s: any) => {
          if (s?.id) subjectMap.set(s.id, s.title ?? s.id);
        });
      }
    }
    return {
      gradeIdToTitle: gradeMap,
      subjectIdToTitle: subjectMap,
    };
  }, [gradesData]);

  const gradeList = useMemo(() => {
    if (!tutor?.grades || !Array.isArray(tutor.grades)) return [];
    return tutor.grades.map((g) => {
      if (typeof g === "string") {
        return gradeIdToTitle.get(g) ?? g;
      }
      if (typeof g === "object" && g != null) {
        return (g as any).title ?? (g as any).id ?? String(g);
      }
      return String(g);
    });
  }, [tutor?.grades, gradeIdToTitle]);

  const subjectList = useMemo(() => {
    if (!tutor?.subjects || !Array.isArray(tutor.subjects)) return [];
    return tutor.subjects.map((s) => {
      if (typeof s === "string") {
        const fromMap = subjectIdToTitle.get(s);
        if (fromMap) return fromMap;
        for (const g of gradesData?.results ?? []) {
          const found = (g as any).subjects?.find((sub: any) => sub.id === s);
          if (found) return found.title ?? found.id ?? String(s);
        }
        return s;
      }
      if (typeof s === "object" && s != null) {
        return (s as any).title ?? (s as any).id ?? String(s);
      }
      return String(s);
    });
  }, [tutor?.subjects, subjectIdToTitle, gradesData]);

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
                {(() => {
                  const formatted = formatYearsExperience(
                    tutor.yearsExperience,
                  );
                  return formatted === "" ? "N/A" : formatted;
                })()}
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

          <div className="grid gap-3">
            <Label>Tutor Mediums</Label>
            <div className="flex flex-wrap">
              {mediumList.length === 0 ? (
                <span className={tagClass}>N/A</span>
              ) : (
                mediumList.map((m, i) => (
                  <span key={i} className={tagClass}>
                    {m}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Grades</Label>
            <div className="flex flex-wrap">
              {gradeList.length === 0 ? (
                <span className={tagClass}>N/A</span>
              ) : (
                gradeList.map((g, i) => (
                  <span key={i} className={tagClass}>
                    {g}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Subjects</Label>
            <div className="flex flex-wrap">
              {subjectList.length === 0 ? (
                <span className={tagClass}>N/A</span>
              ) : (
                subjectList.map((s, i) => (
                  <span key={i} className={tagClass}>
                    {s}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Tutoring Levels</Label>
            <div className="flex flex-wrap">
              {levels.length === 0 ? (
                <span className={tagClass}>N/A</span>
              ) : (
                levels.map((level, idx) => (
                  <span key={idx} className={tagClass}>
                    {level}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Preferred Locations</Label>
            <div className="flex flex-wrap">
              {locations.length === 0 ? (
                <span className={tagClass}>N/A</span>
              ) : (
                locations.map((loc, idx) => (
                  <span key={idx} className={tagClass}>
                    {loc}
                  </span>
                ))
              )}
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
