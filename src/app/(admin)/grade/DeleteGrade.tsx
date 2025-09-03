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
import { useDeleteGradeMutation } from "@/store/api/splits/grades";
import { getErrorInApiResult } from "@/utils/api";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteGradeProps {
  gradeId: string;
}

export function DeleteGrade({ gradeId }: DeleteGradeProps) {
  const [deleteGrade, { isLoading }] = useDeleteGradeMutation();

  const handleDelete = async () => {
    try {
      const result = await deleteGrade(gradeId);

      if (result.data) {
        toast.success("Grade deleted successfully");
      } else {
        const error = getErrorInApiResult({ error: result.error });
        toast.error(error);
      }
    } catch (error) {
      console.error("Unexpected error during grade deletion:", error);
      toast.error("An unexpected error occurred while deleting the grade");
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
            Grade.
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
