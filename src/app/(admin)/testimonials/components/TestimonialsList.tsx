"use client";

/* eslint-disable @next/next/no-img-element */

import DataTable from "@/components/tables/DataTable";
import { TABLE_CONFIG } from "@/configs/table";
import { useFetchTestimonialsQuery } from "@/store/api/splits/testimonials";
import { fadeUp, staggerContainer } from "@/types/animation-types";
import { Search, Star, User } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { DeleteTestimonial } from "./DeleteTestimonial";
import { UpdateTestimonial } from "./edit-testimonial/UpdateTestimonial";
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
  const [searchTerm, setSearchTerm] = useState("");
  const limit = TABLE_CONFIG.DEFAULT_LIMIT;

  const { data, isLoading } = useFetchTestimonialsQuery({
    page,
    limit,
    sortBy: "createdAt:desc",
  });

  const totalPages = data?.totalPages || 0;
  const totalResults = data?.totalResults || 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getSafeValue = (value: unknown, fallback = "N/A"): string => {
    if (value === undefined || value === null) return fallback;
    const str = String(value);
    return str.trim() === "" ? fallback : str;
  };

  const filteredTestimonials = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    const testimonials = data?.results || [];

    if (!query) return testimonials;

    return testimonials.filter((t: Testimonial) =>
      getSafeValue(t.owner?.name, "").toLowerCase().includes(query),
    );
  }, [data, searchTerm]);

  const columns = [
    {
      key: "owner",
      header: "Owner",
      className:
        "min-w-[200px] max-w-[250px] truncate overflow-hidden sticky left-0 z-20 bg-white dark:bg-gray-900",
      render: (row: Testimonial) => (
        <div className="flex items-center gap-3">
          {row.owner?.avatar ? (
            <img
              src={row.owner?.avatar || "/images/user/user.png"}
              alt={getSafeValue(row.owner?.name, "User avatar")}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <User size={14} />
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
            className={`block truncate ${
              !row.content ? "italic text-gray-400" : ""
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
      className: "min-w-[120px] text-center",
      render: (row: Testimonial) => {
        const rating = Number(row.rating) || 0;
        return (
          <div className="flex items-center justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-400"
                }
              />
            ))}
            <span className="text-xs text-gray-400">({rating || "N/A"})</span>
          </div>
        );
      },
    },
    {
      key: "view",
      header: <div className="text-center">View</div>,
      className:
        "min-w-[80px] text-center sticky right-[160px] z-20 bg-white dark:bg-gray-900",
      render: (row: Testimonial) => (
        <div className="flex justify-center">
          <TestimonialDetails
            content={getSafeValue(row.content)}
            rating={getSafeValue(row.rating)}
            owner={row.owner}
          />
        </div>
      ),
    },
    {
      key: "edit",
      header: <div className="text-center">Edit</div>,
      className:
        "min-w-[80px] text-center sticky right-[80px] z-20 bg-white dark:bg-gray-900",
      render: (row: Testimonial) => (
        <div className="flex justify-center">
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
      header: <div className="text-center">Delete</div>,
      className:
        "min-w-[80px] text-center sticky right-0 z-20 bg-white dark:bg-gray-900",
      render: (row: Testimonial) => (
        <div className="flex justify-center">
          <DeleteTestimonial testimonialId={row.id} />
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer}
      className="space-y-4"
    >
      <motion.div
        variants={fadeUp}
        className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm dark:bg-gray-900 sm:flex-row sm:justify-between"
      >
        <div>
          <h2 className="font-semibold">Testimonials</h2>
          <p className="text-sm text-gray-500">Filter by owner name</p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="filter by owner..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
          />
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="hidden md:block">
        <DataTable
          columns={columns}
          data={filteredTestimonials}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalResults={searchTerm ? filteredTestimonials.length : totalResults}
          limit={limit}
          isLoading={isLoading}
        />
      </motion.div>

      <motion.div className="grid gap-4 md:hidden">
        {filteredTestimonials.map((row) => (
          <motion.div
            key={row.id}
            variants={fadeUp}
            className="rounded-2xl border bg-white p-4 dark:bg-gray-900"
          >
            <div className="flex items-center gap-3">
              <img
                src={row.owner?.avatar || "/images/user/user.png"}
                alt={getSafeValue(row.owner?.name, "User avatar")}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium">{getSafeValue(row.owner?.name)}</p>
                <p className="text-xs text-gray-500">
                  {getSafeValue(row.owner?.role)}
                </p>
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-600">
              {getSafeValue(row.content)}
            </p>

            <div className="mt-2 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Number(row.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-400"
                  }
                />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
