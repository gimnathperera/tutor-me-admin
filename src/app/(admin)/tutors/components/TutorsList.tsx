"use client";

import DataTable from "@/components/tables/DataTable";
import { TABLE_CONFIG } from "@/configs/table";
import { useFetchTutorsQuery } from "@/store/api/splits/tutors";
import { useMemo, useState } from "react";
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
  last4NRIC: string;
  tutoringLevels: string[];
  preferredLocations: string[];
  tutorType: string;
  yearsExperience: number;
  highestEducation: string;
  academicDetails?: string;
  teachingSummary: string;
  studentResults: string;
  sellingPoints: string;
  agreeTerms: boolean;
  agreeAssignmentInfo: boolean;
  createdAt?: string;
}

export default function TutorsList() {
  const [page, setPage] = useState<number>(TABLE_CONFIG.DEFAULT_PAGE);
  const limit = TABLE_CONFIG.DEFAULT_LIMIT;

  const { data, isLoading } = useFetchTutorsQuery({});

  const tutors = data?.results || [];
  const totalPages = data?.totalPages || 1;
  const totalResults = data?.totalResults || tutors.length;

  console.log("Raw API data:", data);
  console.log("Tutors array:", tutors);
  console.log("Tutors array length:", tutors.length);
  console.log("Is loading:", isLoading);

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
          "min-w-[150px] max-w-[250px] truncate overflow-hidden cursor-default",
        render: (row: Tutor) => (
          <span
            title={row.fullName || "No name provided"}
            className={`truncate block ${!row.fullName ? "text-gray-400 italic" : ""}`}
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
        key: "tutorType",
        header: "Type",
        className:
          "min-w-[120px] max-w-[180px] truncate overflow-hidden cursor-default",
        render: (row: Tutor) => (
          <span
            title={row.tutorType || "No type provided"}
            className={`truncate block ${!row.tutorType ? "text-gray-400 italic" : ""}`}
          >
            {getSafeValue(row.tutorType, "No type provided")}
          </span>
        ),
      },
      {
        key: "yearsExperience",
        header: (
          <span
            className="truncate  w-full  text-center block max-w-[100px]"
            title="Experience (Years)"
          >
            Experience (Years)
          </span>
        ),
        className:
          "min-w-[100px] truncate  max-w-[100px] overflow-hidden cursor-default",
        render: (row: Tutor) => (
          <div className="flex justify-center w-full ">
            <span
              title={row.yearsExperience?.toString() || "N/A"}
              className={`truncate block ${row.yearsExperience === undefined ? "text-gray-400 italic" : ""}`}
            >
              {getSafeValue(row.yearsExperience, "N/A")}
            </span>
          </div>
        ),
      },

      // View button
      {
        key: "view",
        header: <div className="text-center w-full">View</div>,
        className: "min-w-[80px] max-w-[80px] cursor-default",
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
        className: "min-w-[80px] max-w-[80px] cursor-default",
        render: (row: Tutor) => (
          <div className="flex justify-center items-center w-full">
            <EditTutor id={row.id} />
          </div>
        ),
      },

      //Reset Password
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
        className: "min-w-[80px] max-w-[80px] cursor-default",
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
        className: "min-w-[80px] max-w-[80px] cursor-default",
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
