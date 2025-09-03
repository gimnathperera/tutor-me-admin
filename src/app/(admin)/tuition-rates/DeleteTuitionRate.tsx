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
import { useDeleteTuitionRateMutation } from "@/store/api/splits/tuition-rates";
import { getErrorInApiResult } from "@/utils/api";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteTuitionRateProps {
  gradeId: string;
}

export function DeleteTuitionRate({ gradeId }: DeleteTuitionRateProps) {
  const [deleteGrade, { isLoading }] = useDeleteTuitionRateMutation();

  const handleDelete = async () => {
    const result = await deleteGrade(gradeId);

    if (result.error) {
      const error = getErrorInApiResult({ error: result.error });
      toast.error(error);
    } else {
      toast.success("Tuition Rate deleted successfully");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash2 color="#EF4444" className="cursor-pointer" />
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white z-[9999] dark:bg-gray-800 dark:text-white/90">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            Tuition Rate.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-500 text-white"
          >
            {isLoading ? "Deleting..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
