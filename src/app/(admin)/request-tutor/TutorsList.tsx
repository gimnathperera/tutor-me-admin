"use client";

import DataTable from "@/components/tables/DataTable";
import { TABLE_CONFIG } from "@/configs/table";
import { useFetchRequestForTutorsQuery } from "@/store/api/splits/request-tutor";
import { useMemo, useState } from "react";
import { DeleteTutor } from "./DeleteTutor";
import { ViewTutor } from "./ViewTutor";

interface TutorRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  state?: string; // optional to match API
  region?: string;
  zip?: string;
  grade?: { title: string }[];
  tutors?: {
    subjects: { title: string }[];
    duration: string;
    frequency: string;
  }[];
  preferredTutorType?: string;
  studentSchool?: string;
  genderPreference?: string;
  bilingual?: string;
  createdAt?: string;
}

export default function RequestForTutorsList() {
  const [page, setPage] = useState(TABLE_CONFIG.DEFAULT_PAGE);
  const limit = TABLE_CONFIG.DEFAULT_LIMIT;

  // Fetch request tutor data with pagination
  const { data, isLoading, error } = useFetchRequestForTutorsQuery({});

  const tutors: TutorRequest[] = data?.results || [];
  const totalPages = data?.totalPages || 1;
  const totalResults = data?.totalResults || tutors.length;

  const handlePageChange = (newPage: number) => setPage(newPage);

  const getSafeValue = (value: string | undefined | null, fallback = "N/A") =>
    value && value.trim() !== "" ? value : fallback;

  const columns = useMemo(
    () => [
      {
        key: "fullName",
        header: "Full Name",
        className:
          "min-w-[150px] max-w-[250px] truncate overflow-hidden cursor-default",
        render: (row: TutorRequest) => (
          <span
            title={row.firstName || "No name provided"}
            className={`truncate block ${
              !row.firstName ? "text-gray-400 italic" : ""
            }`}
          >
            {getSafeValue(
              `${row.firstName} ${row.lastName}`,
              "No name provided",
            )}
          </span>
        ),
      },
      {
        key: "email",
        header: "Email",
        className:
          "min-w-[150px] max-w-[250px] truncate overflow-hidden cursor-default",
        render: (row: TutorRequest) => (
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
        render: (row: TutorRequest) => (
          <span
            title={row.phoneNumber || "No contact provided"}
            className={`truncate block ${
              !row.phoneNumber ? "text-gray-400 italic" : ""
            }`}
          >
            {getSafeValue(row.phoneNumber, "No contact provided")}
          </span>
        ),
      },
      {
        key: "grades",
        header: "Grades",
        className:
          "min-w-[200px] max-w-[300px] truncate overflow-hidden cursor-default",
        render: (row: TutorRequest) =>
          row.grade && row.grade.length > 0 ? (
            <span title={row.grade.map((g) => g.title).join(", ")}>
              {row.grade.map((g) => g.title).join(", ")}
            </span>
          ) : (
            <span className="text-gray-400 italic">No grades</span>
          ),
      },
      {
        key: "view",
        header: <div className="text-center w-full">View</div>,
        className: "min-w-[80px] max-w-[80px] cursor-default",
        render: (row: TutorRequest) => (
          <div className="flex justify-center items-center w-full">
            <ViewTutor tutor={row} />
          </div>
        ),
      },

      {
        key: "delete",
        header: <div className="text-center w-full">Delete</div>,
        className: "min-w-[80px] max-w-[80px] cursor-default",
        render: (row: TutorRequest) => (
          <div className="flex justify-center items-center w-full">
            <DeleteTutor tutorId={row.id} />
          </div>
        ),
      },
    ],
    [],
  );

  if (error) {
    console.error("Error fetching tutors:", error);
  }

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
