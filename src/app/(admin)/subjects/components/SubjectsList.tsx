"use client";

import DataTable from "@/components/tables/DataTable";
import { TABLE_CONFIG } from "@/configs/table";
import { useFetchSubjectsQuery } from "@/store/api/splits/subjects";
import { useState } from "react";
import { DeleteSubject } from "./DeleteSubject";
import { UpdateSubject } from "./edit-subject/page";
import { SubjectDetails } from "./ViewDetails";

interface Subject {
  id: string;
  title?: string;
  description?: string;
  createdAt?: string;
}

export default function SubjectsTable() {
  const [page, setPage] = useState<number>(TABLE_CONFIG.DEFAULT_PAGE);
  const limit = TABLE_CONFIG.DEFAULT_LIMIT;

  const { data, isLoading } = useFetchSubjectsQuery({
    page,
    limit,
    sortBy: "createdAt:desc",
  });

  const subjects = data?.results || [];
  const totalPages = data?.totalPages || 0;
  const totalResults = data?.totalResults || 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getSafeValue = (value: string | undefined | null, fallback = "N/A"): string => {
    if (value === undefined || value === null || value.trim() === "") {
      return fallback;
    }
    return value;
  };

  const columns = [
    {
      key: "title",
      header: "Title",
      className: "min-w-[150px] max-w-[250px] truncate overflow-hidden cursor-default",
      render: (row: Subject) => {
        const safeTitle = getSafeValue(row.title, "No title provided");
        return (
          <span 
            title={`Title: ${safeTitle}`}
            className={`truncate block ${!row.title ? 'text-gray-400 italic' : ''}`}
          >
            {safeTitle}
          </span>
        );
      },
    },
    {
      key: "description",
      header: "Description",
      className: "min-w-[200px] max-w-[300px] truncate overflow-hidden cursor-default",
      render: (row: Subject) => {
        const safeDescription = getSafeValue(row.description, "No description provided");
        return (
          <span 
            title={`Description: ${safeDescription}`}
            className={`truncate block ${!row.description ? 'text-gray-400 italic' : ''}`}
          >
            {safeDescription}
          </span>
        );
      },
    },
    {
      key: "edit",
      header: "Edit",
      className: "min-w-[80px] max-w-[80px] cursor-default",
      render: (row: Subject) => (
        <div className="w-full flex justify-center items-center">
          <UpdateSubject
            id={row.id}
            title={getSafeValue(row.title, "")}
            description={getSafeValue(row.description, "")}
          />
        </div>
      ),
    },
    {
      key: "delete",
      header: "Delete",
      className: "min-w-[80px] max-w-[80px] cursor-default",
      render: (row: Subject) => (
        <div className="w-full flex justify-center items-center">
          <DeleteSubject subjectId={row.id} />
        </div>
      ),
    },
    {
      key: "view",
      header: "View",
      className: "min-w-[80px] max-w-[80px] cursor-default",
      render: (row: Subject) => (
        <div className="w-full flex justify-center items-center">
          <SubjectDetails 
            title={getSafeValue(row.title, "No title provided")} 
            description={getSafeValue(row.description, "No description provided")} 
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={subjects}
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      totalResults={totalResults}
      limit={limit}
      isLoading={isLoading}
    />
  );
}