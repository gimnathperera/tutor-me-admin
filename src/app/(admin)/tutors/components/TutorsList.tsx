"use client";

import DataTable from "@/components/tables/DataTable";
import { useFetchTutorsQuery } from "@/store/api/splits/tutors";
import { useState } from "react";
import { DeleteTutor } from "./DeleteTutor";
import { ViewTutor } from "./ViewTutor";
import { EditTutor } from "./edit-tutor/page";
type Tutor = {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  dateOfBirth: string;
  gender: string;
  age: number;
  nationality: string;
  race: string;
  last4NRIC: string;
  tutorType: string;
  yearsExperience: number;
  highestEducation: string;
  academicDetails: string;
  teachingSummary: string;
  studentResults: string;
  sellingPoints: string;
  tutoringLevels: string[];
  preferredLocations: string[];
  agreeTerms: boolean;
  agreeAssignmentInfo: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function TutorsList() {
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch tutors from API with pagination
  const { data, isLoading } = useFetchTutorsQuery({
    page,
    limit,
    sortBy: "createdAt:desc",
  });

  const tutors = data?.results || [];
  const totalPages = data?.totalPages || 1;
  const totalResults = data?.totalResults || tutors.length;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Choose 5 columns to show in table
  const columns: {
    key: string;
    header: string;
    className?: string;
    render?: (row: Tutor) => React.ReactNode;
  }[] = [
    { key: "fullName", header: "Full Name" },
    { key: "email", header: "Email" },
    { key: "contactNumber", header: "Contact Number" },
    { key: "tutorType", header: "Type" },
    { key: "yearsExperience", header: "Experience (Years)" },

    // Edit button
    {
      key: "edit",
      header: "Edit",
      className: "min-w-[10px] max-w-[10px] cursor-default",
      render: (row: {
        id: string;
        fullName: string;
        email: string;
        contactNumber: string;
        tutorType: string;
        yearsExperience: number;
      }) => (
        <EditTutor
          id={row.id}
          fullName={row.fullName}
          email={row.email}
          contactNumber={row.contactNumber}
          tutorType={row.tutorType}
          yearsExperience={row.yearsExperience}
        />
      ),
    },

    // Delete button
    {
      key: "delete",
      header: "Delete",
      className: "min-w-[10px] max-w-[10px] cursor-default",
      render: (row: Tutor) => (
        <div className="flex justify-center items-center">
          <DeleteTutor tutorId={row.id} />
        </div>
      ),
    },

    // View button
    {
      key: "view",
      header: "View",
      className: "min-w-[10px] max-w-[10px] cursor-default",
      render: (row: Tutor) => (
        <div className="flex justify-center items-center">
          <ViewTutor tutor={row} />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={tutors}
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      totalResults={totalResults}
      limit={limit}
      isLoading={isLoading}
    />
  );
}
