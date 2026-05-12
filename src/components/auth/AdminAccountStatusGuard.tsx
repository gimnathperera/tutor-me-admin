"use client";

import { useAuthContext } from "@/context";
import { useFetchUserByIdQuery } from "@/store/api/splits/users";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const RESTRICTED_STATUSES = new Set(["rejected", "suspended"]);
const COUNTDOWN_SECONDS = 10;
const STATUS_POLLING_INTERVAL_MS = 15000;

const formatStatus = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1);

export default function AdminAccountStatusGuard() {
  const { user, logout } = useAuthContext();
  const [restrictedStatus, setRestrictedStatus] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const hasStartedCountdown = useRef(false);
  const hasLoggedOut = useRef(false);

  const { data: latestUser } = useFetchUserByIdQuery(user?.id ?? "", {
    skip: !user?.id || user.role !== "admin" || Boolean(restrictedStatus),
    pollingInterval: STATUS_POLLING_INTERVAL_MS,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    const latestStatus = latestUser?.status?.toLowerCase();

    if (
      !latestStatus ||
      !RESTRICTED_STATUSES.has(latestStatus) ||
      hasStartedCountdown.current
    ) {
      return;
    }

    hasStartedCountdown.current = true;
    setRestrictedStatus(latestStatus);
    setCountdown(COUNTDOWN_SECONDS);
    toast.error(
      `Your account has been ${latestStatus}. You will be logged out shortly.`,
      {
        id: "admin-account-status-restricted",
        duration: COUNTDOWN_SECONDS * 1000,
      },
    );
  }, [latestUser?.status]);

  useEffect(() => {
    if (!restrictedStatus) {
      return;
    }

    if (countdown <= 0) {
      if (!hasLoggedOut.current) {
        hasLoggedOut.current = true;
        void logout();
      }
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCountdown((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [countdown, logout, restrictedStatus]);

  if (!restrictedStatus) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[900002] flex items-center justify-center bg-gray-950/70 px-4 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="account-status-title"
      aria-describedby="account-status-description"
    >
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 text-center shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        <p
          id="account-status-title"
          className="text-lg font-semibold text-gray-900 dark:text-white"
        >
          Account {formatStatus(restrictedStatus)}
        </p>
        <p
          id="account-status-description"
          className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300"
        >
          Your admin account has been {restrictedStatus}. For security, you will
          be logged out of the portal in {countdown} second
          {countdown === 1 ? "" : "s"}.
        </p>
        <div className="mt-5 text-4xl font-semibold text-red-600 dark:text-red-400">
          {countdown}
        </div>
      </div>
    </div>
  );
}
