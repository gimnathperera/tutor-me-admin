"use client";

import DataTable from "@/components/tables/DataTable";
import { TABLE_CONFIG } from "@/configs/table";
import {
  useDeleteRequestForTutorMutation,
  useFetchRequestForTutorsQuery,
} from "@/store/api/splits/request-tutor";
import { useFetchTutorsQuery } from "@/store/api/splits/tutors";
import { useMemo, useState } from "react";
import { AssignTutorsDialog } from "./assignTutor";
import { ChangeStatusDialog } from "./changeStatus";
import { DeleteTutorRequest } from "./DeleteTutor";
import { ViewTutorRequests } from "./ViewTutor";

interface AssignedTutor {
  id: string;
  fullName: string;
}

interface RequestTutorGrade {
  title: string;
  description: string | undefined;
}

interface RequestTutorSubjects {
  id: string;
  title: string;
  description?: string;
}

interface RequestTutorTutors {
  subjects: RequestTutorSubjects[];
  assignedTutor: { id: string; fullName: string }[];
  preferredTutorType?: string;
  duration: string;
  frequency: string;
}

export interface RequestTutors {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  medium: string;
  city: string;
  district?: string;
  grade?: RequestTutorGrade[];
  tutors?: RequestTutorTutors[];
  status: "Pending" | "Approved" | "Tutor Assigned";
  createdAt?: string;
}

interface TutorDetails {
  id: string;
  name: string;
  medium: string;
  email: string;
  phoneNumber: string;
  city: string;
  district?: string;
  grade?: {
    description: string | undefined;
    title: string;
  }[];
  tutors?: {
    subjects: { title: string }[];
    assignedTutor: { fullName: string }[];
    preferredTutorType?: string;
    duration: string;
    frequency: string;
  }[];
  createdAt?: string;
}

export default function RequestForTutorsList() {
  const [page, setPage] = useState<number>(TABLE_CONFIG.DEFAULT_PAGE);
  const limit = TABLE_CONFIG.DEFAULT_LIMIT;

  const { data, isLoading, refetch } = useFetchRequestForTutorsQuery({
    page,
    limit,
    sortBy: "createdAt:desc",
  });

  const { data: allTutorsData } = useFetchTutorsQuery({ page: 1, limit: 100 });
  const availableTutors: AssignedTutor[] =
    allTutorsData?.results.map((t) => ({ id: t.id, fullName: t.name })) || [];

  const [deleteTutor] = useDeleteRequestForTutorMutation();

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
        className: "min-w-[150px] max-w-[250px] truncate overflow-hidden",
        render: (row: RequestTutors) => (
          <span
            title={row.name || "No name"}
            className={`truncate block ${!row.name ? "text-gray-400 italic" : ""}`}
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
        className: "min-w-[80px] max-w-[80px]",
        render: (row: RequestTutors) => {
          const transformedData: TutorDetails = {
            ...row,
            grade: row.grade?.map((g) => ({
              title: g.title,
              description: g.description ?? "N/A",
            })),

            tutors: row.tutors?.map((t) => ({
              subjects: t.subjects?.map((s) => ({ title: s.title })) || [],
              assignedTutor:
                t.assignedTutor?.map((a) => ({ fullName: a.fullName })) || [],
              preferredTutorType: t.preferredTutorType,
              duration: t.duration,
              frequency: t.frequency,
            })),
          };

          return <ViewTutorRequests tutor={transformedData} />;
        },
      },
      {
        key: "status",
        header: "Change Status",
        render: (row: RequestTutors) => (
          <ChangeStatusDialog
            requestId={row.id}
            currentStatus={row.status}
            onStatusChange={() => refetch()}
          />
        ),
      },
      {
        key: "assign",
        header: "Assign Tutor",
        render: (row: RequestTutors) => {
          const assigned =
            row.tutors?.flatMap((t) =>
              t.assignedTutor?.map((a) => ({
                id: a.id,
                fullName: a.fullName,
              })),
            ) || [];

          return (
            <AssignTutorsDialog
              requestId={row.id}
              currentAssigned={assigned}
              availableTutors={availableTutors}
              onAssignedChange={() => refetch()}
            />
          );
        },
      },
      {
        key: "delete",
        header: "Delete",
        className: "min-w-[80px] max-w-[80px]",
        render: (row: RequestTutors) => (
          <div className="w-full flex justify-center items-center">
            <DeleteTutorRequest tutorId={row.id} />
          </div>
        ),
      },
    ],
    [deleteTutor, refetch],
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
