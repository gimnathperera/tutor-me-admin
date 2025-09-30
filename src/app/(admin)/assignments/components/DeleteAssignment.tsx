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
import { useDeleteAssignmentMutation } from "@/store/api/splits/tuition-assignments";
import { getErrorInApiResult } from "@/utils/api";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteAssignmentProps {
  assignmentId: string;
}

export function DeleteAssignment({ assignmentId }: DeleteAssignmentProps) {
  const [deleteAssignment, { isLoading }] = useDeleteAssignmentMutation();

  const handleDelete = async () => {
    const result = await deleteAssignment(assignmentId);
    if (result.error) {
      const error = getErrorInApiResult({ error: result.error });
      toast.error(error);
    } else {
      toast.success("Assignment deleted successfully");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash2
          color="#EF4444"
          className="cursor-pointer text-red-500 hover:text-red-600"
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this assignment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-500 text-white"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
