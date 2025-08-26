"use client";

import DataTable from "@/components/tables/DataTable";
import { useFetchFaqsQuery } from "@/store/api/splits/faqs";
import { DeleteFAQ } from "./DeleteFAQ";
import { UpdateFAQ } from "./edit-faq/page";
import { FAQDetails } from "./FAQDetails";

export default function FAQTable() {
  const { data, isLoading } = useFetchFaqsQuery({});
  const faqs = data?.results || [];

  const columns = [
    {
      key: "id",
      header: "ID",
      className: "min-w-[40px] max-w-[50px] truncate overflow-hidden",
    },
    {
      key: "question",
      header: "Question",
      className: "min-w-[250px] max-w-[300px] truncate overflow-hidden",
    },
    {
      key: "answer",
      header: "Answer",
      className: "min-w-[200px] max-w-[300px] truncate overflow-hidden",
    },
    {
      key: "createdAt",
      header: "Created At",
      className: "min-w-[80px] max-w-[80px] truncate overflow-hidden",
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
