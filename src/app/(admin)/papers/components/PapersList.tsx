"use client";

import DataTable from "@/components/tables/DataTable";
import { TABLE_CONFIG } from "@/configs/table";
import { useFetchPapersQuery } from "@/store/api/splits/papers";
import { Copy } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { DeletePaper } from "./DeletePaper";
import { EditPaper } from "./edit-paper/page";
import { PaperDetails } from "./ViewDetails";

interface Grade {
  id: string;
  title: string;
}

interface Subject {
  id: string;
  title: string;
}

interface Paper {
  id: string;
  title?: string;
  description?: string;
  grade?: Grade;
  subject?: Subject;
  year?: string;
  url?: string;
  createdAt?: string;
}

export default function PapersTable() {
  const [page, setPage] = useState<number>(TABLE_CONFIG.DEFAULT_PAGE);
  const limit = TABLE_CONFIG.DEFAULT_LIMIT;

  const { data, isLoading } = useFetchPapersQuery({
    page,
    limit,
    sortBy: "createdAt:desc",
  });

  const papers = data?.results || [];
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

  const getSafeNestedValue = (
    obj: { title?: string; id?: string } | undefined | null,
    property: 'title' | 'id',
    fallback = "N/A"
  ): string => {
    if (!obj || !obj[property]) {
      return fallback;
    }
    return obj[property] || fallback;
  };

  const isValidUrl = (url: string | undefined | null): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const copyToClipboard = async (url: string | undefined | null) => {
    const safeUrl = getSafeValue(url, "");
    if (!safeUrl || safeUrl === "N/A") {
      toast.error("No URL to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(safeUrl);
      toast.success("Paper URL copied to clipboard");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const columns = [
    {
      key: "title",
      header: "Title",
      className: "min-w-[150px] max-w-[250px] truncate overflow-hidden cursor-default",
      render: (row: Paper) => {
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
      key: "subject",
      header: "Subject",
      className: "min-w-[120px] max-w-[180px] truncate overflow-hidden cursor-default",
      render: (row: Paper) => {
        const safeSubjectTitle = getSafeNestedValue(row.subject, 'title', 'No subject');
        return (
          <span 
            title={`Subject: ${safeSubjectTitle}`}
            className={`truncate block ${!row.subject?.title ? 'text-gray-400 italic' : ''}`}
          >
            {safeSubjectTitle}
          </span>
        );
      },
    },
    {
      key: "grade",
      header: "Grade",
      className: "min-w-[100px] max-w-[150px] truncate overflow-hidden cursor-default",
      render: (row: Paper) => {
        const safeGradeTitle = getSafeNestedValue(row.grade, 'title', 'No grade');
        return (
          <span 
            title={`Grade: ${safeGradeTitle}`}
            className={`truncate block ${!row.grade?.title ? 'text-gray-400 italic' : ''}`}
          >
            {safeGradeTitle}
          </span>
        );
      },
    },
    {
      key: "year",
      header: "Year",
      className: "min-w-[80px] max-w-[100px] cursor-default",
      render: (row: Paper) => {
        const safeYear = getSafeValue(row.year, "No year");
        return (
          <span 
            title={`Year: ${safeYear}`}
            className={`${!row.year ? 'text-gray-400 italic' : ''}`}
          >
            {safeYear}
          </span>
        );
      },
    },
    {
      key: "url",
      header: "URL",
      className: "min-w-[200px] max-w-[250px] truncate overflow-hidden cursor-default",
      render: (row: Paper) => {
        const safeUrl = getSafeValue(row.url, "");
        const hasValidUrl = isValidUrl(row.url);
        
        if (!hasValidUrl) {
          return (
            <span className="text-gray-400 italic" title="No valid URL available">
              No URL provided
            </span>
          );
        }

        return (
          <span
            onClick={() => copyToClipboard(row.url)}
            title="Click to copy URL"
            className="cursor-pointer relative group truncate max-w-full flex items-center gap-1 hover:underline hover:text-blue-700 dark:hover:text-blue-400"
          >
            <span className="truncate">{safeUrl}</span>
            <Copy className="w-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-700 dark:text-blue-400 flex-shrink-0" />
          </span>
        );
      },
    },
    {
      key: "edit",
      header: "Edit",
      className: "min-w-[80px] max-w-[80px] cursor-default",
      render: (row: Paper) => (
        <div className="w-full flex justify-center items-center">
          <EditPaper
            id={row.id}
            title={getSafeValue(row.title, "")}
            description={getSafeValue(row.description, "")}
            grade={getSafeNestedValue(row.grade, 'id', "")}
            subject={getSafeNestedValue(row.subject, 'id', "")}
            year={getSafeValue(row.year, "")}
            url={getSafeValue(row.url, "")}
          />
        </div>
      ),
    },
    {
      key: "delete",
      header: "Delete",
      className: "min-w-[80px] max-w-[80px] cursor-default",
      render: (row: Paper) => (
        <div className="w-full flex justify-center items-center">
          <DeletePaper paperId={row.id} />
        </div>
      ),
    },
    {
      key: "view",
      header: "View",
      className: "min-w-[80px] max-w-[80px] cursor-default",
      render: (row: Paper) => (
        <div className="w-full flex justify-center items-center">
          <PaperDetails
            title={getSafeValue(row.title, "No title provided")}
            description={getSafeValue(row.description, "No description provided")}
            grade={getSafeNestedValue(row.grade, 'title', "No grade specified")}
            subject={getSafeNestedValue(row.subject, 'title', "No subject specified")}
            year={getSafeValue(row.year, "No year specified")}
            url={getSafeValue(row.url, "")}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={papers}
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      totalResults={totalResults}
      limit={limit}
      isLoading={isLoading}
    />
  );
}