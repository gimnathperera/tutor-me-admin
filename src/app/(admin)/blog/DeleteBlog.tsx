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
import toast from "react-hot-toast";

interface DeleteBlogProps {
  blogId: string;
}

export function DeleteBlog({ blogId }: DeleteBlogProps) {
  const { data: blog, isLoading: isFetching } = useFetchBlogByIdQuery(blogId);
  const [deleteBlog, { isLoading }] = useDeleteBlogMutation();

  const handleDelete = async () => {
    if (!blog) {
      toast.error("Blog not found");
      return;
    }

    if (blog.status !== "rejected") {
      toast.error("Only blogs with status 'disabled' can be deleted");
      return;
    }

    try {
      const result = await deleteBlog(blogId);

      if (result.error) {
        const error = getErrorInApiResult({ error: result.error });
        toast.error(error);
      } else {
        toast.success("User deleted successfully");
      }
    } catch (error) {
      console.error("Unexpected error during user deletion:", error);
      toast.error("An unexpected error occurred while deleting the user");
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash2
          className={`cursor-pointer ${
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
            Blog.
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
