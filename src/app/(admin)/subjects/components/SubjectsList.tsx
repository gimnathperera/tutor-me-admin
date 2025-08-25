"use client"

import DataTable from "@/components/tables/DataTable";
import { useFetchSubjectsQuery } from "@/store/api/splits/subjects";
import { DeleteSubject } from "./DeleteSubject";
import { UpdateSubject } from "./edit-subject/page";
import { SubjectDetails } from "./ViewDetails";

export default function SubjectsTable() {
    const { data, isLoading } = useFetchSubjectsQuery({});
    const subjects = data?.results || [];

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
            header: "Status",
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

    return <DataTable columns={columns} data={subjects} />;
}
