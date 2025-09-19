"use client";

import { useState } from "react";
import DataTable from "@/components/tables/DataTable";
import { useFetchInquiriesQuery } from "@/store/api/splits/inquiries";
import { Copy } from "lucide-react";
import { DeleteInquiry } from "./DeleteInquiry";
import { InquiryDetails } from "./ViewInquiries";
import toast from "react-hot-toast";

export default function InquiryTable() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useFetchInquiriesQuery({
    page,
    limit,
    sortBy: "createdAt:desc",
  });

  const inquiries =
    data?.results.map((inq: any) => ({
      ...inq,
      senderName: inq.sender?.name || "",
      senderEmail: inq.sender?.email || "",
    })) || [];
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
      toast.success("Inquiry ID copied to clipboard");
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
      key: "senderName",
      header: "Sender Name",
      className:
        "min-w-[100px] max-w-[150px] truncate overflow-hidden cursor-default",
      render: (row: { senderName: string }) => (
        <span
          title={`Sender Name: ${row.senderName}`}
          className="truncate block"
        >
          {row.senderName}
        </span>
      ),
    },
    {
      key: "senderEmail",
      header: "Sender Email",
      className:
        "min-w-[200px] max-w-[200px] truncate overflow-hidden cursor-default",
      render: (row: { senderEmail: string }) => (
        <span
          title={`Sender Email: ${row.senderEmail}`}
          className="truncate block"
        >
          {row.senderEmail}
        </span>
      ),
    },
    {
      key: "message",
      header: "Inquiry",
      className:
        "min-w-[200px] max-w-[300px] truncate overflow-hidden cursor-default",
      render: (row: { message: string }) => (
        <span title={`Message: ${row.message}`} className="truncate block">
          {row.message}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created At",
      className:
        "min-w-[140px] max-w-[140px] truncate overflow-hidden cursor-default",
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
      key: "delete",
      header: <div className="text-center w-full">Delete</div>,
      className: "min-w-[10px] max-w-[10px] cursor-default",
      render: (row: { id: string }) => (
        <div className="w-full flex justify-center items-center">
          <DeleteInquiry inquiryId={row.id} />
        </div>
      ),
    },
    {
      key: "view",
      header: <div className="text-center w-full">View</div>,
      className: "min-w-[10px] max-w-[10px] cursor-default",
      render: (row: {
        id: string;
        createdAt: string;
        senderName: string;
        senderEmail: string;
        message: string;
      }) => (
        <div className="w-full flex justify-center items-center">
          <InquiryDetails
            id={row.id}
            senderName={row.senderName}
            senderEmail={row.senderEmail}
            message={row.message}
            createdAt={row.createdAt}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={inquiries}
      page={page}
      totalPages={totalPages}
      totalResults={totalResults}
      limit={limit}
      onPageChange={handlePageChange}
      isLoading={isLoading}
    />
  );
}
