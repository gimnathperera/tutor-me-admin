"use client";

import DataTable from "@/components/tables/DataTable";
import { useFetchPapersQuery } from "@/store/api/splits/papers";
import { Copy } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { DeletePaper } from "./DeletePaper";
import { EditPaper } from "./edit-paper/page";
import { PaperDetails } from "./ViewDetails";

export default function PapersTable() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useFetchPapersQuery({
    page,
    limit,
    sortBy: "createdAt:desc",
  });

  const subjects = data?.results || [];
  const totalPages = data?.totalPages || 0;
  const totalResults = data?.totalResults || 0;

  interface Row {
    subject: { title: string };
    grade: { title: string };
    year: string;
    url: string;
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Paper URL copied to clipboard");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const columns = [
    { key: "title", header: "Title" },
    {
      key: "subject",
      header: "Subject",
      render: (row: Row) => row.subject.title,
    },
    { key: "grade", header: "Grade", render: (row: Row) => row.grade.title },
    { key: "year", header: "Year" },
    {
      key: "url",
      header: "URL",
      render: (row: { url: string }) => (
        <span
          onClick={() => copyToClipboard(row.url)}
          title={"Click to copy"}
          className="cursor-pointer relative group truncate max-w-full flex items-center gap-1 hover:underline hover:text-blue-700 dark:hover:text-blue-400"
        >
          {row.url}
          <Copy className="w-4 opacity-0 group-hover:opacity-100 transition-opacity text:text-blue-700 dark:text-blue-400 flex-shrink-0" />
        </span>
      ),
    },
    {
      key: "edit",
      header: "Edit",
      render: (row: {
        id: string;
        title: string;
        description: string;
        grade: { id: string };
        subject: { id: string };
        year: string;
        url: string;
      }) => (
        <div className="flex justify-center items-center">
          <EditPaper
            id={row.id}
            title={row.title}
            description={row.description}
            grade={row.grade?.id}
            subject={row.subject?.id}
            year={row.year}
            url={row.url}
          />
        </div>
      ),
    },
    {
      key: "delete",
      header: "Delete",
      render: (row: { id: string }) => (
        <div className="flex justify-center items-center">
          <DeletePaper paperId={row.id} />
        </div>
      ),
    },
    {
      key: "view",
      header: "View",
      render: (row: {
        id: string;
        title: string;
        description: string;
        grade: { title: string };
        subject: { title: string };
        year: string;
        url: string;
      }) => (
        <div className="flex justify-center items-center">
          <PaperDetails
            title={row.title}
            description={row.description}
            grade={row.grade?.title}
            subject={row.subject?.title}
            year={row.year}
            url={row.url}
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
