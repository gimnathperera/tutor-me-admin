"use client"

import DataTable from "@/components/tables/DataTable";
import { useFetchSubjectsQuery } from "@/store/api/splits/subjects";
import { Ellipsis, SquarePen, Trash2 } from "lucide-react";

// const orders = [
//   {
//     id: 1,
//     user: { image: "/images/user/user-17.jpg", name: "Lindsey Curtis", role: "Web Designer" },
//     projectName: "Agency Website",
//     team: { images: ["/images/user/user-22.jpg", "/images/user/user-23.jpg"] },
//     status: "Active",
//     budget: "3.9K",
//   },
//   // ...rest
// ];

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
                <SquarePen />
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (row) => (
                <Trash2 color="#EF4444" />
            ),
        },
        {
            key: "view",
            header: "View",
            render: (row) => (
                <Ellipsis />
            ),
        },
    ];

  return <DataTable columns={columns} data={subjects} />;
}
