"use client";

import { useState } from "react";
import DataTable from "@/components/tables/DataTable";
import { useFetchFaqsQuery } from "@/store/api/splits/faqs";
import { DeleteFAQ } from "./DeleteFAQ";
import { UpdateFAQ } from "./edit-faq/page";
import { FAQDetails } from "./FAQDetails";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function FAQTable() {
  const [page, setPage] = useState(1);
  const limit = 10;

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
  `
  `;
  const copyToClipboard = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("FAQ ID copied to clipboard");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    }
  };
  const columns = [
    {
      key: "id",
      header: "ID",
      className: "min-w-[210px] max-w-[210px] cursor-default",
      bodyClassName: "text-[0.75rem] font-mono",
      render: (row: { id: string }) => (
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
      className: "min-w-[200px] max-w-[300px] truncate overflow-hidden cursor-default",
      render: (row: { question: string }) => (
        <span title={`Question: ${row.question}`} className="truncate block">
          {row.question}
        </span>
      ),
    },
    {
      key: "answer",
      header: "Answer",
      className: "min-w-[200px] max-w-[300px] truncate overflow-hidden cursor-default",
      bodyClassName: "text-left",
      render: (row: { answer: string }) => (
        <span title={`Answer: ${row.answer}`} className="truncate block">
          {row.answer}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created At",
      className: "min-w-[140px] max-w-[140px] truncate overflow-hidden cursor-default",
      bodyClassName: "text-[0.75rem] font-mono",
      render: (row: { createdAt: string }) => {
        const date = new Date(row.createdAt);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      key: "edit",
      header: "Edit",
      className: "min-w-[10px] max-w-[10px] cursor-default",
      render: (row: { id: string; question: string; answer: string }) => (
        <div className="w-full flex justify-center items-center">
          <UpdateFAQ id={row.id} question={row.question} answer={row.answer} />
        </div>
      ),
    },
    {
      key: "delete",
      header: "Delete",
      className: "min-w-[10px] max-w-[10px] cursor-default",
      render: (row: { id: string }) => (
        <div className="w-full flex justify-center items-center">
          <DeleteFAQ faqId={row.id} />
        </div>
      ),
    },
    {
      key: "view",
      header: "View",
      className: "min-w-[10px] max-w-[10px] cursor-default",
      render: (row: {
        id: string;
        question: string;
        answer: string;
        createdAt: string;
      }) => (
        <div className="w-full flex justify-center items-center">
          <FAQDetails
            id={row.id}
            question={row.question}
            answer={row.answer}
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
