"use client"

import DataTable from "@/components/tables/DataTable";
import { useFetchSubjectsQuery } from "@/store/api/splits/subjects";
import { useState } from "react";
import { DeleteSubject } from "./DeleteSubject";
import { UpdateSubject } from "./edit-subject/page";
import { SubjectDetails } from "./ViewDetails";

export default function SubjectsTable() {
    // 1. Manage pagination state. Start at page 1 with a limit of 10.
    const [page, setPage] = useState(1);
    const limit = 10;

    // 2. Pass the pagination and sorting parameters to the RTK Query hook.
    // We sort by 'createdAt' in descending order to get the newest subjects first.
    const { data, isLoading } = useFetchSubjectsQuery({
        page,
        limit,
        sortBy: 'createdAt:desc',
    });

    const subjects = data?.results || [];
    const totalPages = data?.totalPages || 0;
    const totalResults = data?.totalResults || 0;

    // 3. Create a function to handle page changes.
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const columns = [
        { key: "title", header: "Title" },
        { key: "description", header: "Description" },
        {
            key: "edit",
            header: "Edit",
            render: (row) => (
                <UpdateSubject id={row.id} title={row.title} description={row.description} />
            ),
        },
        {
            key: "delete",
            header: "Delete",
            render: (row) => (
                <DeleteSubject subjectId={row.id} />
            ),
        },
        {
            key: "view",
            header: "View",
            render: (row) => (
                <SubjectDetails title={row.title} description={row.description} />
            ),
        },
    ];

    if (isLoading) {
      return <div>Loading subjects...</div>;
    }

    // 4. Pass the pagination data and handler down to the DataTable component.
    return (
        <DataTable
            columns={columns}
            data={subjects}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalResults={totalResults}
            limit={limit}
        />
    );
}
