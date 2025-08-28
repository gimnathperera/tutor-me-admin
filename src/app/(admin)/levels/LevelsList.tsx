"use client";

import DataTable from "@/components/tables/DataTable";
import { useFetchLevelsQuery } from "@/store/api/splits/levels";
import { useState } from "react";
import { DeleteLevel } from "./DeleteLevel";
import { LevelDetails } from "./ViewDetails";
import { UpdateLevel } from "./edit-level/page";

export default function LevelsTable() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useFetchLevelsQuery({
    page,
    limit,
    sortBy: "createdAt:desc",
  });

  const levels = data?.results || [];
  const totalPages = data?.totalPages || 0;
  const totalResults = data?.totalResults || 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const columns = [
    { key: "title", header: "Title" },
    {
      key: "details",
      header: "Details",
      render: (row: any) => (
        <div className="">{(row.details || []).slice(0, 2).join(", ")}</div>
      ),
    },
    {
      key: "edit",
      header: "Edit",
      render: (row: any) => (
        <UpdateLevel
          id={row.id}
          title={row.title}
          details={row.details}
          challanges={row.challanges}
          subjects={row.subjects?.map((s: any) => s.id) || []}
        />
      ),
    },
    {
      key: "delete",
      header: "Delete",
      render: (row: any) => <DeleteLevel levelId={row.id} />,
    },
    {
      key: "view",
      header: "View",
      render: (row: any) => (
        <LevelDetails
          title={row.title}
          details={row.details}
          challanges={row.challanges}
          subjects={row.subjects || []}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={levels}
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      totalResults={totalResults}
      limit={limit}
      isLoading={isLoading}
    />
  );
}
