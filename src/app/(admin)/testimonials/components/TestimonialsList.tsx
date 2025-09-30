"use client";

import DataTable from "@/components/tables/DataTable";
import { TABLE_CONFIG } from "@/configs/table";
import { useFetchTestimonialsQuery } from "@/store/api/splits/testimonials";
import { Star } from "lucide-react";
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
              src={row.owner.avatar}
              alt={row.owner?.name || "Owner"}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "/images/user/user.png";
              }}
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
        const safeContent = getSafeValue(row.content, "No content provided");
        return (
          <span
            className={`truncate block ${
              !row.content ? "text-gray-400 italic" : ""
            }`}
          >
            {safeContent}
          </span>
        );
      },
    },
    {
      key: "rating",
      header: "Rating",
      className: "min-w-[120px] max-w-[160px] text-center",
      render: (row: Testimonial) => {
        const numericRating = Number(row.rating) || 0;
        return (
          <div className="flex items-center justify-center gap-1">
            {/* Stars */}
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < numericRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-400"
                  }
                />
              ))}
            </div>
            {/* Number */}
            <span className="text-xs text-gray-400">
              ({numericRating || "N/A"})
            </span>
          </div>
        );
      },
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
            owner={row.owner}
          />
        </div>
      ),
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
            rating={Number(row.rating) || 0}
            owner={{
              name: getSafeValue(row.owner?.name, ""),
              role: getSafeValue(row.owner?.role, ""),
              avatar: getSafeValue(row.owner?.avatar, ""),
            }}
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
