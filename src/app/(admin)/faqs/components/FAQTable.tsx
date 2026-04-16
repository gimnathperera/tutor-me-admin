"use client";

import DataTable from "@/components/tables/DataTable";
import { TABLE_CONFIG } from "@/configs/table";
import { useFetchFaqsQuery } from "@/store/api/splits/faqs";
import { fadeUp, staggerContainer } from "@/types/animation-types";
import { Copy, Layers3, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { DeleteFAQ } from "./DeleteFAQ";
import { UpdateFAQ } from "./edit-faq/UpdateFAQ";
import { FAQDetails } from "./FAQDetails";

interface FAQ {
  id: string;
  question?: string;
  answer?: string;
  createdAt: string;
}

export default function FAQTable() {
  const [page, setPage] = useState<number>(TABLE_CONFIG.DEFAULT_PAGE);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = TABLE_CONFIG.DEFAULT_LIMIT;

  const { data, isLoading } = useFetchFaqsQuery({
    page,
    limit,
    sortBy: "createdAt:desc",
  });

  const faqs = data?.results || [];
  const totalPages = data?.totalPages || 0;
  const totalResults = data?.totalResults || 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const copyToClipboard = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("FAQ ID copied to clipboard");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    }
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

  const formatDate = (createdAt: string) => {
    try {
      const date = new Date(createdAt);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid date";
    }
  };

  const filteredFaqs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return faqs;

    return faqs.filter((faq: FAQ) => {
      const question = getSafeValue(faq.question, "").toLowerCase();
      const answer = getSafeValue(faq.answer, "").toLowerCase();
      const id = getSafeValue(faq.id, "").toLowerCase();

      return (
        question.includes(query) || answer.includes(query) || id.includes(query)
      );
    });
  }, [faqs, searchTerm]);

  const columns = [
    {
      key: "id",
      header: "ID",
      className:
        "min-w-[210px] max-w-[210px] sticky left-0 z-20 bg-white dark:bg-gray-900",
      bodyClassName: "text-[0.75rem] font-mono",
      render: (row: FAQ) => (
        <span
          onClick={() => copyToClipboard(row.id)}
          title="Click to copy"
          className="group relative flex max-w-full cursor-pointer items-center gap-1 truncate hover:text-blue-700 hover:underline dark:hover:text-blue-400"
          style={{ width: "inherit" }}
        >
          {row.id}
          <Copy className="w-4 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100 text-blue-700 dark:text-blue-400" />
        </span>
      ),
    },
    {
      key: "question",
      header: "Question",
      className:
        "min-w-[200px] max-w-[300px] truncate overflow-hidden cursor-default",
      render: (row: FAQ) => {
        const safeQuestion = getSafeValue(row.question, "No question provided");
        return (
          <span
            title={`Question: ${safeQuestion}`}
            className={`block truncate ${!row.question ? "text-gray-400 italic" : ""}`}
          >
            {safeQuestion}
          </span>
        );
      },
    },
    {
      key: "answer",
      header: "Answer",
      className:
        "min-w-[200px] max-w-[300px] truncate overflow-hidden cursor-default",
      bodyClassName: "text-left",
      render: (row: FAQ) => {
        const safeAnswer = getSafeValue(row.answer, "No answer provided");
        return (
          <span
            title={`Answer: ${safeAnswer}`}
            className={`block truncate ${!row.answer ? "text-gray-400 italic" : ""}`}
          >
            {safeAnswer}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      header: "Created At",
      className:
        "min-w-[140px] max-w-[140px] truncate overflow-hidden cursor-default",
      bodyClassName: "text-[0.75rem] font-mono",
      render: (row: FAQ) => {
        const formatted = formatDate(row.createdAt);
        return formatted === "Invalid date" ? (
          <span className="text-gray-400 italic">Invalid date</span>
        ) : (
          formatted
        );
      },
    },
    {
      key: "view",
      header: "View",
      className:
        "min-w-[80px] max-w-[80px] sticky right-[160px] z-20 bg-white dark:bg-gray-900",
      render: (row: FAQ) => (
        <div className="flex w-full items-center justify-center">
          <FAQDetails
            id={row.id}
            question={getSafeValue(row.question, "No question provided")}
            answer={getSafeValue(row.answer, "No answer provided")}
            createdAt={row.createdAt}
          />
        </div>
      ),
    },
    {
      key: "edit",
      header: "Edit",
      className:
        "min-w-[80px] max-w-[80px] sticky right-[80px] z-20 bg-white dark:bg-gray-900",
      render: (row: FAQ) => (
        <div className="flex w-full items-center justify-center">
          <UpdateFAQ
            id={row.id}
            question={getSafeValue(row.question, "")}
            answer={getSafeValue(row.answer, "")}
          />
        </div>
      ),
    },
    {
      key: "delete",
      header: "Delete",
      className:
        "min-w-[80px] max-w-[80px] sticky right-0 z-20 bg-white dark:bg-gray-900",
      render: (row: FAQ) => (
        <div className="flex w-full items-center justify-center">
          <DeleteFAQ faqId={row.id} />
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
            FAQs
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Filter FAQs by question, answer, or ID and manage them across
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
            placeholder="Filter by question, answer, or ID..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
          />
        </motion.div>
      </motion.div>

      <motion.div variants={fadeUp} className="hidden md:block">
        <motion.div layout className="overflow-hidden rounded-2xl">
          <DataTable
            columns={columns}
            data={filteredFaqs}
            page={page}
            totalPages={totalPages}
            totalResults={searchTerm ? filteredFaqs.length : totalResults}
            limit={limit}
            onPageChange={handlePageChange}
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
        ) : filteredFaqs.length > 0 ? (
          filteredFaqs.map((row) => {
            const safeQuestion = getSafeValue(
              row.question,
              "No question provided",
            );
            const safeAnswer = getSafeValue(row.answer, "No answer provided");
            const safeDate = formatDate(row.createdAt);

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
                      {safeQuestion}
                    </h3>
                    <p className="mt-1 line-clamp-3 text-sm text-gray-500 dark:text-gray-400">
                      {safeAnswer}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <Layers3 className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-800">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    FAQ ID
                  </p>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(row.id)}
                    className="mt-1 flex w-full items-center gap-2 text-left text-sm text-blue-600 dark:text-blue-400"
                  >
                    <span className="truncate font-mono">{row.id}</span>
                    <Copy className="h-4 w-4 shrink-0" />
                  </button>
                </div>

                <div className="mt-3 rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-800">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Created At
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {safeDate}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="flex justify-center rounded-xl border border-gray-200 p-2 dark:border-gray-700">
                    <FAQDetails
                      id={row.id}
                      question={safeQuestion}
                      answer={safeAnswer}
                      createdAt={row.createdAt}
                    />
                  </div>
                  <div className="flex justify-center rounded-xl border border-gray-200 p-2 dark:border-gray-700">
                    <UpdateFAQ
                      id={row.id}
                      question={getSafeValue(row.question, "")}
                      answer={getSafeValue(row.answer, "")}
                    />
                  </div>
                  <div className="flex justify-center rounded-xl border border-gray-200 p-2 dark:border-gray-700">
                    <DeleteFAQ faqId={row.id} />
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
                No FAQs found
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try a different search term.
              </p>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>

      {!isLoading && filteredFaqs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900 md:block"
        >
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            No FAQs found
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try a different search term.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
