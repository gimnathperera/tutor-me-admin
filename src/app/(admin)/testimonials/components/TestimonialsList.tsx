"use client";

import DataTable from "@/components/tables/DataTable";
import { TABLE_CONFIG } from "@/configs/table";
import { useFetchTestimonialsQuery } from "@/store/api/splits/testimonials";
import Image from "next/image";
import { useState } from "react";
import { DeleteTestimonial } from "./DeleteTestimonial";
import { UpdateTestimonial } from "./edit-testimonial/page";
import { TestimonialDetails } from "./ViewDetails";

interface Testimonial {
  id: string;
  content?: string;
  rating?: string | number;
  createdAt?: string;
  owner?: {
    name?: string;
    role?: string;
    avatar?: string;
  };
}

export default function TestimonialsTable() {
  const [page, setPage] = useState<number>(TABLE_CONFIG.DEFAULT_PAGE);
  const limit = TABLE_CONFIG.DEFAULT_LIMIT;

  const { data, isLoading } = useFetchTestimonialsQuery({
    page,
    limit,
    sortBy: "createdAt:desc",
  });

  const testimonials = data?.results || [];
  const totalPages = data?.totalPages || 0;
  const totalResults = data?.totalResults || 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getSafeValue = (value: unknown, fallback = "N/A"): string => {
    if (value === undefined || value === null) {
      return fallback;
    }
    const strValue = String(value);
    if (strValue.trim() === "") {
      return fallback;
    }
    return strValue;
  };

  const columns = [
    {
      key: "owner",
      header: "Owner",
      className: "min-w-[200px] max-w-[250px] truncate overflow-hidden",
      render: (row: Testimonial) => (
        <div className="flex items-center gap-3">
          {row.owner?.avatar ? (
            <Image
              src={row.owner?.avatar || "/images/user/user.png"}
              alt={row.owner?.name || "Owner"}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
              ?
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium">
              {getSafeValue(row.owner?.name, "Unknown")}
            </span>
            <span className="text-xs text-gray-500">
              {getSafeValue(row.owner?.role, "No role")}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "content",
      header: "Content",
      className:
        "min-w-[150px] max-w-[250px] truncate overflow-hidden cursor-default",
      render: (row: Testimonial) => {
        const safeTitle = getSafeValue(row.content, "No content provided");
        return (
          <span
            className={`truncate block ${!row.content ? "text-gray-400 italic" : ""}`}
          >
            {safeTitle}
          </span>
        );
      },
    },
    {
      key: "rating",
      header: (
        <div className="flex justify-center items-center w-full text-center">
          Rating
        </div>
      ),
      className:
        "min-w-[100px] max-w-[150px] truncate text-center flex justify-center items-center",
      render: (row: Testimonial) => {
        const safeDescription = getSafeValue(row.rating, "No rating provided");
        return (
          <span
            className={`truncate text-center ${
              !row.rating ? "text-gray-400 italic" : ""
            }`}
          >
            {safeDescription}
          </span>
        );
      },
    },
    {
      key: "edit",
      header: <div className="text-center w-full">Edit</div>,
      className: "min-w-[80px] max-w-[80px] cursor-default text-center",
      render: (row: Testimonial) => (
        <div className="w-full flex justify-center items-center">
          <UpdateTestimonial
            id={row.id}
            content={getSafeValue(row.content, "")}
            rating={getSafeValue(row.rating, "")}
          />
        </div>
      ),
    },
    {
      key: "delete",
      header: <div className="text-center w-full">Delete</div>,
      className: "min-w-[80px] max-w-[80px] cursor-default text-center",
      render: (row: Testimonial) => (
        <div className="w-full flex justify-center items-center">
          <DeleteTestimonial testimonialId={row.id} />
        </div>
      ),
    },
    {
      key: "view",
      header: <div className="text-center w-full">View</div>,
      className: "min-w-[80px] max-w-[80px] cursor-default text-center",
      render: (row: Testimonial) => (
        <div className="w-full flex justify-center items-center">
          <TestimonialDetails
            content={getSafeValue(row.content, "No content provided")}
            rating={getSafeValue(row.rating, "No rating provided")}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={testimonials}
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      totalResults={totalResults}
      limit={limit}
      isLoading={isLoading}
    />
  );
}
