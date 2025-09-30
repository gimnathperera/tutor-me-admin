"use client";

import DataTable from "@/components/tables/DataTable";
import { TABLE_CONFIG } from "@/configs/table";
import { useFetchBlogsQuery } from "@/store/api/splits/blogs";
import { Blogs } from "@/types/response-types";
import { useState } from "react";
import { DeleteBlog } from "./DeleteBlog";
import { BlogStatusDialog } from "./StatusChangeBlog";
import { BlogDetails } from "./ViewDetails";

export default function BlogsTable() {
  const [page, setPage] = useState<number>(TABLE_CONFIG.DEFAULT_PAGE);
  const limit = TABLE_CONFIG.DEFAULT_LIMIT;

  const { data, isLoading } = useFetchBlogsQuery({
    page,
    limit,
    sortBy: "createdAt:desc",
  });

  const blogs: Blogs[] = data?.results || [];
  const totalPages = data?.totalPages || 0;
  const totalResults = data?.totalResults || 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getSafeValue = (value?: string | null, fallback = "N/A") =>
    value?.trim() ? value : fallback;

  const columns = [
    {
      key: "title",
      header: "Title",
      className:
        "truncate overflow-hidden lg:min-w-[300px] min-w-[150px] max-w-[250px] cursor-default",
      render: (row: Blogs) => {
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
      key: "status",
      header: "Status",
      className:
        "truncate min-w-[150px] max-w-[250px] lg:min-w-[300px] overflow-hidden cursor-default",
      render: (row: Blogs) => {
        const safeStatus = getSafeValue(row.status, "No status");
        const formattedStatus =
          safeStatus.charAt(0).toUpperCase() +
          safeStatus.slice(1).toLowerCase();
        const statusColors: Record<string, string> = {
          approved: "text-green-600",
          rejected: "text-red-600",
          pending: "text-orange-500",
        };

        return (
          <span
            title={`Status: ${formattedStatus}`}
            className={`truncate block ${
              statusColors[safeStatus.toLowerCase()] ?? "text-gray-400 italic"
            }`}
          >
            {formattedStatus}
          </span>
        );
      },
    },

    {
      key: "view",
      header: (
        <span className="truncate text-center block w-full" title="View">
          View
        </span>
      ),

      className:
        " cursor-default lg:min-w-[140px] lg:max-w-[140px] min-w-[80px] max-w-[120px]",
      render: (row: Blogs) => (
        <div className="w-full flex items-center justify-center">
          <BlogDetails
            blog={{
              id: row.id,
              title: getSafeValue(row.title, "No Title"),
              author: {
                name: row.author?.name ?? "Unknown",
                avatar: row.author?.avatar ?? "https://via.placeholder.com/40",
                role: row.author?.role ?? "Author",
              },
              image: row.image,
              status:
                (row.status as "pending" | "approved" | "rejected") ??
                "pending",
              content: (row.content ?? []).map((block, index) => ({
                _id: `${block.type}-${index}`,
                ...block,
              })),
              relatedArticles: row.relatedArticles ?? [],
            }}
          />
        </div>
      ),
    },
    {
      key: "status",
      header: (
        <span className="truncate  block w-full" title="Change Status">
          Change Status
        </span>
      ),
      className:
        "cursor-default lg:min-w-[140px] lg:max-w-[140px] min-w-[80px] max-w-[120px] flex justify-center",
      render: (row: Blogs) => (
        <div className="flex w-full items-center justify-center">
          <BlogStatusDialog
            id={row.id}
            currentStatus={row.status as "pending" | "approved" | "rejected"}
          />
        </div>
      ),
    },
    {
      key: "delete",
      header: (
        <span className="truncate  text-center  block w-full" title="Delete">
          Delete
        </span>
      ),
      className:
        "cursor-default lg:min-w-[140px] lg:max-w-[140px] min-w-[80px] max-w-[120px] ",
      render: (row: Blogs) => (
        <div className="w-full flex items-center justify-center">
          <DeleteBlog blogId={row.id} />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={blogs}
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      totalResults={totalResults}
      limit={limit}
      isLoading={isLoading}
    />
  );
}
