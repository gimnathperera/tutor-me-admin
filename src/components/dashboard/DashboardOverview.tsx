"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuthContext } from "@/context";
import { useFetchDashboardSummaryQuery } from "@/store/api/splits/dashboard";
import { useFetchUserByIdQuery } from "@/store/api/splits/users";
import { containerVariants } from "@/types/animation-types";
import { statCards } from "@/types/dashboard-types";
import { Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const formatNumber = (value: number) => value.toLocaleString("en-US");

const capitalize = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function DashboardOverview() {
  const { user: authUser, isUserLoaded } = useAuthContext();

  const { data: user, isLoading: isUserLoading } = useFetchUserByIdQuery(
    authUser?.id || "",
    {
      skip: !authUser?.id,
    },
  );

  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useFetchDashboardSummaryQuery();

  const [isImageError, setIsImageError] = useState(false);

  useEffect(() => {
    setIsImageError(false);
  }, [user?.avatar]);

  const displayName = user?.name || authUser?.name || "Admin";
  const displayEmail = user?.email || authUser?.email || "";
  const displayRole = user?.role || authUser?.role || "admin";
  const displayStatus = user?.status || authUser?.status || "active";
  const avatarSrc = user?.avatar || authUser?.avatar || "";

  const showProfileSkeleton = !isUserLoaded || isUserLoading;
  const showSummarySkeleton = isSummaryLoading;

  return (
    <motion.div
      className="relative"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <motion.div
          className="col-span-12 overflow-hidden rounded-[28px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]"
          whileHover={{ y: -2 }}
          layout
        >
          <div className="relative h-2 overflow-hidden bg-white/40 dark:bg-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          </div>

          <div className="relative p-5 md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_30%)]" />

            {showProfileSkeleton ? (
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    layout
                    whileHover={{ scale: 1.04, rotate: -2 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-white/60 bg-gradient-to-br from-white to-slate-100 shadow-lg dark:border-white/10 dark:from-white/10 dark:to-white/5"
                  >
                    {avatarSrc && !isImageError ? (
                      <Image
                        width={80}
                        height={80}
                        src={avatarSrc}
                        alt={`${displayName} avatar`}
                        className="h-full w-full object-cover"
                        onError={() => setIsImageError(true)}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-lg font-semibold text-slate-700 dark:from-slate-800 dark:to-slate-900 dark:text-white/90">
                        {getInitials(displayName)}
                      </div>
                    )}
                    <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/50 dark:ring-white/10" />
                  </motion.div>

                  <div>
                    <motion.div
                      className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-sky-50/80 px-3 py-1 text-xs font-medium text-sky-700 backdrop-blur dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Admin overview
                    </motion.div>

                    <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                      Welcome back
                    </p>

                    <motion.h1
                      className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white/95 md:text-4xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {displayName}
                    </motion.h1>

                    {displayEmail ? (
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {displayEmail}
                      </p>
                    ) : null}
                  </div>
                </div>

                <motion.div
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <div className="rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
                    Role: {capitalize(displayRole)}
                  </div>

                  <div
                    className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm ${
                      displayStatus === "active"
                        ? "border border-emerald-200/70 bg-emerald-50/80 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                        : "border border-amber-200/70 bg-amber-50/80 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300"
                    }`}
                  >
                    Status: {capitalize(displayStatus)}
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isSummaryError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="col-span-12 rounded-2xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-700 backdrop-blur dark:border-red-900/40 dark:bg-red-500/10 dark:text-red-200"
            >
              Could not load the dashboard summary right now.
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="col-span-12">
          {showSummarySkeleton ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[24px] border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04] md:p-6"
                >
                  <Skeleton className="h-12 w-12 rounded-2xl" />
                  <Skeleton className="mt-5 h-4 w-32" />
                  <Skeleton className="mt-3 h-8 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {statCards.map(
                ({ label, key, icon: Icon, accent, glow }, index) => (
                  <motion.div
                    key={key}
                    whileHover={{ y: -6, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    layout
                    className={`group relative overflow-hidden rounded-[24px] border border-slate-200/70 bg-white/80 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-shadow dark:border-white/10 dark:bg-white/[0.04] md:p-6 ${glow}`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.5),transparent_35%)] opacity-80 dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />
                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-slate-100/80 blur-2xl dark:bg-white/5" />

                    <div className="relative z-10">
                      <motion.div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}
                        whileHover={{ rotate: -6, scale: 1.06 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 14,
                        }}
                      >
                        <Icon className="h-6 w-6" />
                      </motion.div>

                      <div className="mt-5 flex items-start justify-between gap-3">
                        <div>
                          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            {label}
                          </span>

                          <motion.h3
                            className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white/95"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                          >
                            {formatNumber(summary?.[key] ?? 0)}
                          </motion.h3>
                        </div>

                        <span className="rounded-full border border-slate-200/80 bg-white/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:border-white/10 dark:bg-white/[0.05]">
                          Live
                        </span>
                      </div>

                      <motion.div
                        className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"
                        initial={{ opacity: 0.6 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${accent}`}
                          initial={{ width: "35%" }}
                          animate={{ width: "75%" }}
                          transition={{
                            delay: 0.15 + index * 0.06,
                            duration: 0.8,
                            ease: "easeOut",
                          }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                ),
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
