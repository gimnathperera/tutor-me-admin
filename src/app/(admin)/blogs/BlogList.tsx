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
      className: "truncate overflow-hidden cursor-default",
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
      className: "truncate overflow-hidden cursor-default",
      render: (row: Blogs) => {
        const safeStatus = getSafeValue(row.status, "No status");
        return (
          <span
            title={`Status: ${safeStatus}`}
            className={`truncate block ${!row.status ? "text-gray-400 italic" : ""}`}
          >
            {safeStatus}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Change Status",
      className: "",
      render: (row: Blogs) => (
        <div className="flex items-left justify-left">
          <BlogStatusDialog
            id={row.id}
            currentStatus={row.status as "pending" | "approved" | "rejected"}
          />
        </div>
      ),
    },

    {
      key: "delete",
      header: "Delete",
      className: "cursor-default",
      render: (row: Blogs) => (
        <div className="w-full flex items-left justify-left">
          <DeleteBlog blogId={row.id} />
        </div>
      ),
    },
    {
      key: "view",
      header: "View",
      className: " cursor-default",
      render: (row: Blogs) => (
        <div className="w-full flex items-left justify-left">
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
