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
import { useDeleteBlogMutation } from "@/store/api/splits/blogs";
import { BlogStatus } from "@/types/blogs-types";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface DeleteBlogProps {
  blogId: string;
  currentStatus?: BlogStatus;
  onDeleted?: () => void;
}

export function DeleteBlog({
  blogId,
  currentStatus,
  onDeleted,
}: DeleteBlogProps) {
  const [deleteBlog, { isLoading }] = useDeleteBlogMutation();
  const [dialogOpen, setDialogOpen] = useState(false);

  const canDelete = currentStatus === "rejected";

  const handleDelete = async () => {
    if (!canDelete) {
      toast.error("Only blogs with status 'rejected' can be deleted");
      return;
    }

    const result = await deleteBlog(blogId);

    if ("error" in result) {
      toast.error("Delete failed");
      return;
    }

    toast.success("Blog deleted");
    setDialogOpen(false);
    onDeleted?.();
  };

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>
        <Trash2
          className={`cursor-pointer ${
            canDelete
              ? "text-red-500 hover:text-red-600"
              : "text-gray-400 cursor-not-allowed"
          }`}
        />
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the blog.
            {!canDelete && (
              <span className="text-red-500 block mt-2">
                Only blogs with status "rejected" can be deleted.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={!canDelete || isLoading}
            onClick={handleDelete}
            className="bg-red-500 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
