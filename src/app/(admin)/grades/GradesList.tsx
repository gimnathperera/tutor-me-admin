"use client";

import DataTable from "@/components/tables/DataTable";
import { TABLE_CONFIG } from "@/configs/table";
import { useFetchGradesQuery } from "@/store/api/splits/grades";
import { fadeUp, staggerContainer } from "@/types/animation-types";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { DeleteGrade } from "./DeleteGrade";
import { GradeDetails } from "./ViewDetails";
import { UpdateGrade } from "./edit-grade/UpdateGrade";

interface Subject {
  id: string;
  title: string;
}

interface Grade {
  id: string;
  title?: string;
  description?: string;
  subjects?: Subject[];
  createdAt?: string;
}

export default function GradesTable() {
  const [page, setPage] = useState<number>(TABLE_CONFIG.DEFAULT_PAGE);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = TABLE_CONFIG.DEFAULT_LIMIT;

  const { data, isLoading } = useFetchGradesQuery({
    page,
    limit,
    sortBy: "createdAt:desc",
  });

  const totalPages = data?.totalPages || 0;
  const totalResults = data?.totalResults || 0;

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

  const getSafeArray = (value: Subject[] | undefined | null): Subject[] => {
    if (!Array.isArray(value)) return [];
    return value;
  };

  // ✅ FILTER (same as Subjects)
  const filteredGrades = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const grades = data?.results || [];

    if (!query) return grades;

    return grades.filter((grade: Grade) => {
      const title = getSafeValue(grade.title, "").toLowerCase();
      const description = getSafeValue(grade.description, "").toLowerCase();

      return title.includes(query) || description.includes(query);
    });
  }, [data, searchTerm]);

  const columns = [
    {
      key: "title",
      header: "Title",
      className:
        "min-w-[150px] max-w-[250px] truncate overflow-hidden sticky left-0 z-20 bg-white dark:bg-gray-900",
      render: (row: Grade) => {
        const safeTitle = getSafeValue(row.title, "No title provided");
        return (
          <span
            title={`Title: ${safeTitle}`}
            className={`truncate block ${
              !row.title ? "text-gray-400 italic" : ""
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
      className:
        "min-w-[200px] max-w-[300px] truncate overflow-hidden cursor-default",
      render: (row: Grade) => {
        const safeDescription = getSafeValue(
          row.description,
          "No description provided",
        );
        return (
          <span
            title={`Description: ${safeDescription}`}
            className={`truncate block ${
              !row.description ? "text-gray-400 italic" : ""
            }`}
          >
            {safeDescription}
          </span>
        );
      },
    },
    {
      key: "subjects",
      header: "Subjects",
      className: "min-w-[120px]",
      render: (row: Grade) => {
        const safeSubjects = getSafeArray(row.subjects);
        const count = safeSubjects.length;

        return (
          <span
            className={
              count === 0
                ? "text-gray-400 italic"
                : "text-blue-600 dark:text-blue-400"
            }
          >
            {count === 0 ? "No subjects" : `${count} subjects`}
          </span>
        );
      },
    },
    {
      key: "view",
      header: <div className="text-center">View</div>,
      render: (row: Grade) => (
        <div className="flex justify-center">
          <GradeDetails
            title={getSafeValue(row.title)}
            description={getSafeValue(row.description)}
            subjects={getSafeArray(row.subjects)}
          />
        </div>
      ),
    },
    {
      key: "edit",
      header: <div className="text-center">Edit</div>,
      render: (row: Grade) => (
        <div className="flex justify-center">
          <UpdateGrade
            id={row.id}
            title={getSafeValue(row.title, "")}
            description={getSafeValue(row.description, "")}
            subjects={getSafeArray(row.subjects).map((s) => s.title)}
          />
        </div>
      ),
    },
    {
      key: "delete",
      header: <div className="text-center">Delete</div>,
      render: (row: Grade) => (
        <div className="flex justify-center">
          <DeleteGrade gradeId={row.id} />
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
      {/* 🔍 FILTER BAR */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm dark:bg-gray-900 sm:flex-row sm:justify-between"
      >
        <div>
          <h2 className="font-semibold">Grades</h2>
          <p className="text-sm text-gray-500">
            Filter grades by title or description
          </p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Filter grades..."
            className="h-11 w-full rounded-xl border pl-10 pr-4 text-sm"
          />
        </div>
      </motion.div>

      <DataTable
        columns={columns}
        data={filteredGrades}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalResults={searchTerm ? filteredGrades.length : totalResults}
        limit={limit}
        isLoading={isLoading}
      />
    </motion.div>
  );
}
