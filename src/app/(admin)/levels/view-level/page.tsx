"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchLevelsQuery } from "@/store/api/splits/levels";
import Link from "next/link";
import { useState } from "react";
const LIMIT = 10;

interface Level {
  id: string;
  title: string;
  details: string[];
}

const ViewLevelPage = () => {
  const [ loading ] = useState(true);
  const { data } = useFetchLevelsQuery({
    page: 1,
    limit: LIMIT,
  });

  const levels = data?.results || [];

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="hidden md:block max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start">
                  Level Title
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start">
                  Details
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell className="text-center py-5">Loading...</TableCell>
                </TableRow>
              ) : levels.length > 0 ? (
                levels.map((level: Level) => (
                  <TableRow key={level.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-sm">
                        {level.title}
                      </span>
                      <span className="block text-gray-500 text-xs">
                        {(level.details || []).slice(0, 2).join(", ")}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {(level.details || []).length} item(s)
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm">
                      <Link href={`/level/${level.id}`}>
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
                    No levels found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="block md:hidden p-4 space-y-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : levels.length > 0 ? (
            levels.map((level: Level) => (
              <div
                key={level.id}
                className="rounded-lg border border-gray-200 p-4 shadow-sm bg-white"
              >
                <h3 className="font-semibold text-gray-800">{level.title}</h3>
                <p className="text-sm text-gray-500">
                  {(level.details || []).slice(0, 3).join(", ")}
                </p>
                <div className="mt-3">
                  <button className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600">
                    View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No levels found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewLevelPage;
