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
  currentStatus?: "pending" | "approved" | "rejected" | "published" | "draft";
  onDeleted?: () => void;
}

export function DeleteBlog({
  blogId,
  currentStatus,
  onDeleted,
}: DeleteBlogProps) {
  const {
    data: blog,
    isLoading: isFetching,
    refetch,
  } = useFetchBlogByIdQuery(blogId, {
    refetchOnMountOrArgChange: true,
  });

  const [deleteBlog, { isLoading }] = useDeleteBlogMutation();
  const [deleted, setDeleted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const effectiveStatus = currentStatus || blog?.status;
  const canDelete = effectiveStatus === "rejected";

  useEffect(() => {
    if (dialogOpen) {
      refetch();
    }
  }, [dialogOpen, refetch]);

  const handleDelete = async (): Promise<void> => {
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

      if ("error" in result && result.error) {
        const error = getErrorInApiResult({ error: result.error });
        toast.error(error);
      } else {
        toast.success("Blog deleted successfully");
        setDeleted(true);
        setDialogOpen(false);
        onDeleted?.();
      }
    } catch (err: unknown) {
      console.error("Unexpected error during deletion:", err);
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
                Only blogs with status &#39;rejected&#39; can be deleted.
                Current status: {effectiveStatus}
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
