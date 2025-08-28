"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchGradesQuery } from "@/store/api/splits/grades";
import Link from "next/link";
import { useState } from "react";
const GRADE_LIMIT = 10;
const ViewGradePage = () => {
  const [loading, setLoading] = useState(true);
  const { data, isLoading } = useFetchGradesQuery({
    page: 1,
    limit: GRADE_LIMIT,
  });

  const grades = data?.results || [];

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="hidden md:block max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400"
                >
                  Grade Title
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400"
                >
                  Subjects
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell className="text-center py-5">Loading...</TableCell>
                </TableRow>
              ) : grades.length > 0 ? (
                grades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-sm dark:text-white/90">
                        {grade.title}
                      </span>
                      <span className="block text-gray-500 text-xs dark:text-gray-400">
                        {grade.description}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      Subjects
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm">
                      <Link href={`/grade/${grade.id}`}>
                        {" "}
                        <button className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">
                          View
                        </button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="text-center py-5">
                    No grades found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden p-4 space-y-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : grades.length > 0 ? (
            grades.map((grade) => (
              <div
                key={grade.id}
                className="rounded-lg border border-gray-200 dark:border-white/[0.1] p-4 shadow-sm bg-white dark:bg-white/[0.05]"
              >
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {grade.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {grade.description}
                </p>
                <div className="mt-2">
                  <strong className="text-sm text-gray-600 dark:text-gray-300">
                    Subjects:
                  </strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {grade.subjects?.length > 0 ? (
                      grade.subjects.map((subject) => (
                        <div
                          key={subject.id}
                          className="w-full rounded-md border border-gray-200 bg-gray-50 py-1 px-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90"
                        >
                          {subject.title}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400">No subjects</span>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <button className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600">
                    View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No grades found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewGradePage;
