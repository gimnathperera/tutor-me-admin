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
  useDeleteBlogMutation,
  useFetchBlogByIdQuery,
} from "@/store/api/splits/blogs";
import { getErrorInApiResult } from "@/utils/api";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface DeleteBlogProps {
  blogId: string;
  currentStatus?: "pending" | "approved" | "rejected" | "published" | "draft"; // ✅ Accept status as prop
  onDeleted?: () => void;
}

export function DeleteBlog({
  blogId,
  currentStatus,
  onDeleted,
}: DeleteBlogProps) {
  // ✅ Force refetch on every render to get latest status
  const {
    data: blog,
    isLoading: isFetching,
    refetch,
  } = useFetchBlogByIdQuery(blogId, {
    refetchOnMountOrArgChange: true, // Always refetch when component mounts
  });

  const [deleteBlog, { isLoading }] = useDeleteBlogMutation();
  const [deleted, setDeleted] = useState(false);

  // ✅ Use currentStatus prop if provided, otherwise fall back to fetched blog status
  const effectiveStatus = currentStatus || blog?.status;
  const canDelete = effectiveStatus === "rejected";

  // ✅ Refetch blog data when dialog opens
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (dialogOpen) {
      refetch(); // Refetch latest data when opening dialog
    }
  }, [dialogOpen, refetch]);

  const handleDelete = async () => {
    if (!blog) {
      toast.error("Blog not found");
      return;
    }

    if (blog.status !== "rejected") {
      toast.error("Only blogs with status 'rejected' can be deleted");
      return;
    }

    try {
      const result = await deleteBlog(blogId);

      if (result.error) {
        const error = getErrorInApiResult({ error: result.error });
        toast.error(error);
      } else {
        toast.success("Blog deleted successfully");
        setDeleted(true);
        setDialogOpen(false);
        onDeleted?.();
      }
    } catch (error) {
      console.error("Unexpected error during deletion:", error);
      toast.error("An unexpected error occurred while deleting the blog");
    }
  };

  useEffect(() => {
    if (deleted) {
      console.log("Blog deleted, you can refresh the page or refetch list");
    }
  }, [deleted]);

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
      <AlertDialogContent className="bg-white z-[9999] dark:bg-gray-800 dark:text-white/90">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            blog.
            {!canDelete && (
              <span className="block mt-2 text-red-500 font-normal">
                Only blogs with status 'rejected' can be deleted. Current
                status: {effectiveStatus}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading || isFetching || !canDelete}
            className="bg-red-500 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Deleting..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
