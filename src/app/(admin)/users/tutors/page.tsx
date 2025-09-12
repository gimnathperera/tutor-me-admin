"use client";

import DataTable from "@/components/tables/DataTable";
import { TABLE_CONFIG } from "@/configs/table";
import { useFetchGradesQuery } from "@/store/api/splits/grades";
import { useState } from "react";

interface Tutors {
  id: string;
  title?: string;
  description?: string;
  createdAt?: string;
}

export default function TutorsTable() {
  const [page, setPage] = useState<number>(TABLE_CONFIG.DEFAULT_PAGE);
  const limit = TABLE_CONFIG.DEFAULT_LIMIT;

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

  const getSafeValue = (
    value: string | undefined | null,
    fallback = "N/A",
  ): string => {
    if (value === undefined || value === null || value.trim() === "") {
      return fallback;
    }
    return value;
  };

  const getSafeArray = (value: any[] | undefined | null): any[] => {
    if (!Array.isArray(value)) {
      return [];
    }
    return value;
  };

  const columns = [
    {
      key: "title",
      header: "Title",
      className:
        "min-w-[150px] max-w-[250px] truncate overflow-hidden cursor-default",
      render: (row: Tutors) => {
        const safeTitle = getSafeValue(row.title, "No title provided");
        return (
          <span
            title={`Title: ${safeTitle}`}
            className={`truncate block ${!row.title ? "text-gray-400 italic" : ""}`}
          >
            {safeTitle}
          </span>
        );
      },
    },
    {
      key: "description",
      header: "Description",
      className:
        "min-w-[200px] max-w-[300px] truncate overflow-hidden cursor-default",
      render: (row: Tutors) => {
        const safeDescription = getSafeValue(
          row.description,
          "No description provided",
        );
        return (
          <span
            title={`Description: ${safeDescription}`}
            className={`truncate block ${!row.description ? "text-gray-400 italic" : ""}`}
          >
            {safeDescription}
          </span>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={grades}
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      totalResults={totalResults}
      limit={limit}
      isLoading={isLoading}
    />
  );
}
