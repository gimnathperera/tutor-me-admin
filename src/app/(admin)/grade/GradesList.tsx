"use client";

import DataTable from "@/components/tables/DataTable";
import { useFetchGradesQuery } from "@/store/api/splits/grades";
import { useState } from "react";
import { DeleteGrade } from "./DeleteGrade";
import { GradeDetails } from "./ViewDetails";
import { UpdateGrade } from "./edit-grade/page";

export default function SubjectsTable() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useFetchGradesQuery({
    page,
    limit,
    sortBy: "createdAt:desc",
  });

  const grades = data?.results || [];
  const totalPages = data?.totalPages || 0;
  const totalResults = data?.totalResults || 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const columns = [
    { key: "title", header: "Title" },
    { key: "description", header: "Description" },
    {
      key: "edit",
      header: "Edit",
      render: (row) => (
        <UpdateGrade
          id={row.id}
          title={row.title}
          description={row.description}
          subjects={row.subjects}
        />
      ),
    },
    {
      key: "delete",
      header: "Status",
      render: (row) => <DeleteGrade gradeId={row.id} />,
    },
    {
      key: "view",
      header: "View",
      render: (row) => (
        <GradeDetails
          title={row.title}
          description={row.description}
          subjects={row.subjects}
        />
      ),
    },
  ];
  if (isLoading) {
    return <div>Loading subjects...</div>;
  }

  return (
    <DataTable
      columns={columns}
      data={grades}
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      totalResults={totalResults}
      limit={limit}
    />
  );
}
