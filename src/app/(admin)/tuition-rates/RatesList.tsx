"use client";

import DataTable from "@/components/tables/DataTable";
import { useFetchTuitionRatesQuery } from "@/store/api/splits/tuition-rates";
import { useState } from "react";
import { DeleteTuitionRate } from "./DeleteTuitionRate";
import { TuitionRateDetails } from "./ViewDetails";
import { UpdateTuitionRate } from "./edit-tuition-rates/page";

interface RateDetail {
  id: string;
  title: string;
}

interface TuitionRateObject {
  _id: string;
  minimumRate: string;
  maximumRate: string;
}

interface TuitionRateData {
  id: string;
  level: RateDetail;
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
      key: "level",
      header: "Level",
      render: (row: TuitionRateData) => row.level?.title || "N/A",
    },
    {
      key: "grade",
      header: "Grade",
      render: (row: TuitionRateData) => row.grade?.title || "N/A",
    },
    {
      key: "subject",
      header: "Subject",
      render: (row: TuitionRateData) => row.subject?.title || "N/A",
    },
    {
      key: "edit",
      header: "Edit",
      render: (row: TuitionRateData) => (
        <UpdateTuitionRate
          id={row.id}
          level={row.level?.id || ""}
          subject={row.subject?.id || ""}
          grade={row.grade?.id || ""}
          fullTimeTuitionRate={row.fullTimeTuitionRate || []}
          govTuitionRate={row.govTuitionRate || []}
          partTimeTuitionRate={row.partTimeTuitionRate || []}
        />
      ),
    },
    {
      key: "delete",
      header: "Delete",
      render: (row: TuitionRateData) => <DeleteTuitionRate gradeId={row.id || ""} />,
    },
    {
      key: "view",
      header: "View",
      render: (row: TuitionRateData) => (
        <TuitionRateDetails
          level={row.level || { id: "", title: "N/A" }}
          grade={row.grade || { id: "", title: "N/A" }}
          subject={row.subject || { id: "", title: "N/A" }}
          fullTimeTuitionRate={row.fullTimeTuitionRate || []}
          govTuitionRate={row.govTuitionRate || []}
          partTimeTuitionRate={row.partTimeTuitionRate || []}
        />
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