"use client";

import DataTable from "@/components/tables/DataTable";
import { TABLE_CONFIG } from "@/configs/table";
import {
  useFetchTutorsQuery,
  useUpdateTutorStatusMutation,
} from "@/store/api/splits/tutors";
import { getErrorInApiResult } from "@/utils/api";
import { getAdminId } from "@/utils/auth";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { DeleteTutor } from "./DeleteTutor";
import { EditTutor } from "./edit-tutor/EditTutor";
import { ResetPassword } from "./ResetPassword";
import { ViewTutor } from "./ViewTutor";

interface Tutor {
  id: string;
  fullName: string;
  contactNumber: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  age: number;
  nationality: string;
  race: string;
  status: string;
  classType: string[];

  tutoringLevels: string[];
  preferredLocations: string[];
  tutorType: string[];
  yearsExperience: number;
  highestEducation: string;
  academicDetails?: string;
  teachingSummary: string;
  studentResults: string;
  sellingPoints: string;
  agreeTerms: boolean;
  agreeAssignmentInfo: boolean;
  certificatesAndQualifications: { id?: string; type: string; url: string }[];
  createdAt?: string;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "suspended", label: "Suspended" },
];

const STATUS_STYLES: Record<string, { badge: string; select: string }> = {
  pending: {
    badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
    select: "bg-yellow-50 text-yellow-700 border-yellow-300 focus:ring-yellow-400",
  },
  approved: {
    badge: "bg-green-100 text-green-700 border-green-200",
    select: "bg-green-50 text-green-700 border-green-300 focus:ring-green-400",
  },
  rejected: {
    badge: "bg-red-100 text-red-700 border-red-200",
    select: "bg-red-50 text-red-700 border-red-300 focus:ring-red-400",
  },
  suspended: {
    badge: "bg-gray-200 text-gray-600 border-gray-300",
    select: "bg-gray-100 text-gray-600 border-gray-300 focus:ring-gray-400",
  },
};

function StatusDropdown({ tutor }: { tutor: Tutor }) {
  const [updateTutorStatus, { isLoading }] = useUpdateTutorStatusMutation();
  const [localStatus, setLocalStatus] = useState(
    (tutor.status || "pending").toLowerCase(),
  );

  const style =
    STATUS_STYLES[localStatus] || STATUS_STYLES["pending"];

  const handleChange = async (newStatus: string) => {
    const previous = localStatus;
    setLocalStatus(newStatus); // optimistic update

    try {
      const adminId = getAdminId();
      const result = await updateTutorStatus({ id: tutor.id, status: newStatus, adminId });
      const error = getErrorInApiResult(result);

      if (error) {
        setLocalStatus(previous); // revert on error
        toast.error(`Failed to update status: ${error}`);
        return;
      }

      const label =
        STATUS_OPTIONS.find((o) => o.value === newStatus)?.label ?? newStatus;
      toast.success(`Status updated to "${label}"`);
    } catch {
      setLocalStatus(previous);
      toast.error("An unexpected error occurred while updating status");
    }
  };

  return (
    <div className="relative flex items-center gap-1.5">
      <select
        value={localStatus}
        disabled={isLoading}
        onChange={(e) => handleChange(e.target.value)}
        className={`
          appearance-none text-xs font-semibold capitalize rounded-full
          pl-2.5 pr-6 py-1 border cursor-pointer
          transition-colors duration-150 outline-none
          focus:ring-2 focus:ring-offset-1
          disabled:opacity-60 disabled:cursor-not-allowed
          ${style.select}
        `}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {isLoading ? (
        <Loader2 className="absolute right-1.5 h-3 w-3 animate-spin text-current pointer-events-none" />
      ) : (
        <svg
          className="absolute right-1.5 h-3 w-3 pointer-events-none opacity-60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </div>
  );
}

export default function TutorsList() {
  const [page, setPage] = useState<number>(TABLE_CONFIG.DEFAULT_PAGE);
  const limit = TABLE_CONFIG.DEFAULT_LIMIT;

  const { data, isLoading } = useFetchTutorsQuery({
    page,
    limit,
  });

  const tutors = data?.results || [];
  const totalPages = data?.totalPages || 1;
  const totalResults = data?.totalResults || tutors.length;

  const handlePageChange = (newPage: number) => setPage(newPage);

  const getSafeValue = (
    value: string | number | undefined | null,
    fallback = "N/A",
  ) => {
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    )
      return fallback;
    return value;
  };

  const columns = useMemo(
    () => [
      {
        key: "fullName",
        header: "Full Name",
        className:
          "min-w-[150px] max-w-[250px] truncate overflow-hidden sticky left-0 z-20 bg-white dark:bg-gray-900",
        render: (row: Tutor) => (
          <span
            title={row.fullName || "No name provided"}
            className={`truncate block ${!row.fullName ? "text-gray-400 italic" : ""}`}
            style={{ width: "inherit" }}
          >
            {getSafeValue(row.fullName, "No name provided")}
          </span>
        ),
      },
      {
        key: "email",
        header: "Email",
        className:
          "min-w-[150px] max-w-[250px] truncate overflow-hidden cursor-default",
        render: (row: Tutor) => (
          <span
            title={row.email || "No email provided"}
            className={`truncate block ${!row.email ? "text-gray-400 italic" : ""}`}
          >
            {getSafeValue(row.email, "No email provided")}
          </span>
        ),
      },
      {
        key: "contactNumber",
        header: "Contact Number",
        className:
          "min-w-[140px] max-w-[200px] truncate overflow-hidden cursor-default",
        render: (row: Tutor) => (
          <span
            title={row.contactNumber || "No contact provided"}
            className={`truncate block ${!row.contactNumber ? "text-gray-400 italic" : ""}`}
          >
            {getSafeValue(row.contactNumber, "No contact provided")}
          </span>
        ),
      },
      {
        key: "status",
        header: "Status",
        className: "min-w-[140px] max-w-[160px] overflow-visible",
        render: (row: Tutor) => <StatusDropdown tutor={row} />,
      },

      // View button
      {
        key: "view",
        header: <div className="text-center w-full">View</div>,
        className: "min-w-[80px] max-w-[80px] sticky right-[240px] z-20 bg-white dark:bg-gray-900",
        render: (row: Tutor) => (
          <div className="flex justify-center items-center w-full">
            <ViewTutor tutor={row} />
          </div>
        ),
      },

      // Edit button
      {
        key: "edit",
        header: <div className="text-center w-full">Edit</div>,
        className: "min-w-[80px] max-w-[80px] sticky right-[160px] z-20 bg-white dark:bg-gray-900",
        render: (row: Tutor) => (
          <div className="flex justify-center items-center w-full">
            <EditTutor id={row.id} />
          </div>
        ),
      },

      // Reset Password
      {
        key: "resetPassword",
        header: (
          <span
            className="truncate w-full text-center block max-w-[100px]"
            title="Reset Password"
          >
            Reset Password
          </span>
        ),
        className: "min-w-[80px] max-w-[80px] sticky right-[80px] z-20 bg-white dark:bg-gray-900",
        render: (row: Tutor) => (
          <div className="flex justify-center items-center w-full">
            <ResetPassword userId={row.id} />
          </div>
        ),
      },

      // Delete button
      {
        key: "delete",
        header: <div className="text-center w-full">Delete</div>,
        className: "min-w-[80px] max-w-[80px] sticky right-0 z-20 bg-white dark:bg-gray-900",
        render: (row: Tutor) => (
          <div className="flex justify-center items-center w-full">
            <DeleteTutor tutorId={row.id} />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={tutors}
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      totalResults={totalResults}
      limit={limit}
      isLoading={isLoading}
    />
  );
}
