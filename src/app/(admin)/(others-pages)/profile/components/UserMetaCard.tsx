/* eslint-disable @next/next/no-img-element */
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuthContext } from "@/context";
import { cn } from "@/lib/utils";
import { useFetchUserByIdQuery } from "@/store/api/splits/users";
import { useEffect, useState } from "react";
import UpdateUser from "./edit-profile/page";

export default function UserMetaCard() {
  const { user: authUser } = useAuthContext();

  const { data: user, isLoading } = useFetchUserByIdQuery(authUser?.id || "", {
    skip: !authUser?.id,
  });
  const [isImageError, setIsImageError] = useState(false);

  useEffect(() => {
    setIsImageError(false);
  }, [user?.avatar]);

  if (!authUser || isLoading) {
    return <Skeleton />;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  const avatarSrc =
    isImageError || !user.avatar ? "/images/user/user.png" : user.avatar;

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
            <img
              src={avatarSrc}
              alt="user"
              className="h-full w-full object-cover"
              onError={() => setIsImageError(true)}
            />
          </div>
          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
              {user.name}
            </h4>
            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
                  user.status === "active"
                    ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                    : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
                )}
              >
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    user.status === "active" ? "bg-green-500" : "bg-red-500",
                  )}
                ></span>
                <span>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>
              <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
            </div>
          </div>
        </div>
        <UpdateUser />
      </div>
    </div>
  );
}
