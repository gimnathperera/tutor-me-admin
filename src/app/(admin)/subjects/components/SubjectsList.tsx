"use client";

import DataTable from "@/components/tables/DataTable";
import { TABLE_CONFIG } from "@/configs/table";
import { useFetchSubjectsQuery } from "@/store/api/splits/subjects";
import { fadeUp, staggerContainer } from "@/types/animation-types";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { DeleteSubject } from "./DeleteSubject";
import { UpdateSubject } from "./edit-subject/UpdateSubject";
import { SubjectDetails } from "./ViewDetails";

interface Subject {
  id: string;
  title?: string;
  description?: string;
  createdAt?: string;
}

export default function SubjectsTable() {
  const [page, setPage] = useState<number>(TABLE_CONFIG.DEFAULT_PAGE);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = TABLE_CONFIG.DEFAULT_LIMIT;

  // ✅ FETCH MORE DATA (for full filtering)
  const { data, isLoading } = useFetchSubjectsQuery({
    page: 1,
    limit: 1000,
    sortBy: "createdAt:desc",
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getSafeValue = (
    value: string | undefined | null,
    fallback = "N/A",
  ): string => {
    if (value === undefined || value === null || value.trim() === "") {
      return fallback;
    }
    return value;
  };

  // ✅ FILTER FULL DATASET
  const filteredSubjects = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const subjects = data?.results || [];

    if (!query) return subjects;

    return subjects.filter((subject: Subject) =>
      getSafeValue(subject.title, "").toLowerCase().includes(query),
    );
  }, [data, searchTerm]);

  // ✅ PAGINATE AFTER FILTER
  const paginatedSubjects = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredSubjects.slice(start, end);
  }, [filteredSubjects, page, limit]);

  const totalResults = filteredSubjects.length;
  const totalPages = Math.ceil(totalResults / limit);

  const columns = [
    {
      key: "title",
      header: "Title",
      className:
        "min-w-[150px] max-w-[250px] truncate overflow-hidden sticky left-0 z-20 bg-white dark:bg-gray-900",
      render: (row: Subject) => {
        const safeTitle = getSafeValue(row.title, "No title provided");
        return (
          <span
            title={`Title: ${safeTitle}`}
            className={`block truncate ${
              !row.title ? "italic text-gray-400" : ""
            }`}
          >
            {safeTitle}
          </span>
        );
      },
    },
    {
      key: "description",
      header: "Description",
      className: "min-w-[200px] max-w-[300px] truncate overflow-hidden",
      render: (row: Subject) => {
        const safeDescription = getSafeValue(
          row.description,
          "No description provided",
        );
        return (
          <span
            title={`Description: ${safeDescription}`}
            className={`block truncate ${
              !row.description ? "italic text-gray-400" : ""
            }`}
          >
            {safeDescription}
          </span>
        );
      },
    },
    {
      key: "view",
      header: <div className="w-full text-center">View</div>,
      render: (row: Subject) => (
        <div className="flex justify-center">
          <SubjectDetails
            title={getSafeValue(row.title)}
            description={getSafeValue(row.description)}
          />
        </div>
      ),
    },
    {
      key: "edit",
      header: <div className="w-full text-center">Edit</div>,
      render: (row: Subject) => (
        <div className="flex justify-center">
          <UpdateSubject
            id={row.id}
            title={getSafeValue(row.title, "")}
            description={getSafeValue(row.description, "")}
          />
        </div>
      ),
    },
    {
      key: "delete",
      header: <div className="w-full text-center">Delete</div>,
      render: (row: Subject) => (
        <div className="flex justify-center">
          <DeleteSubject subjectId={row.id} />
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
      {/* FILTER BAR */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm dark:bg-gray-900 sm:flex-row sm:justify-between"
      >
        <div>
          <h2 className="font-semibold">Subjects</h2>
          <p className="text-sm text-gray-500">Filter subjects by title</p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Filter subjects..."
            className="h-11 w-full rounded-xl border pl-10 pr-4 text-sm"
          />
        </div>
      </motion.div>

      <DataTable
        columns={columns}
        data={paginatedSubjects}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalResults={totalResults}
        limit={limit}
        isLoading={isLoading}
      />
    </motion.div>
  );
}
