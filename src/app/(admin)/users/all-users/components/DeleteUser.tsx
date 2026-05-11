"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useDeleteTutorMutation,
  useLazyFetchTutorsQuery,
} from "@/store/api/splits/tutors";
import { useDeleteUserMutation } from "@/store/api/splits/users";
import { getErrorInApiResult } from "@/utils/api";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteUserProps {
  userId: string;
  tutorId?: string;
  userEmail?: string;
  userRole?: "admin" | "user" | "tutor";
}

type ApiError = FetchBaseQueryError | SerializedError;

const getApiErrorMessage = (error: unknown) =>
  getErrorInApiResult({ error: error as ApiError }) ||
  "An error occurred while performing the request.";

const isNotFoundError = (error: unknown) =>
  Boolean(
    error &&
      typeof error === "object" &&
      "status" in error &&
      error.status === 404,
  );

export function DeleteUser({
  userId,
  tutorId,
  userEmail,
  userRole,
}: DeleteUserProps) {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const [deleteTutor, { isLoading: isDeletingTutor }] =
    useDeleteTutorMutation();
  const [fetchTutors, { isFetching: isFindingTutor }] =
    useLazyFetchTutorsQuery();
  const canDelete = userRole === "tutor";
  const isDeleting = isLoading || isDeletingTutor || isFindingTutor;

  const getDisabledTitle = () => {
    if (userRole !== "tutor") return "Only tutor accounts can be deleted";
    return "Delete tutor account";
  };

  const resolveTutorId = async () => {
    if (tutorId) {
      return tutorId;
    }

    const email = userEmail?.trim();
    if (!email) {
      return userId;
    }

    const tutorsResponse = await fetchTutors({
      page: 1,
      limit: 1000,
      email,
      search: email,
    }).unwrap();

    return (
      tutorsResponse.results.find(
        (tutor) => tutor.email?.toLowerCase() === email.toLowerCase(),
      )?.id ?? userId
    );
  };

  const handleDelete = async () => {
    if (!canDelete) {
      toast.error(getDisabledTitle());
      return;
    }

    try {
      const tutorId = await resolveTutorId();

      await deleteTutor(tutorId).unwrap();

      try {
        await deleteUser(userId).unwrap();
      } catch (error) {
        if (!isNotFoundError(error)) {
          throw error;
        }
      }

      toast.success("Tutor account deleted successfully");
    } catch (error) {
      console.error("Unexpected error during user deletion:", error);
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          disabled={!canDelete}
          className="inline-flex items-center justify-center border-0 bg-transparent p-0 disabled:cursor-not-allowed"
          title={getDisabledTitle()}
        >
          <Trash2
            className={`cursor-pointer ${
              canDelete
                ? "text-red-500 hover:text-red-600"
                : "text-gray-400 cursor-not-allowed"
            }`}
          />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white z-50 dark:bg-gray-800 dark:text-white/90">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            tutor account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting || !canDelete}
            className="bg-red-500 text-white disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
