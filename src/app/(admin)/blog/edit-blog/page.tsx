"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SquarePen } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import {
  UpdateArticleSchema,
  updateArticleSchema,
} from "./schema";
import { useUpdateBlogMutation } from "@/store/api/splits/blogs";
import { getErrorInApiResult } from "@/utils/api";
import { Button } from "@/components/ui/button/Button";

interface UpdateBlogProps {
  id: string;
  title: string;
  author: string;
  image?: string;
  status?: "pending" | "approved" | "rejected";
}

export function UpdateBlog({
  id,
  title,
  author,
  image,
  status,
}: UpdateBlogProps) {
  const [open, setOpen] = useState(false);

  const updateBlogForm = useForm<UpdateArticleSchema>({
    resolver: zodResolver(updateArticleSchema),
    defaultValues: {
      title: "",
      author: "",
      image: "",
      status: "pending",
    },
    mode: "onChange",
  });

  const { register, reset, handleSubmit } = updateBlogForm;
  const [updateBlog, { isLoading }] = useUpdateBlogMutation();

  // preload values when opening dialog
  useEffect(() => {
    if (open) {
      reset({
        title,
        author.name,
        image: image || "",
        status: status || "pending",
      });
    }
  }, [open, title, author, image, status, reset]);

  const onSubmit = async (data: UpdateArticleSchema) => {
    try {
      const result = await updateBlog({ id, ...data });
      const error = getErrorInApiResult(result);
      if (error) return toast.error(error);

      if ("data" in result) {
        toast.success("Blog updated successfully");
        setOpen(false);
      }
    } catch (err) {
      console.error("Unexpected error during blog update:", err);
      toast.error("Unexpected error while updating the blog");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SquarePen className="cursor-pointer" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 dark:text-white">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Blog</DialogTitle>
            <DialogDescription>Update the blog details below.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Title" {...register("title")} />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="authorName">Author Name</Label>
              <Input
                id="authorName"
                placeholder="Author Name"
                {...register("author.name")}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                placeholder="https://example.com/image.jpg"
                {...register("image")}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                {...register("status")}
                className="w-full rounded-md border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              >
                <option value="pending">Pending</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-700 text-white hover:bg-blue-500"
              isLoading={isLoading}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
