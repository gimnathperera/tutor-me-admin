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
  onDeleted?: () => void;
}

export function DeleteBlog({ blogId, onDeleted }: DeleteBlogProps) {
  const { data: blog, isLoading: isFetching } = useFetchBlogByIdQuery(blogId);
  const [deleteBlog, { isLoading }] = useDeleteBlogMutation();

  const [deleted, setDeleted] = useState(false);

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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash2
          className={`cursor-pointer text-red-500 hover:text-red-600 ${
            blog?.status !== "rejected"
              ? "text-gray-400 cursor-not-allowed"
              : "text-red-500"
          }`}
        />
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white z-[9999] dark:bg-gray-800 dark:text-white/90">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            blog.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading || isFetching || blog?.status !== "rejected"}
            className="bg-red-500 text-white"
          >
            {isLoading ? "Deleting..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
