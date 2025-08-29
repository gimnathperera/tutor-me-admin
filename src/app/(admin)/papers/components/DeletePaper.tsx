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
import { useDeletePaperMutation } from "@/store/api/splits/papers";
import { getErrorInApiResult } from "@/utils/api";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface DeletePaperProps {
  paperId: string;
}

export function DeletePaper({ paperId }: DeletePaperProps) {
  const [deletePaper, { isLoading }] = useDeletePaperMutation();

  const handleDelete = async () => {
    const result = await deletePaper(paperId);

    if ("error" in result) {
      const error = getErrorInApiResult({ error: result.error });
      toast.error(error);
    } else {
      toast.success("Paper deleted successfully");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash2 color="#EF4444" className="cursor-pointer" />
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white z-50 dark:bg-gray-800 dark:text-white/90">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            paper.
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
