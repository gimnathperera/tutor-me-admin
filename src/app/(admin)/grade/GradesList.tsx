"use client";

import DataTable from "@/components/tables/DataTable";
import { useFetchGradesQuery } from "@/store/api/splits/grades";
import { DeleteGrade } from "./DeleteGrade";
import { GradeDetails } from "./ViewDetails";
import { UpdateGrade } from "./edit-grade/page";

export default function GradesTable() {
  const { data, isLoading } = useFetchGradesQuery({});
  const grades = data?.results || [];

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
    return <div>Loading grades...</div>;
  }

  return <DataTable columns={columns} data={grades} />;
}
