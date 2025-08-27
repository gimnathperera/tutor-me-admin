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
      className: "min-w-[170px] max-w-[170px]",
      bodyClassName: "text-[0.75rem] font-mono",
      render: (row: { id: string }) => (
        <span
          onClick={() => copyToClipboard(row.id)}
          title={"Click to copy"}
          className="cursor-pointer relative group hover:text-blue-700 hover:underline truncate max-w-full flex items-center gap-1"
        >
          {row.id}
          <Copy className="w-4  opacity-0 group-hover:opacity-100 transition-opacity text-blue-700 flex-shrink-0" />
        </span>
      ),
    },
    {
      key: "question",
      header: "Question",
      className: "min-w-[150px] max-w-[200px] truncate overflow-hidden",
    },
    {
      key: "answer",
      header: "Answer",
      className: "min-w-[200px] max-w-[200px] truncate overflow-hidden",
    },
    {
      key: "createdAt",
      header: "Created At",
      className: "min-w-[50px] max-w-[120px] truncate overflow-hidden",
      bodyClassName: "text-[0.75rem] font-mono",
    },
    {
      key: "edit",
      header: "Edit",
      className: "min-w-[10px] max-w-[10px]",
      headClassName: "text-center",
      render: (row: { id: string; question: string; answer: string }) => (
        <div className="flex justify-center items-center">
          <UpdateFAQ id={row.id} question={row.question} answer={row.answer} />
        </div>
      ),
    },
    {
      key: "delete",
      header: "Delete",
      className: "min-w-[10px] max-w-[10px]",
      render: (row: { id: string }) => (
        <div className="flex justify-center items-center">
          <DeleteFAQ faqId={row.id} />
        </div>
      ),
    },
    {
      key: "view",
      header: "View",
      className: "min-w-[10px] max-w-[10px]",
      render: (row: {
        id: string;
        question: string;
        answer: string;
        createdAt: string;
      }) => (
        <div className="flex justify-center items-center">
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

  if (isLoading) return <div>Loading FAQs...</div>;

  return (
    <DataTable
      columns={columns}
      data={faqs}
      page={page}
      totalPages={totalPages}
      totalResults={totalResults}
      limit={limit}
      onPageChange={handlePageChange}
    />
  );
}
