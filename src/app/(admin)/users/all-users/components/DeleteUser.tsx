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
import { useDeleteUserMutation } from "@/store/api/splits/users";
import { getErrorInApiResult } from "@/utils/api";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteUserProps {
  userId: string;
  userRole?: "admin" | "user" | "tutor";
  userStatus?: string;
}

export function DeleteUser({ userId, userRole, userStatus }: DeleteUserProps) {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const canDelete = userRole === "tutor" && userStatus === "rejected";

  const getDisabledTitle = () => {
    if (userRole !== "tutor") return "Only tutor accounts can be deleted";
    if (userStatus !== "rejected") return "User must be rejected before deletion";
    return "Delete tutor account";
  };

  const handleDelete = async () => {
    if (!canDelete) {
      toast.error(getDisabledTitle());
      return;
    }

    try {
      const result = await deleteUser(userId);

      if (result.error) {
        const error = getErrorInApiResult({ error: result.error });
        toast.error(error);
      } else {
        toast.success("Tutor account deleted successfully");
      }
    } catch (error) {
      console.error("Unexpected error during user deletion:", error);
      toast.error("An unexpected error occurred while deleting the user");
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
            disabled={isLoading || !canDelete}
            className="bg-red-500 text-white disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
