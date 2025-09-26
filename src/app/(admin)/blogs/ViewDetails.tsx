"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
        <Eye cursor="pointer" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[75vh] overflow-y-auto scrollbar-thin bg-white z-[50] dark:bg-gray-800 dark:text-white/90">
        <DialogHeader>
          {/* 1 -> Blog Title */}
          <DialogTitle className="text-2xl font-bold">{blog.title}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* 2 -> Cover Image */}
          {blog.image && (
            <div>
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-64 object-cover rounded-md"
              />
            </div>
          )}

          {/* 3 -> Author/User Details */}
          <div className="flex items-center gap-3">
            <img
              src={blog.author.avatar}
              alt={blog.author.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{blog.author.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {blog.author.role}
              </p>
            </div>
          </div>

          {/* 4 -> Headings */}
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

          {/* 5 -> Paragraphs */}
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
