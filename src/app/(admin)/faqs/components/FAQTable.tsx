"use client";

import DataTable from "@/components/tables/DataTable";
import { useFetchFaqsQuery } from "@/store/api/splits/faqs";
import { DeleteFAQ } from "./DeleteFAQ";
import { UpdateFAQ } from "./edit-faq/page";
import { FAQDetails } from "./FAQDetails";

export default function FAQTable() {
  const { data, isLoading } = useFetchFaqsQuery({page: 1, limit: 100});
  const faqs = data?.results || [];

  const columns = [
    {
      key: "id",
      header: "ID",
      className: "max-w-[150px] truncate overflow-hidden",
      bodyClassName: "text-[0.75rem] font-mono",
    },
    {
      key: "question",
      header: "Question",
      className: "max-w-[200px] truncate overflow-hidden",
    },
    {
      key: "answer",
      header: "Answer",
      className: "min-w-[100px] max-w-[200px] truncate overflow-hidden",
    },
    {
      key: "createdAt",
      header: "Created At",
      className: "min-w-[80px] max-w-[120px] truncate overflow-hidden",
      bodyClassName: "text-[0.75rem] font-mono",
    },
    {
      key: "edit",
      header: "Edit",
      className: "min-w-[10px] max-w-[10px]",
      render: (row: { id: string; question: string; answer: string }) => (
        <UpdateFAQ id={row.id} question={row.question} answer={row.answer} />
      ),
    },
    {
      key: "delete",
      header: "Delete",
      className: "min-w-[10px] max-w-[10px]",
      render: (row: { id: string }) => (
        <div>
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
        <div>
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

  if (isLoading) {
    return <div>Loading FAQs...</div>;
  }

  return <DataTable columns={columns} data={faqs} />;
}
