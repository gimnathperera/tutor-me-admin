"use client";

import DataTable from "@/components/tables/DataTable";
import { TABLE_CONFIG } from "@/configs/table";
import { useFetchUsersQuery } from "@/store/api/splits/users";
import { useState } from "react";
import { DeleteUser } from "./DeleteUser";
import { UpdateUser } from "./edit-user/page";
import { ResetPassword } from "./ResetPassword";
import { UserDetails } from "./ViewDetails";

interface User {
  id: string;
  name?: string;
  role?: "admin" | "user" | "tutor";
  status?: "active" | "inactive";
  email?: string;
  password?: string;
  phoneNumber?: string;
  birthday?: string;
  country?: string;
  city?: string;
  zip?: string;
  address?: string;
  state?: string;
  region?: string;
  tutorType?: "full-time" | "part-time";
  gender?: "male" | "female" | "other";
  duration?: string;
  frequency?: string;
  timeZone?: string;
  language?: string;
  avatar?: string;
  createdAt?: string;
}

export default function UsersTable() {
  const [page, setPage] = useState<number>(TABLE_CONFIG.DEFAULT_PAGE);
  const limit = TABLE_CONFIG.DEFAULT_LIMIT;

  const { data, isLoading } = useFetchUsersQuery({
    page,
    limit,
    sortBy: "createdAt:desc",
  });

  const users = data?.results || [];
  const totalPages = data?.totalPages || 0;
  const totalResults = data?.totalResults || 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getSafeValue = (value: string | undefined | null, fallback = "N/A") => {
    if (!value || value.trim() === "") return fallback;
    return value;
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      className:
        "min-w-[150px] max-w-[250px] truncate overflow-hidden cursor-default",
      render: (row: User) => (
        <span
          title={row.name || "No name provided"}
          className={`truncate block ${!row.name ? "text-gray-400 italic" : ""}`}
        >
          {getSafeValue(row.name, "No name provided")}
        </span>
      ),
    },
    {
      key: "email",
      header: "Email",
      className:
        "min-w-[150px] max-w-[250px] truncate overflow-hidden cursor-default",
      render: (row: User) => (
        <span
          title={row.email || "No email provided"}
          className={`truncate block ${!row.email ? "text-gray-400 italic" : ""}`}
        >
          {getSafeValue(row.email, "No email provided")}
        </span>
      ),
    },
    {
      key: "role",
      header: "Role",
      className:
        "min-w-[200px] max-w-[300px] truncate overflow-hidden cursor-default",
      render: (row: User) => {
        const role = row.role
          ? row.role.charAt(0).toUpperCase() + row.role.slice(1)
          : null;

        return (
          <span
            title={role || "No role provided"}
            className={`truncate block ${!role ? "text-gray-400 italic" : ""}`}
          >
            {getSafeValue(role, "No role provided")}
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
      render: (row: User) => {
        try {
          const date = new Date(row.createdAt || "");
          if (isNaN(date.getTime())) {
            return <span className="text-gray-400 italic">Invalid date</span>;
          }

          return (
            <span title={date.toISOString()}>
              {date.toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          );
        } catch {
          return <span className="text-gray-400 italic">Invalid date</span>;
        }
      },
    },

    {
      key: "view",
      header: "View",
      className: "min-w-[80px] max-w-[80px] cursor-default",
      render: (row: User) => (
        <div className="w-full flex justify-left items-center">
          <UserDetails
            id={row.id}
            email={row.email || ""}
            password={row.password || ""}
            name={row.name || ""}
            role={row.role || "user"}
            phoneNumber={row.phoneNumber || ""}
            birthday={row.birthday || ""}
            status={row.status || "active"}
            country={row.country || ""}
            city={row.city || ""}
            zip={row.zip || ""}
            address={row.address || ""}
            state={row.state}
            region={row.region}
            tutorType={row.tutorType}
            gender={row.gender}
            duration={row.duration}
            frequency={row.frequency}
            timezone={row.timeZone}
            language={row.language}
            avatar={row.avatar}
          />
        </div>
      ),
    },
    {
      key: "edit",
      header: "Edit",
      className:
        "min-w-[80px]  flex justify-center items-center max-w-[80px] cursor-default",
      render: (row: User) => (
        <div className="w-full flex justify-left items-center">
          <UpdateUser
            id={row.id}
            email={row.email || ""}
            name={row.name || ""}
            phoneNumber={row.phoneNumber || ""}
            birthday={row.birthday || ""}
            status={row.status || "active"}
            country={row.country || ""}
            city={row.city || ""}
            zip={row.zip || ""}
            address={row.address || ""}
            state={row.state}
            region={row.region}
            tutorType={row.tutorType}
            gender={row.gender}
            duration={row.duration}
            frequency={row.frequency}
            language={row.language}
            avatar={row.avatar}
            role={row.role || "user"}
          />
        </div>
      ),
    },
    {
      key: "delete",
      header: "Delete",
      className: "min-w-[80px] max-w-[80px] cursor-default",
      render: (row: User) => (
        <div className="w-full flex justify-left items-center">
          <DeleteUser userId={row.id} userStatus={row.status ?? "active"} />
        </div>
      ),
    },
    {
      key: "resetPassword",
      header: "Reset Password",
      className: "min-w-[80px] max-w-[80px] cursor-default",
      render: (row: User) => (
        <div className="w-full flex justify-left items-center">
          <ResetPassword userId={row.id} />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      totalResults={totalResults}
      limit={limit}
      isLoading={isLoading}
    />
  );
}
