"use client";

import { Button } from "@/components/ui/button";
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
import { useFetchGradeByIdQuery } from "@/store/api/splits/grades";
import {
  useFetchRequestForTutorsByIdQuery,
  useGenerateTutorMatchReportMutation,
} from "@/store/api/splits/request-tutor";
import { useFetchSubjectsQuery } from "@/store/api/splits/subjects";
import { CheckCircle2, Eye, Loader2, Mail } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  formatTutorMatchReportSummaryText,
  normalizeTutorMatchReportSummary,
  type MatchReportSummary,
} from "./match-report";

interface ViewTutorProps {
  tutorId: string;
}

export function ViewTutorRequests({ tutorId }: ViewTutorProps) {
  const [open, setOpen] = useState(false);
  const [reportSummary, setReportSummary] = useState<MatchReportSummary | null>(
    null,
  );
  const [generateTutorMatchReport, { isLoading: isGeneratingReport }] =
    useGenerateTutorMatchReportMutation();

  const { data: tutor, isLoading } = useFetchRequestForTutorsByIdQuery(
    tutorId,
    {
      skip: !open || !tutorId,
    },
  );
  const gradeId = typeof tutor?.grade === "string" ? tutor.grade.trim() : "";
  const isGradeId = /^[a-f\d]{24}$/i.test(gradeId);
  const { data: grade, isFetching: isFetchingGrade } = useFetchGradeByIdQuery(
    gradeId,
    {
      skip: !open || !isGradeId,
    },
  );
  const { data: subjectsData, isFetching: isFetchingSubjects } =
    useFetchSubjectsQuery(
      {
        page: 1,
        limit: 10000,
      },
      {
        skip: !open,
      },
    );
  const subjectTitleById = useMemo(
    () =>
      new Map(
        (subjectsData?.results || []).map((subject) => [
          subject.id,
          subject.title,
        ]),
      ),
    [subjectsData?.results],
  );

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

  const getGradeDisplayValue = (value: unknown) => {
    if (value && typeof value === "object") {
      const gradeRecord = value as {
        id?: string;
        title?: string;
        name?: string;
      };
      return getSafeValue(
        gradeRecord.title || gradeRecord.name || gradeRecord.id,
        "",
      );
    }

    const safeGrade = getSafeValue(value, "");
    if (!safeGrade) {
      return "";
    }

    if (!isGradeId) {
      return safeGrade;
    }

    return (
      grade?.title || (isFetchingGrade ? "Loading grade..." : "Unknown grade")
    );
  };

  const getSubjectDisplayValue = (value: unknown) => {
    if (value && typeof value === "object") {
      const subjectRecord = value as {
        id?: string;
        title?: string;
        name?: string;
      };
      return getSafeValue(
        subjectRecord.title || subjectRecord.name || subjectRecord.id,
        "",
      );
    }

    const subjectId = getSafeValue(value, "");
    if (!subjectId) {
      return "";
    }

    const subjectTitle = subjectTitleById.get(subjectId);
    if (subjectTitle) {
      return subjectTitle;
    }

    return isFetchingSubjects ? "Loading subject..." : "Unknown subject";
  };

  const handleGenerateTutorMatchReport = async () => {
    try {
      const response = await generateTutorMatchReport({
        requestId: tutorId,
      }).unwrap();
      const summary = normalizeTutorMatchReportSummary(response);
      setReportSummary(summary);
      toast.success(
        `Tutor match report sent successfully${formatTutorMatchReportSummaryText(summary) ? `: ${formatTutorMatchReportSummaryText(summary)}` : ""}`,
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate tutor match report");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Eye className="cursor-pointer text-blue-500 hover:text-blue-700" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-hidden bg-white dark:bg-gray-800 dark:text-white/90 p-0">
        <DialogHeader className="sticky top-0 z-10 bg-white dark:bg-gray-800 px-6 pt-6 pb-4 border-b">
          <DialogTitle>Tutor Request Details</DialogTitle>
          <DialogDescription>
            Review the request details, generate a tutor match report, and
            inspect the suggested tutor blocks.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(80vh-170px)] overflow-y-auto px-6 py-4 scrollbar-thin">
          {isLoading && (
            <div className="text-sm text-gray-500 dark:text-white/70">
              Loading request details...
            </div>
          )}

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label>Full Name</Label>
              <div className={displayFieldClass}>
                {getSafeValue(tutor?.name)}
              </div>
            </div>

            <div className="grid gap-3">
              <Label>Email</Label>
              <div className={displayFieldClass}>
                {getSafeValue(tutor?.email)}
              </div>
            </div>

            <div className="grid gap-3">
              <Label>Phone Number</Label>
              <div className={displayFieldClass}>
                {getSafeValue(tutor?.phoneNumber)}
              </div>
            </div>

            <div className="grid gap-3">
              <Label>Medium</Label>
              <div className={displayFieldClass}>
                {getSafeValue(tutor?.medium)}
              </div>
            </div>

            <div className="grid gap-3">
              <Label>District / City</Label>
              <div className={displayFieldClass}>
                {[
                  getSafeValue(tutor?.district, ""),
                  getSafeValue(tutor?.city, ""),
                ]
                  .filter(Boolean)
                  .join(", ") || "N/A"}
              </div>
            </div>

            <div className="grid gap-3">
              <Label>Grade</Label>
              <div className={displayFieldClass}>
                {getGradeDisplayValue(tutor?.grade) || (
                  <span className="text-gray-400 italic">No grade</span>
                )}
              </div>
            </div>

            <div className="grid gap-3">
              <Label>Status</Label>
              <div className={displayFieldClass}>
                {getSafeValue(tutor?.status)}
              </div>
            </div>

            <div className="grid gap-3">
              <Label>Tutors</Label>
              <div className="flex flex-col gap-2">
                {Array.isArray(tutor?.tutors) && tutor.tutors.length ? (
                  tutor.tutors.map((t, idx) => {
                    const assignedTutorLabel = getAssignedTutorLabel(
                      t.assignedTutor,
                    );

                    return (
                      <div
                        key={t._id || idx}
                        className="p-3 border rounded space-y-1 bg-gray-50 dark:bg-gray-700"
                      >
                        <div>
                          Subject:{" "}
                          <span className={tagClass}>
                            {getSubjectDisplayValue(t.subject)}
                          </span>
                        </div>

                        {assignedTutorLabel && (
                          <div>
                            Assigned Tutor:{" "}
                            <span
                              className={`${tagClass} bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200`}
                            >
                              {assignedTutorLabel}
                            </span>
                          </div>
                        )}

                        {t.preferredTutorType && (
                          <div>
                            Preferred Type:{" "}
                            <strong>
                              {getSafeValue(t.preferredTutorType)}
                            </strong>
                          </div>
                        )}
                        <div>
                          Duration: <strong>{getSafeValue(t.duration)}</strong>
                        </div>
                        <div>
                          Frequency:{" "}
                          <strong>{getSafeValue(t.frequency)}</strong>
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
          {reportSummary && (
            <div className="grid mt-4 gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                <p className="text-sm font-semibold">Tutor Match Report sent</p>
              </div>
              {reportSummary.adminEmail && (
                <p className="text-sm text-emerald-800 dark:text-emerald-200">
                  Admin email:{" "}
                  <span className="font-medium">
                    {reportSummary.adminEmail}
                  </span>
                </p>
              )}
              {reportSummary.message && (
                <p className="text-sm text-emerald-800 dark:text-emerald-200">
                  {reportSummary.message}
                </p>
              )}
              <div className="space-y-2">
                {reportSummary.blocks.length > 0 ? (
                  reportSummary.blocks.map((block) => (
                    <div
                      key={`${block.label}-${block.matchedCount}`}
                      className="flex items-center justify-between rounded-md bg-white/80 px-3 py-2 text-sm text-emerald-950 dark:bg-emerald-900/30 dark:text-emerald-100"
                    >
                      <span className="font-medium">{block.label}</span>
                      <span>
                        {block.matchedCount} matched tutor
                        {block.matchedCount === 1 ? "" : "s"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-emerald-800 dark:text-emerald-200">
                    The report was generated, but the response did not include
                    block-level counts.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="sticky bottom-0 z-10 bg-white dark:bg-gray-800 px-6 py-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleGenerateTutorMatchReport}
            disabled={isGeneratingReport || isLoading}
            className="gap-2"
          >
            {isGeneratingReport ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            {isGeneratingReport
              ? "Generating..."
              : "Generate Tutor Match Report"}
          </Button>

          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
