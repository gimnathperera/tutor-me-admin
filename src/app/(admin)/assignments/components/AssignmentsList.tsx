"use client";

import DataTable from "@/components/tables/DataTable";
import { useFetchAssignmentsQuery } from "@/store/api/splits/tuition-assignments";
import { useState } from "react";
import { DeleteAssignment } from "./DeleteAssignment";
import ViewDetails from "./ViewDetails";
import { UpdateAssignment } from "./edit-assignment/UpdateAssignment";

// Define a type for the assignment object to ensure type safety
type Assignment = {
  id: string;
  title: string;
  assignmentNumber: string;
  address: string;
  duration: string;
  assignmentPrice: number;
  createdAt: string;
};


export default function AssignmentsList() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useFetchAssignmentsQuery({
    page,
    limit,
    sortBy: "createdAt:desc",
  });

  const assignments: Assignment[] = data?.results || [];
  const totalPages = data?.totalPages || 0;
  const totalResults = data?.totalResults || 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const columns = [
    { key: "title", header: "Title" },
    { key: "assignmentNumber", header: "Assignment Number" },
    { key: "address", header: "Address" },
    { key: "duration", header: "Duration" },
    { key: "assignmentPrice", header: "Price" },
    {
      key: "createdAt",
      header: "Created Date",
      bodyClassName: "text-[0.75rem] font-mono",
      render: (row: { createdAt: string }) => {
        try {
          const date = new Date(row.createdAt);
          if (isNaN(date.getTime())) {
            return <span className="text-gray-400 italic">Invalid date</span>;
          }
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        } catch (error) {
          console.error("Error parsing date:", error);
          return <span className="text-gray-400 italic">Invalid date</span>;
        }
      },
    },
    {
      key: "view",
      header: "View",
      className: "min-w-[10px] max-w-[10px] cursor-default",
      render: (row: Assignment) => (
        <div className="w-full flex justify-center items-center">
          <ViewDetails
            assignment={{
              title: row.title,
              assignmentNumber: row.assignmentNumber,
              address: row.address,
              duration: row.duration,
              assignmentPrice: String(row.assignmentPrice), // Ensure price is a string if ViewDetails expects it
            }}
          />
        </div>
      ),
    },
    {
      key: "edit",
      header: "Edit",
      className: "min-w-[10px] max-w-[10px] cursor-default",
      // Pass the entire row object to the UpdateAssignment component
      render: (row: Assignment) => (
        <div className="w-full flex justify-center items-center">
          <UpdateAssignment assignment={row} />
        </div>
      ),
    },
    {
      key: "delete",
      header: "Delete",
      className: "min-w-[10px] max-w-[10px] cursor-default",
      render: (row: { id: string }) => (
        <div className="w-full flex justify-center items-center">
          <DeleteAssignment assignmentId={row.id} />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={assignments}
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      totalResults={totalResults}
      limit={limit}
      isLoading={isLoading}
    />
  );
}