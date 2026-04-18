"use client";

import DataTable from "@/components/tables/DataTable";
import { TABLE_CONFIG } from "@/configs/table";
import { useFetchTuitionRatesQuery } from "@/store/api/splits/tuition-rates";
import { fadeUp, staggerContainer } from "@/types/animation-types";
import { Layers3, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { DeleteTuitionRate } from "./DeleteTuitionRate";
import { TuitionRateDetails } from "./ViewDetails";
import { UpdateTuitionRate } from "./edit-tuition-rates/UpdateTuitionRate";

interface RateDetail {
  id: string;
  title: string;
}

interface TuitionRateObject {
  _id?: string;
  minimumRate: string;
  maximumRate: string;
}

interface TuitionRateData {
  id: string;
  subject: RateDetail;
  grade: RateDetail | null;
  onlineIndividualTuitionRate: TuitionRateObject[];
  onlineGroupTuitionRate: TuitionRateObject[];
  physicalIndividualTuitionRate: TuitionRateObject[];
  physicalGroupTuitionRate: TuitionRateObject[];
}

export default function TuitionRatesTable() {
  const [page, setPage] = useState<number>(TABLE_CONFIG.DEFAULT_PAGE);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = TABLE_CONFIG.DEFAULT_LIMIT;

  const { data, isLoading } = useFetchTuitionRatesQuery({
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

  const filteredTuitionRates = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const tuitionRates = data?.results || [];

    if (!query) return tuitionRates;

    return tuitionRates.filter((rate: TuitionRateData) => {
      const grade = getSafeValue(rate.grade?.title, "").toLowerCase();
      const subject = getSafeValue(rate.subject?.title, "").toLowerCase();

      return grade.includes(query) || subject.includes(query);
    });
  }, [data, searchTerm]);

  const columns = [
    {
      key: "grade",
      header: "Grade",
      className:
        "min-w-[150px] max-w-[250px] truncate overflow-hidden sticky left-0 z-20 bg-white dark:bg-gray-900",
      render: (row: TuitionRateData) => {
        const safeGrade = getSafeValue(row.grade?.title, "N/A");
        return (
          <span
            title={safeGrade}
            className={`block truncate ${
              !row.grade?.title ? "italic text-gray-400" : ""
            }`}
            style={{ width: "inherit" }}
          >
            {safeGrade}
          </span>
        );
      },
    },
    {
      key: "subject",
      header: "Subject",
      className:
        "min-w-[150px] max-w-[250px] truncate overflow-hidden cursor-default",
      render: (row: TuitionRateData) => {
        const safeSubject = getSafeValue(row.subject?.title, "N/A");
        return (
          <span
            title={safeSubject}
            className={`block truncate ${
              !row.subject?.title ? "italic text-gray-400" : ""
            }`}
          >
            {safeSubject}
          </span>
        );
      },
    },
    {
      key: "view",
      header: <div className="w-full text-center">View</div>,
      className:
        "min-w-[80px] max-w-[80px] sticky right-[160px] z-20 bg-white dark:bg-gray-900",
      render: (row: TuitionRateData) => (
        <div className="flex w-full items-center justify-center">
          <TuitionRateDetails
            grade={row.grade || { id: "", title: "N/A" }}
            subject={row.subject || { id: "", title: "N/A" }}
            onlineIndividualTuitionRate={row.onlineIndividualTuitionRate || []}
            onlineGroupTuitionRate={row.onlineGroupTuitionRate || []}
            physicalIndividualTuitionRate={
              row.physicalIndividualTuitionRate || []
            }
            physicalGroupTuitionRate={row.physicalGroupTuitionRate || []}
          />
        </div>
      ),
    },
    {
      key: "edit",
      header: <div className="w-full text-center">Edit</div>,
      className:
        "min-w-[80px] max-w-[80px] sticky right-[80px] z-20 bg-white dark:bg-gray-900",
      render: (row: TuitionRateData) => (
        <div className="flex w-full items-center justify-center">
          <UpdateTuitionRate
            id={row.id}
            subject={row.subject?.id || ""}
            grade={row.grade?.id || ""}
            onlineIndividualTuitionRate={row.onlineIndividualTuitionRate || []}
            onlineGroupTuitionRate={row.onlineGroupTuitionRate || []}
            physicalIndividualTuitionRate={
              row.physicalIndividualTuitionRate || []
            }
            physicalGroupTuitionRate={row.physicalGroupTuitionRate || []}
          />
        </div>
      ),
    },
    {
      key: "delete",
      header: <div className="w-full text-center">Delete</div>,
      className:
        "min-w-[80px] max-w-[80px] sticky right-0 z-20 bg-white dark:bg-gray-900",
      render: (row: TuitionRateData) => (
        <div className="flex w-full items-center justify-center">
          <DeleteTuitionRate gradeId={row.id || ""} />
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
        className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Tuition Rates
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Filter tuition rates by grade or subject and manage them across
            desktop and mobile.
          </p>
        </div>

        <motion.div layout className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(TABLE_CONFIG.DEFAULT_PAGE);
            }}
            placeholder="Filter by grade or subject..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
          />
        </motion.div>
      </motion.div>

      <motion.div variants={fadeUp} className="hidden md:block">
        <motion.div layout className="overflow-hidden rounded-2xl">
          <DataTable
            columns={columns}
            data={filteredTuitionRates}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalResults={
              searchTerm ? filteredTuitionRates.length : totalResults
            }
            limit={limit}
            isLoading={isLoading}
          />
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:hidden"
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mt-3 h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mt-4 h-9 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
            </motion.div>
          ))
        ) : filteredTuitionRates.length > 0 ? (
          filteredTuitionRates.map((row) => {
            const safeGrade = getSafeValue(row.grade?.title, "N/A");
            const safeSubject = getSafeValue(row.subject?.title, "N/A");

            return (
              <motion.div
                key={row.id}
                variants={fadeUp}
                layout
                whileHover={{ y: -3 }}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {safeGrade}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                      {safeSubject}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <Layers3 className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-800">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Subject
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {safeSubject}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="flex justify-center rounded-xl border border-gray-200 p-2 dark:border-gray-700">
                    <TuitionRateDetails
                      grade={row.grade || { id: "", title: "N/A" }}
                      subject={row.subject || { id: "", title: "N/A" }}
                      onlineIndividualTuitionRate={
                        row.onlineIndividualTuitionRate || []
                      }
                      onlineGroupTuitionRate={row.onlineGroupTuitionRate || []}
                      physicalIndividualTuitionRate={
                        row.physicalIndividualTuitionRate || []
                      }
                      physicalGroupTuitionRate={
                        row.physicalGroupTuitionRate || []
                      }
                    />
                  </div>
                  <div className="flex justify-center rounded-xl border border-gray-200 p-2 dark:border-gray-700">
                    <UpdateTuitionRate
                      id={row.id}
                      subject={row.subject?.id || ""}
                      grade={row.grade?.id || ""}
                      onlineIndividualTuitionRate={
                        row.onlineIndividualTuitionRate || []
                      }
                      onlineGroupTuitionRate={row.onlineGroupTuitionRate || []}
                      physicalIndividualTuitionRate={
                        row.physicalIndividualTuitionRate || []
                      }
                      physicalGroupTuitionRate={
                        row.physicalGroupTuitionRate || []
                      }
                    />
                  </div>
                  <div className="flex justify-center rounded-xl border border-gray-200 p-2 dark:border-gray-700">
                    <DeleteTuitionRate gradeId={row.id || ""} />
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                No tuition rates found
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try a different search term.
              </p>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>

      {!isLoading && filteredTuitionRates.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900 md:block"
        >
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            No tuition rates found
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try a different search term.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
