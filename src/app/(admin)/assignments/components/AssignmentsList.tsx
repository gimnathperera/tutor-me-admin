"use client";

import DataTable from "@/components/tables/DataTable";
import { useFetchAssignmentsQuery } from "@/store/api/splits/tuition-assignments";
import { useState } from "react";
import { DeleteAssignment } from "./DeleteAssignment";
import ViewDetails from "./ViewDetails";
import { UpdateAssignment } from "./edit-assignment/page";

export default function AssignmentsList() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useFetchAssignmentsQuery({
    page,
    limit,
    sortBy: "createdAt:desc",
  });

  const assignments = data?.results || [];
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
      key: "edit",
      header: "Edit",
      render: (row: {
        id: string;
        title: string;
        assignmentNumber: string;
        address: string;
        duration: string;
        assignmentPrice: number;
      }) => (
        <UpdateAssignment
          id={row.id}
          title={row.title}
          assignmentNumber={row.assignmentNumber}
          address={row.address}
          duration={row.duration}
          assignmentPrice={row.assignmentPrice}
        />
      ),
    },
    {
      key: "delete",
      header: "Delete",
      render: (row: { id: string }) => (
        <div className="flex justify-center items-center">
          <DeleteAssignment assignmentId={row.id} />
        </div>
      ),
    },
    {
      key: "view",
      header: "View",
      render: (row: {
        title: string;
        assignmentNumber: string;
        address: string;
        duration: string;
        assignmentPrice: number;
      }) => (
        <div className="flex justify-center items-center">
          <ViewDetails assignment={row} />
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
