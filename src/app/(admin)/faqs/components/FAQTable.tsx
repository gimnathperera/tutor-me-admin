"use client";

import DataTable from "@/components/tables/DataTable";
import { TABLE_CONFIG } from "@/configs/table";
import { useFetchFaqsQuery } from "@/store/api/splits/faqs";
import { Copy } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { DeleteFAQ } from "./DeleteFAQ";
import { UpdateFAQ } from "./edit-faq/page";
import { FAQDetails } from "./FAQDetails";

interface FAQ {
  id: string;
  question?: string;
  answer?: string;
  createdAt: string;
}

export default function FAQTable() {
  const [page, setPage] = useState<number>(TABLE_CONFIG.DEFAULT_PAGE);
  const limit = TABLE_CONFIG.DEFAULT_LIMIT;

  const { data, isLoading } = useFetchFaqsQuery({
    page,
    limit,
  });

  const faqs = data?.results || [];
  const totalPages = data?.totalPages || 0;
  const totalResults = data?.totalResults || 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const copyToClipboard = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("FAQ ID copied to clipboard");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    }
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

  const columns = [
    {
      key: "id",
      header: "ID",
      className: "min-w-[210px] max-w-[210px] cursor-default",
      bodyClassName: "text-[0.75rem] font-mono",
      render: (row: FAQ) => (
        <span
          onClick={() => copyToClipboard(row.id)}
          title={"Click to copy"}
          className="cursor-pointer relative group truncate max-w-full flex items-center gap-1 hover:underline hover:text-blue-700 dark:hover:text-blue-400"
        >
          {row.id}
          <Copy className="w-4 opacity-0 group-hover:opacity-100 transition-opacity text:text-blue-700 dark:text-blue-400 flex-shrink-0" />
        </span>
      ),
    },
    {
      key: "question",
      header: "Question",
      className:
        "min-w-[200px] max-w-[300px] truncate overflow-hidden cursor-default",
      render: (row: FAQ) => {
        const safeQuestion = getSafeValue(row.question, "No question provided");
        return (
          <span
            title={`Question: ${safeQuestion}`}
            className={`truncate block ${!row.question ? "text-gray-400 italic" : ""}`}
          >
            {safeQuestion}
          </span>
        );
      },
    },
    {
      key: "answer",
      header: "Answer",
      className:
        "min-w-[200px] max-w-[300px] truncate overflow-hidden cursor-default",
      bodyClassName: "text-left",
      render: (row: FAQ) => {
        const safeAnswer = getSafeValue(row.answer, "No answer provided");
        return (
          <span
            title={`Answer: ${safeAnswer}`}
            className={`truncate block ${!row.answer ? "text-gray-400 italic" : ""}`}
          >
            {safeAnswer}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      header: "Created At",
      className:
        "min-w-[140px] max-w-[140px] truncate overflow-hidden cursor-default",
      bodyClassName: "text-[0.75rem] font-mono",
      render: (row: FAQ) => {
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
      key: "edit",
      header: "Edit",
      className: "min-w-[10px] max-w-[10px] cursor-default",
      render: (row: FAQ) => (
        <div className="w-full flex justify-center items-center">
          <UpdateFAQ
            id={row.id}
            question={getSafeValue(row.question, "")}
            answer={getSafeValue(row.answer, "")}
          />
        </div>
      ),
    },
    {
      key: "delete",
      header: "Delete",
      className: "min-w-[10px] max-w-[10px] cursor-default",
      render: (row: FAQ) => (
        <div className="w-full flex justify-center items-center">
          <DeleteFAQ faqId={row.id} />
        </div>
      ),
    },
    {
      key: "view",
      header: "View",
      className: "min-w-[10px] max-w-[10px] cursor-default",
      render: (row: FAQ) => (
        <div className="w-full flex justify-center items-center">
          <FAQDetails
            id={row.id}
            question={getSafeValue(row.question, "No question provided")}
            answer={getSafeValue(row.answer, "No answer provided")}
            createdAt={row.createdAt}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={faqs}
      page={page}
      totalPages={totalPages}
      totalResults={totalResults}
      limit={limit}
      onPageChange={handlePageChange}
      isLoading={isLoading}
    />
  );
}
