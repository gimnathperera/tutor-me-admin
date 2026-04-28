/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchUserByIdQuery } from "@/store/api/splits/users";
import { Eye } from "lucide-react";
import { useMemo, useState } from "react";

interface BlogContentBlock {
  _id: string;
  type: "paragraph" | "heading" | "image" | "list";
  text?: string;
  src?: string;
  caption?: string;
  level?: number;
  items?: string[];
  style?: "ordered" | "unordered";
}

interface BlogAuthor {
  id?: string | { $oid?: string };
  role?: string;
  name?: string;
  avatar?: string;
}

interface Blog {
  id: string;
  title: string;
  author: BlogAuthor;
  image?: string;
  status: "pending" | "approved" | "rejected";
  content: BlogContentBlock[];
  relatedArticles?: string[];
}

interface BlogDetailsProps {
  blog: Blog;
}

const normalizeMongoId = (value?: string | { $oid?: string }) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.$oid || "";
};

export function BlogDetails({ blog }: BlogDetailsProps) {
  const [open, setOpen] = useState(false);

  const authorId = useMemo(
    () => normalizeMongoId(blog.author?.id),
    [blog.author?.id],
  );

  const { data: authorData, isLoading: isAuthorLoading } =
    useFetchUserByIdQuery(authorId, {
      skip: !authorId,
    });

  const authorName =
    authorData?.name?.trim() || blog.author?.name?.trim() || "Unknown";

  const authorAvatar =
    authorData?.avatar?.trim() ||
    blog.author?.avatar?.trim() ||
    "/images/user/user.png";

  const authorRole =
    authorData?.role?.trim() || blog.author?.role?.trim() || "admin";

  const headings = blog.content.filter((block) => block.type === "heading");
  const paragraphs = blog.content.filter((block) => block.type === "paragraph");

  function decodeHtml(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Eye cursor="pointer" className="text-blue-500 hover:text-blue-700" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[75vh] overflow-y-auto scrollbar-thin bg-white z-[50] dark:bg-gray-800 dark:text-white/90">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{blog.title}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {blog.image && (
            <div>
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-64 object-cover rounded-md"
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            {isAuthorLoading ? (
              <>
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </>
            ) : (
              <>
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="h-10 w-10 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/images/user/user.png";
                  }}
                />
                <div>
                  <p className="font-medium">{authorName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {authorRole}
                  </p>
                </div>
              </>
            )}
          </div>

          <article className="prose dark:prose-invert font-semibold max-w-none">
            {headings.map((block) => {
              if (block.level === 1)
                return (
                  <h1 key={block._id} className="mt-6 mb-2">
                    {block.text}
                  </h1>
                );
              if (block.level === 2)
                return (
                  <h2 key={block._id} className="mt-5 mb-2">
                    {block.text}
                  </h2>
                );
              if (block.level === 3)
                return (
                  <h3 key={block._id} className="mt-4 mb-2">
                    {block.text}
                  </h3>
                );
              return (
                <h4 key={block._id} className="mt-4 mb-2">
                  {block.text}
                </h4>
              );
            })}
          </article>

          <article className="prose dark:prose-invert max-w-none">
            {paragraphs.map((block) => (
              <p
                key={block._id}
                className="text-justify font-light"
                dangerouslySetInnerHTML={{
                  __html: decodeHtml(block.text || ""),
                }}
              />
            ))}
          </article>
        </div>
      </DialogContent>
    </Dialog>
  );
}
