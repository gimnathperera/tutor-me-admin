"use client";

import DataTable from "@/components/tables/DataTable";
import { TABLE_CONFIG } from "@/configs/table";
import { useFetchGradesQuery } from "@/store/api/splits/grades";
import { useState } from "react";
import { DeleteGrade } from "./DeleteGrade";
import { GradeDetails } from "./ViewDetails";
import { UpdateGrade } from "./edit-grade/page";

interface Subject {
  id: string;
  title: string;
}

interface Grade {
  id: string;
  title?: string;
  description?: string;
  subjects?: Subject[];
  createdAt?: string;
}

export default function SubjectsTable() {
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

  const getSafeArray = (value: Subject[] | undefined | null): Subject[] => {
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
      render: (row: Grade) => {
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
      render: (row: Grade) => {
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
    {
      key: "subjects",
      header: "Subjects",
      className: "min-w-[120px] max-w-[150px] cursor-default",
      render: (row: Grade) => {
        const safeSubjects = getSafeArray(row.subjects);
        const subjectCount = safeSubjects.length;

        return (
          <span
            title={`${subjectCount} subject${subjectCount !== 1 ? "s" : ""}`}
            className={`${subjectCount === 0 ? "text-gray-400 italic" : "text-blue-600 dark:text-blue-400"}`}
          >
            {subjectCount === 0
              ? "No subjects"
              : `${subjectCount} subject${subjectCount !== 1 ? "s" : ""}`}
          </span>
        );
      },
    },
    {
      key: "edit",
      header: "Edit",
      className: "min-w-[80px] max-w-[80px] cursor-default",
      render: (row: Grade) => (
        <div className="w-full flex justify-center items-center">
          <UpdateGrade
            id={row.id}
            title={getSafeValue(row.title, "")}
            description={getSafeValue(row.description, "")}
            subjects={getSafeArray(row.subjects).map((subject) => subject.title)}
          />
        </div>
      ),
    },
    {
      key: "delete",
      header: "Status",
      className: "min-w-[80px] max-w-[80px] cursor-default",
      render: (row: Grade) => (
        <div className="w-full flex justify-center items-center">
          <DeleteGrade gradeId={row.id} />
        </div>
      ),
    },
    {
      key: "view",
      header: "View",
      className: "min-w-[80px] max-w-[80px] cursor-default",
      render: (row: Grade) => (
        <div className="w-full flex justify-center items-center">
          <GradeDetails
            title={getSafeValue(row.title, "No title provided")}
            description={getSafeValue(
              row.description,
              "No description provided",
            )}
            subjects={getSafeArray(row.subjects)}
          />
        </div>
      ),
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
