"use client";

import DataTable, { Column } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CLASS_TYPE_OPTIONS,
  TUTOR_MEDIUM_OPTIONS,
  TUTOR_TYPE_OPTIONS,
} from "@/configs/app-constants";
import { TABLE_CONFIG } from "@/configs/table";
import { useDebounce } from "@/hooks/useDebounce";
import { useFetchGradesQuery } from "@/store/api/splits/grades";
import {
  useFetchRequestForTutorsQuery,
  useGenerateTutorMatchReportMutation,
} from "@/store/api/splits/request-tutor";
import { useFetchSubjectsQuery } from "@/store/api/splits/subjects";
import { FetchRequestForTutor } from "@/types/request-types";
import { RequestTutors } from "@/types/response-types";
import { CheckCircle2, Loader2, Mail, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AssignTutorDialog } from "./assignTutor";
import { ChangeStatusDialog } from "./changeStatus";
import { DeleteTutorRequest } from "./DeleteTutor";
import {
  formatTutorMatchReportSummaryText,
  normalizeTutorMatchReportSummary,
  type MatchReportSummary,
} from "./match-report";
import { ViewTutorRequests } from "./ViewTutor";

type RequestTutorStatusFilter = "all" | "Pending" | "Rejected";

type RequestTutorFilters = {
  status: RequestTutorStatusFilter;
  grade: string;
  medium: string;
  subject: string;
  preferredTutorType: string;
  preferredClassType: string;
  assignedTutor: string;
  duration: string;
  frequency: string;
};

const INITIAL_FILTERS: RequestTutorFilters = {
  status: "all",
  grade: "all",
  medium: "all",
  subject: "all",
  preferredTutorType: "all",
  preferredClassType: "all",
  assignedTutor: "",
  duration: "",
  frequency: "",
};

const REQUEST_TUTOR_STATUS_OPTIONS: Array<{
  value: RequestTutorStatusFilter;
  label: string;
}> = [
  { value: "all", label: "All statuses" },
  { value: "Pending", label: "Pending" },
  { value: "Rejected", label: "Rejected" },
];

const REQUEST_TUTOR_STATUS_CLASSES: Record<string, string> = {
  Pending:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
  Rejected:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200",
};

function RequestTutorStatusBadge({ status }: { status: string }) {
  const normalizedStatus = status === "Rejected" ? "Rejected" : "Pending";
  const className =
    REQUEST_TUTOR_STATUS_CLASSES[normalizedStatus] ??
    REQUEST_TUTOR_STATUS_CLASSES.Pending;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${className}`}
    >
      {normalizedStatus}
    </span>
  );
}

function MatchReportAction({
  requestId,
  onSuccess,
  lastSummary,
}: {
  requestId: string;
  onSuccess: (requestId: string, summary: MatchReportSummary) => void;
  lastSummary?: MatchReportSummary;
}) {
  const [generateTutorMatchReport, { isLoading }] =
    useGenerateTutorMatchReportMutation();

  const handleGenerate = async () => {
    try {
      const response = await generateTutorMatchReport({
        requestId,
      }).unwrap();
      const summary = normalizeTutorMatchReportSummary(response);
      onSuccess(requestId, summary);
      const summaryText = formatTutorMatchReportSummaryText(summary);
      toast.success(
        summaryText
          ? `Tutor match report sent successfully: ${summaryText}`
          : "Tutor match report sent successfully",
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate tutor match report");
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleGenerate}
        disabled={isLoading}
        className="h-8 gap-2 px-3 text-xs"
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Mail className="h-3.5 w-3.5" />
        )}
        {isLoading ? "Generating" : "Report"}
      </Button>

      {lastSummary && (
        <div className="max-w-[170px] text-center text-[11px] leading-4 text-emerald-700 dark:text-emerald-300">
          <div className="flex items-center justify-center gap-1 font-medium">
            <CheckCircle2 className="h-3 w-3" />
            Sent
          </div>
          {lastSummary.adminEmail && (
            <div className="truncate" title={lastSummary.adminEmail}>
              {lastSummary.adminEmail}
            </div>
          )}
          {lastSummary.blocks.length > 0 && (
            <div
              className="truncate"
              title={formatTutorMatchReportSummaryText(lastSummary)}
            >
              {lastSummary.blocks
                .map((block) => `${block.label}: ${block.matchedCount}`)
                .join(", ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RequestForTutorsList() {
  const [page, setPage] = useState<number>(TABLE_CONFIG.DEFAULT_PAGE);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<RequestTutorFilters>(INITIAL_FILTERS);
  const [reportSummaries, setReportSummaries] = useState<
    Record<string, MatchReportSummary>
  >({});
  const limit = TABLE_CONFIG.DEFAULT_LIMIT;

  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const debouncedAssignedTutor = useDebounce(filters.assignedTutor, 400);
  const debouncedDuration = useDebounce(filters.duration, 400);
  const debouncedFrequency = useDebounce(filters.frequency, 400);

  const { data, isLoading, refetch } = useFetchRequestForTutorsQuery(
    useMemo<FetchRequestForTutor>(
      () => ({
        page,
        limit,
        sortBy: "createdAt:desc",
        ...(debouncedSearchTerm.trim()
          ? { search: debouncedSearchTerm.trim() }
          : {}),
        ...(filters.status !== "all" ? { status: filters.status } : {}),
        ...(filters.grade !== "all" ? { grade: filters.grade } : {}),
        ...(filters.medium !== "all" ? { medium: filters.medium } : {}),
        ...(filters.subject !== "all" ? { subject: filters.subject } : {}),
        ...(filters.preferredTutorType !== "all"
          ? { preferredTutorType: filters.preferredTutorType }
          : {}),
        ...(filters.preferredClassType !== "all"
          ? { preferredClassType: filters.preferredClassType }
          : {}),
        ...(debouncedAssignedTutor.trim()
          ? { assignedTutor: debouncedAssignedTutor.trim() }
          : {}),
        ...(debouncedDuration.trim()
          ? { duration: debouncedDuration.trim() }
          : {}),
        ...(debouncedFrequency.trim()
          ? { frequency: debouncedFrequency.trim() }
          : {}),
      }),
      [
        debouncedAssignedTutor,
        debouncedDuration,
        debouncedFrequency,
        debouncedSearchTerm,
        filters.grade,
        filters.medium,
        filters.preferredClassType,
        filters.preferredTutorType,
        filters.status,
        filters.subject,
        limit,
        page,
      ],
    ),
  );

  const { data: gradesData, isFetching: isFetchingGrades } =
    useFetchGradesQuery({
      page: 1,
      limit: 10000,
      sortBy: "title:asc",
    });
  const { data: subjectsData, isFetching: isFetchingSubjects } =
    useFetchSubjectsQuery({
      page: 1,
      limit: 10000,
      sortBy: "title:asc",
    });

  const tutors: RequestTutors[] = data?.results || [];
  const totalPages = data?.totalPages || 1;
  const totalResults = data?.totalResults || tutors.length;

  const gradeOptions = useMemo(
    () =>
      (gradesData?.results || []).map((grade) => ({
        value: grade.id,
        label: grade.title,
      })),
    [gradesData?.results],
  );
  const selectedGrade = useMemo(
    () =>
      (gradesData?.results || []).find((grade) => grade.id === filters.grade),
    [gradesData?.results, filters.grade],
  );

  const subjectOptions = useMemo(() => {
    if (filters.grade === "all") {
      return (subjectsData?.results || []).map((subject) => ({
        value: subject.id,
        label: subject.title,
      }));
    }

    return (selectedGrade?.subjects || []).map((subject) => ({
      value: subject.id,
      label: subject.title,
    }));
  }, [filters.grade, selectedGrade?.subjects, subjectsData?.results]);

  useEffect(() => {
    setPage(TABLE_CONFIG.DEFAULT_PAGE);
  }, [
    debouncedAssignedTutor,
    debouncedDuration,
    debouncedFrequency,
    debouncedSearchTerm,
    filters.grade,
    filters.medium,
    filters.preferredClassType,
    filters.preferredTutorType,
    filters.status,
    filters.subject,
  ]);

  const handlePageChange = (newPage: number) => setPage(newPage);

  const updateFilter = <K extends keyof RequestTutorFilters>(
    key: K,
    value: RequestTutorFilters[K],
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
      ...(key === "grade" ? { subject: "all" } : {}),
    }));
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilters(INITIAL_FILTERS);
    setPage(TABLE_CONFIG.DEFAULT_PAGE);
  };

  const handleReportSuccess = (
    requestId: string,
    summary: MatchReportSummary,
  ) => {
    setReportSummaries((current) => ({
      ...current,
      [requestId]: summary,
    }));
  };

  const getSafeValue = (value: unknown, fallback = "N/A") => {
    if (value === undefined || value === null) {
      return fallback;
    }

    const stringValue = String(value).trim();
    return stringValue === "" ? fallback : stringValue;
  };

  const getSafeTutorBlocks = (value: RequestTutors["tutors"]) =>
    Array.isArray(value) ? value : [];

  const getGradeDisplayValue = (grade: unknown) => {
    if (grade && typeof grade === "object") {
      const gradeRecord = grade as {
        id?: string;
        title?: string;
        name?: string;
      };
      return getSafeValue(
        gradeRecord.title || gradeRecord.name || gradeRecord.id,
        "",
      );
    }

    return getSafeValue(grade, "");
  };

  const columns = useMemo<Column<RequestTutors>[]>(
    () => [
      {
        key: "name",
        header: "Full Name",
        className:
          "min-w-[150px] max-w-[250px] truncate overflow-hidden sticky left-0 z-20 bg-white dark:bg-gray-900",
        render: (row: RequestTutors) => (
          <span
            title={row.name || "No name"}
            className={`truncate block ${!row.name ? "text-gray-400 italic" : ""}`}
            style={{ width: "inherit" }}
          >
            {getSafeValue(row.name, "No name")}
          </span>
        ),
      },
      {
        key: "email",
        header: "Email",
        className: "min-w-[150px] max-w-[250px] truncate overflow-hidden",
        render: (row: RequestTutors) => (
          <span
            title={row.email || "No email"}
            className={`truncate block ${!row.email ? "text-gray-400 italic" : ""}`}
          >
            {getSafeValue(row.email, "No email")}
          </span>
        ),
      },
      {
        key: "phoneNumber",
        header: "Contact Number",
        className: "min-w-[140px] max-w-[200px] truncate overflow-hidden",
        render: (row: RequestTutors) => (
          <span
            title={row.phoneNumber || "No contact"}
            className={`truncate block ${!row.phoneNumber ? "text-gray-400 italic" : ""}`}
          >
            {getSafeValue(row.phoneNumber, "No contact")}
          </span>
        ),
      },
      {
        key: "medium",
        header: "Medium",
        className: "min-w-[120px] max-w-[150px] truncate overflow-hidden",
        render: (row: RequestTutors) => (
          <span
            title={row.medium || "No medium"}
            className={`truncate block ${!row.medium ? "text-gray-400 italic" : ""}`}
          >
            {getSafeValue(row.medium, "No medium")}
          </span>
        ),
      },
      {
        key: "grade",
        header: "Grade",
        className: "min-w-[280px] max-w-[360px] whitespace-normal",
        render: (row: RequestTutors) => {
          const gradeName = getSafeValue(row.grade, "No grade");

          return gradeName !== "No grade" ? (
            <span
              title={gradeName}
              className="block whitespace-normal break-words leading-5"
            >
              {gradeName}
            </span>
          ) : (
            <span className="text-gray-400 italic">No grade</span>
          );
        },
      },
      {
        key: "view",
        header: "View",
        align: "center",
        className:
          "min-w-[80px] max-w-[80px] sticky right-[390px] z-20 bg-white dark:bg-gray-900",
        render: (row: RequestTutors) => <ViewTutorRequests tutorId={row.id} />,
      },
      {
        key: "status",
        header: "Change Status",
        align: "center",
        className:
          "min-w-[190px] max-w-[190px] sticky right-[250px] z-20 bg-white dark:bg-gray-900",
        render: (row: RequestTutors) => (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-2">
              <RequestTutorStatusBadge status={row.status} />
              <ChangeStatusDialog
                requestId={row.id}
                currentStatus={
                  row.status === "Rejected" ? "Rejected" : "Pending"
                }
                onStatusChange={() => refetch()}
              />
            </div>
          </div>
        ),
      },
      {
        key: "assignTutor",
        header: "Assign Tutor",
        align: "center",
        className:
          "min-w-[170px] max-w-[170px] sticky right-[80px] z-20 bg-white dark:bg-gray-900",
        render: (row: RequestTutors) => (
          <AssignTutorDialog
            row={{
              id: row.id,
              grade: getGradeDisplayValue(row.grade),
              district: getSafeValue(row.city, ""),
              medium: getSafeValue(row.medium, ""),
              tutors: getSafeTutorBlocks(row.tutors).map((t) => ({
                _id: t._id,
                subject: t.subject,
                assignedTutor: t.assignedTutor,
                preferredTutorType: t.preferredTutorType,
                duration: t.duration,
                frequency: t.frequency,
              })),
            }}
            onUpdated={() => refetch()}
          />
        ),
      },
      {
        key: "delete",
        header: "Delete",
        align: "center",
        className:
          "min-w-[80px] max-w-[80px] sticky right-0 z-20 bg-white dark:bg-gray-900",
        render: (row: RequestTutors) => <DeleteTutorRequest tutorId={row.id} />,
      },
    ],
    [refetch],
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white/90">
              Request filters
            </h2>
            <p className="text-sm text-gray-500 dark:text-white/60">
              Search tutor requests and narrow them by status, grade, medium,
              tutor type, and class type.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleResetFilters}
            className="w-full gap-2 lg:w-auto"
          >
            <X className="h-4 w-4" />
            Clear filters
          </Button>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="space-y-1.5 lg:col-span-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Search
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name, email, city, district, phone number, subject, or assigned tutor"
                className="h-11 w-full pl-10 pr-4"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                updateFilter("status", value as RequestTutorStatusFilter)
              }
            >
              <SelectTrigger className="h-11 min-h-11 w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {REQUEST_TUTOR_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Grade
            </label>
            <Select
              value={filters.grade}
              onValueChange={(value) => updateFilter("grade", value)}
            >
              <SelectTrigger
                className="h-11 min-h-11 w-full"
                isLoading={isFetchingGrades}
              >
                <SelectValue placeholder="Filter by grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All grades</SelectItem>
                {gradeOptions.map((grade) => (
                  <SelectItem key={grade.value} value={grade.value}>
                    {grade.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Medium
            </label>
            <Select
              value={filters.medium}
              onValueChange={(value) => updateFilter("medium", value)}
            >
              <SelectTrigger className="h-11 min-h-11 w-full">
                <SelectValue placeholder="Filter by medium" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All mediums</SelectItem>
                {TUTOR_MEDIUM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Subject
            </label>
            <Select
              value={filters.subject}
              onValueChange={(value) => updateFilter("subject", value)}
            >
              <SelectTrigger
                className="h-11 min-h-11 w-full"
                isLoading={isFetchingSubjects}
              >
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All subjects</SelectItem>
                {subjectOptions.map((subject) => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Preferred tutor type
            </label>
            <Select
              value={filters.preferredTutorType}
              onValueChange={(value) =>
                updateFilter("preferredTutorType", value)
              }
            >
              <SelectTrigger className="h-11 min-h-11 w-full">
                <SelectValue placeholder="Filter by tutor type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tutor types</SelectItem>
                {TUTOR_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Preferred class type
            </label>
            <Select
              value={filters.preferredClassType}
              onValueChange={(value) =>
                updateFilter("preferredClassType", value)
              }
            >
              <SelectTrigger className="h-11 min-h-11 w-full">
                <SelectValue placeholder="Filter by class type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All class types</SelectItem>
                {CLASS_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={tutors}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalResults={totalResults}
        limit={limit}
        isLoading={isLoading}
        emptyMessage="No tutor requests found for the current filters."
      />
    </div>
  );
}
