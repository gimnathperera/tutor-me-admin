"use client";

import DataTable from "@/components/tables/DataTable";
import { TABLE_CONFIG } from "@/configs/table";
import { useFetchBlogsQuery } from "@/store/api/splits/blogs";
import { BlogStatus } from "@/types/blogs-types";
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
        "truncate overflow-hidden lg:min-w-[300px] min-w-[150px] max-w-[250px] sticky left-0 z-20 bg-white dark:bg-gray-900",
      render: (row: Blogs) => {
        const safeTitle = getSafeValue(row.title, "No title provided");
        return (
          <span
            title={`Title: ${safeTitle}`}
            className={`truncate block ${!row.title ? "text-gray-400 italic" : ""}`}
            style={{ width: "inherit" }}
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
      key: "view",
      header: (
        <span className="truncate text-center block w-full" title="View">
          View
        </span>
      ),

      className:
        "lg:min-w-[80px] lg:max-w-[80px] min-w-[80px] max-w-[80px] sticky right-[220px] z-20 bg-white dark:bg-gray-900",
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
        "lg:min-w-[140px] lg:max-w-[140px] min-w-[140px] max-w-[140px] flex justify-center sticky right-[80px] z-20 bg-white dark:bg-gray-900",
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
        <span className="truncate text-center block w-full" title="Delete">
          Delete
        </span>
      ),
      className:
        "lg:min-w-[80px] lg:max-w-[80px] min-w-[80px] max-w-[80px] sticky right-0 z-20 bg-white dark:bg-gray-900",
      render: (row: Blogs) => (
        <div className="w-full flex items-center justify-center">
          <DeleteBlog
            blogId={row.id}
            currentStatus={row.status as BlogStatus}
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
