"use client";

import DataTable from "@/components/tables/DataTable";
import { TABLE_CONFIG } from "@/configs/table";
import {
  useFetchRequestForTutorsQuery,
} from "@/store/api/splits/request-tutor";
import { RequestTutors } from "@/types/response-types";
import { useMemo, useState } from "react";
import { AssignTutorDialog } from "./assignTutor";
import { ChangeStatusDialog } from "./changeStatus";
import { DeleteTutorRequest } from "./DeleteTutor";
import { ViewTutorRequests } from "./ViewTutor";

export default function RequestForTutorsList() {
  const [page, setPage] = useState<number>(TABLE_CONFIG.DEFAULT_PAGE);
  const limit = TABLE_CONFIG.DEFAULT_LIMIT;

  const { data, isLoading, refetch } = useFetchRequestForTutorsQuery({
    page,
    limit,
    sortBy: "createdAt:desc",
  });



  const tutors: RequestTutors[] = data?.results || [];
  const totalPages = data?.totalPages || 1;
  const totalResults = data?.totalResults || tutors.length;

  const handlePageChange = (newPage: number) => setPage(newPage);

  const getSafeValue = (value: string | undefined | null, fallback = "N/A") =>
    value && value.trim() !== "" ? value : fallback;

  const columns = useMemo(
    () => [
      {
        key: "name",
        header: "Full Name",
        className: "min-w-[150px] max-w-[250px] truncate overflow-hidden sticky left-0 z-20 bg-white dark:bg-gray-900",
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
        key: "grades",
        header: "Grades",
        className: "min-w-[200px] max-w-[300px] truncate overflow-hidden",
        render: (row: RequestTutors) =>
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
        header: "View",
        className: "min-w-[80px] max-w-[80px] sticky right-[390px] z-20 bg-white dark:bg-gray-900",
        render: (row) => <ViewTutorRequests tutorId={row.id} />,
      },
      {
        key: "status",
        header: "Change Status",
        className: "min-w-[140px] max-w-[140px] sticky right-[250px] z-20 bg-white dark:bg-gray-900",
        render: (row: RequestTutors) => (
          <ChangeStatusDialog
            requestId={row.id}
            currentStatus={row.status}
            onStatusChange={() => refetch()}
          />
        ),
      },
      {
        key: "assignTutor",
        header: "Assign Tutor",
        className: "min-w-[170px] max-w-[170px] sticky right-[80px] z-20 bg-white dark:bg-gray-900",
        render: (row: RequestTutors) => (
          <AssignTutorDialog
            row={{
              id: row.id,
              tutors: row.tutors?.map((t) => ({
                _id: t._id, // tutor block ID
                subjects: t.subjects,
                assignedTutor: t.assignedTutor?.map((a) => ({
                  _id: a.id, // map id to _id
                  id: a.id,
                  fullName: a.fullName,
                })),
                preferredTutorType: t.preferredTutorType,
                duration: t.duration,
                frequency: t.frequency,
                createdAt: t.createdAt || "",
              })),
            }}
            onUpdated={() => refetch()}
          />
        ),
      },
      {
        key: "delete",
        header: "Delete",
        className: "min-w-[80px] max-w-[80px] sticky right-0 z-20 bg-white dark:bg-gray-900",
        render: (row: RequestTutors) => (
          <div className="w-full flex justify-center items-center">
            <DeleteTutorRequest tutorId={row.id} />
          </div>
        ),
      },
    ],
    [refetch],
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
