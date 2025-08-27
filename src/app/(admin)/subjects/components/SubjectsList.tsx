"use client"

import DataTable from "@/components/tables/DataTable";
import { useFetchSubjectsQuery } from "@/store/api/splits/subjects";
import { useState } from "react";
import { DeleteSubject } from "./DeleteSubject";
import { UpdateSubject } from "./edit-subject/page";
import { SubjectDetails } from "./ViewDetails";

export default function SubjectsTable() {
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading } = useFetchSubjectsQuery({
        page,
        limit,
        sortBy: 'createdAt:desc',
    });

    const subjects = data?.results || [];
    const totalPages = data?.totalPages || 0;
    const totalResults = data?.totalResults || 0;

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const columns = [
        { key: "title", header: "Title" },
        { key: "description", header: "Description" },
        {
            key: "edit",
            header: "Edit",
            render: (row: { id: string; title: string; description: string; }) => (
                <UpdateSubject id={row.id} title={row.title} description={row.description} />
            ),
        },
        {
            key: "delete",
            header: "Delete",
            render: (row: { id: string; }) => (
            <div className="flex justify-center items-center">
                <DeleteSubject subjectId={row.id} />
            </div>
            ),
        },
        {
            key: "view",
            header: "View",
            render: (row: { title: string; description: string; }) => (
            <div className="flex justify-center items-center">
                <SubjectDetails title={row.title} description={row.description} />
            </div>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={subjects}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalResults={totalResults}
            limit={limit}
            isLoading={isLoading}
        />
    );
}
