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
import { useDeleteFaqMutation } from "@/store/api/splits/faqs";
import { getErrorInApiResult } from "@/utils/api";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteFAQProps {
  faqId: string | number;
}

export function DeleteFAQ({ faqId }: DeleteFAQProps) {
  const [deleteFaq, { isLoading }] = useDeleteFaqMutation();

  const handleDelete = async () => {
    try {
      const result = await deleteFaq(String(faqId));

      if (result.error) {
        const error = getErrorInApiResult({ error: result.error });
        toast.error(error);
      } else {
        toast.success("FAQ deleted successfully");
      }
    } catch (error) {
      console.error("Unexpected error during FAQ deletion:", error);
      toast.error("An unexpected error occurred while deleting the FAQ");
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
            This action cannot be undone. This will permanently delete this FAQ.
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
