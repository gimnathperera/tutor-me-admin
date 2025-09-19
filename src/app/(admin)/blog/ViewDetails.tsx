"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";
import { useState } from "react";

interface BlogContentBlock {
  _id: string;
  type: "paragraph" | "heading" | "image";
  text?: string;
  src?: string;
  caption?: string;
  level?: number;
}

interface Blog {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  image?: string;
  status: "pending" | "approved" | "rejected";
  content: BlogContentBlock[];
  relatedArticles?: string[];
}

interface BlogDetailsProps {
  blog: Blog;
}

export function BlogDetails({ blog }: BlogDetailsProps) {
  const [open, setOpen] = useState(false);

  const displayFieldClass =
    "w-full rounded-md border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Eye cursor="pointer" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[75vh] overflow-y-auto scrollbar-thin bg-white z-[50] dark:bg-gray-800 dark:text-white/90">
        <DialogHeader>
          <DialogTitle>Blog Details</DialogTitle>
          <DialogDescription>
            View the full details of this blog.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Title */}
          <div className="grid gap-2">
            <Label>Title</Label>
            <div className={displayFieldClass}>{blog.title}</div>
          </div>

          {/* Author */}
          <div className="grid gap-2">
            <Label>Author</Label>
            <div className={displayFieldClass}>
              <div className="flex items-center gap-2">
                <img
                  src={blog.author.avatar}
                  alt={blog.author.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-medium">{blog.author.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {blog.author.role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="grid gap-2">
            <Label>Status</Label>
            <div className={displayFieldClass}>{blog.status}</div>
          </div>

          {/* Content */}
          <div className="grid gap-2">
            <Label>Content</Label>
            <div className={`${displayFieldClass} flex flex-col gap-3`}>
              {blog.content.map((block) => {
                switch (block.type) {
                  case "heading":
                    if (block.level === 1)
                      return (
                        <>
                          <h1 className="text-lg font-semibold">Heading:</h1>
                          <p key={block._id}>{block.text}</p>
                        </>
                      );
                    if (block.level === 2)
                      return (
                        <>
                          <h1 className="text-lg font-semibold">Heading:</h1>
                          <p key={block._id}>{block.text}</p>
                        </>
                      );
                    if (block.level === 3)
                      return (
                        <>
                          <h1 className="text-lg font-semibold">Heading:</h1>
                          <p key={block._id}>{block.text}</p>
                        </>
                      );
                    return (
                      <>
                        <h1 className="text-lg font-semibold">Heading:</h1>
                        <p key={block._id}>{block.text}</p>
                      </>
                    );
                  case "paragraph":
                    return (
                      <>
                        <h1 className="text-lg font-semibold">
                          Blog Paragraph:
                        </h1>
                        <p
                          key={block._id}
                          className="text-gray-700 dark:text-gray-300"
                        >
                          {block.text}
                        </p>
                      </>
                    );

                  case "image":
                    return (
                      <div key={block._id} className="flex flex-col gap-1">
                        <h1 className="text-lg font-semibold">
                          Article Image:
                        </h1>
                        <img
                          src={block.src}
                          alt={block.caption ?? "Blog image"}
                          className="rounded-md w-full object-cover"
                        />
                        {block.caption && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {block.caption}
                          </span>
                        )}
                      </div>
                    );
                }
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
