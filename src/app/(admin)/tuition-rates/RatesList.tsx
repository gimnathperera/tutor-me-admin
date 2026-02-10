"use client";

import DataTable from "@/components/tables/DataTable";
import { useFetchTuitionRatesQuery } from "@/store/api/splits/tuition-rates";
import { useState } from "react";
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
  fullTimeTuitionRate: TuitionRateObject[];
  govTuitionRate: TuitionRateObject[];
  partTimeTuitionRate: TuitionRateObject[];
}

export default function TuitionRatesTable() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useFetchTuitionRatesQuery({
    page,
    limit,
    sortBy: "createdAt:desc",
  });

  const tuitionRates = data?.results || [];
  const totalPages = data?.totalPages || 0;
  const totalResults = data?.totalResults || 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const columns = [
    {
      key: "grade",
      header: "Grade",
      className:
        "min-w-[150px] max-w-[250px] truncate overflow-hidden sticky left-0 z-20 bg-white dark:bg-gray-900",
      render: (row: TuitionRateData) => (
        <span
          title={row.grade?.title || "N/A"}
          className="truncate block"
          style={{ width: "inherit" }}
        >
          {row.grade?.title || "N/A"}
        </span>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      className:
        "min-w-[150px] max-w-[250px] truncate overflow-hidden cursor-default",
      render: (row: TuitionRateData) => row.subject?.title || "N/A",
    },
    {
      key: "view",
      header: <div className="w-full text-center">View</div>,
      className: "min-w-[80px] max-w-[80px] sticky right-[160px] z-20 bg-white dark:bg-gray-900",
      render: (row: TuitionRateData) => (
        <div className="w-full flex justify-center items-center">
          <TuitionRateDetails
            grade={row.grade || { id: "", title: "N/A" }}
            subject={row.subject || { id: "", title: "N/A" }}
            fullTimeTuitionRate={row.fullTimeTuitionRate || []}
            govTuitionRate={row.govTuitionRate || []}
            partTimeTuitionRate={row.partTimeTuitionRate || []}
          />
        </div>
      ),
    },
    {
      key: "edit",
      header: <div className="w-full text-center">Edit</div>,
      className: "min-w-[80px] max-w-[80px] sticky right-[80px] z-20 bg-white dark:bg-gray-900",
      render: (row: TuitionRateData) => (
        <div className="w-full flex justify-center items-center">
          <UpdateTuitionRate
            id={row.id}
            subject={row.subject?.id || ""}
            grade={row.grade?.id || ""}
            fullTimeTuitionRate={row.fullTimeTuitionRate || []}
            govTuitionRate={row.govTuitionRate || []}
            partTimeTuitionRate={row.partTimeTuitionRate || []}
          />
        </div>
      ),
    },
    {
      key: "delete",
      header: <div className="w-full text-center">Delete</div>,
      className: "min-w-[80px] max-w-[80px] sticky right-0 z-20 bg-white dark:bg-gray-900",
      render: (row: TuitionRateData) => (
        <div className="w-full flex justify-center items-center">
          <DeleteTuitionRate gradeId={row.id || ""} />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={tuitionRates}
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      totalResults={totalResults}
      limit={limit}
      isLoading={isLoading}
    />
  );
}
