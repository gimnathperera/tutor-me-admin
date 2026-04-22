/* eslint-disable @next/next/no-img-element */
"use client";

import { Loader2, Plus, X } from "lucide-react";
import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileItem {
  file: File;
  url?: string;
  previewUrl?: string;
}

interface MultiFileUploadDropzoneProps {
  onUploaded: (urls: string[]) => void;
  defaultFiles?: string[];
}

export default function MultiFileUploadDropzone({
  onUploaded,
  defaultFiles = [],
}: MultiFileUploadDropzoneProps) {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [existingUrls, setExistingUrls] = useState<string[]>(defaultFiles);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: unknown[]) => {
      if (fileRejections.length > 0) {
        setError("Only images and PDF files are accepted");
      } else {
        setError(null);
      }

      const newFiles: FileItem[] = acceptedFiles.map((file) => ({ file }));
      setFiles((prev) => [...prev, ...newFiles]);

      for (const fileObj of newFiles) {
        const file = fileObj.file;
        setUploading(true);

        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = () => {
            fileObj.previewUrl = reader.result as string;
            setFiles((prev) => [...prev]);
          };
          reader.readAsDataURL(file);
        }

        try {
          const signed = await fetch("/api/upload-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName: `${Date.now()}-${file.name}`,
              fileType: file.type,
            }),
          }).then((res) => res.json());

          const uploadUrl = signed.uploadUrl;
          if (!uploadUrl) throw new Error("Failed to generate upload URL");

          const uploadRes = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
              "x-ms-blob-type": "BlockBlob",
              "Content-Type": file.type,
            },
            body: file,
          });

          if (!uploadRes.ok) throw new Error("Upload failed");

          fileObj.url = uploadUrl.split("?")[0];
          setFiles((prev) => [...prev]);
        } catch (err) {
          console.error(err);
          alert(`Upload failed for ${file.name}`);
        } finally {
          setUploading(false);
        }
      }
    },
    [],
  );

  const onUploadedRef = useRef(onUploaded);

  useEffect(() => {
    onUploadedRef.current = onUploaded;
  }, [onUploaded]);

  useEffect(() => {
    const newUrls = [
      ...existingUrls,
      ...files.filter((f) => f.url).map((f) => f.url!),
    ];
    onUploadedRef.current(newUrls);
  }, [files, existingUrls]);

  const removeFile = (index: number, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const removeExisting = (index: number, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const updated = [...existingUrls];
    updated.splice(index, 1);
    setExistingUrls(updated);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [],
      "application/pdf": [],
    },
  });

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={`relative rounded-md border-2 border-dashed p-6 transition-colors cursor-pointer
          ${
            isDragActive
              ? "border-brand-300 bg-brand-50/40 dark:border-brand-500 dark:bg-gray-800/80"
              : "border-gray-300 bg-white hover:border-brand-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-500 dark:hover:bg-gray-800/80"
          }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
            ) : (
              <Plus className="h-6 w-6 text-brand-500" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {isDragActive ? "Drop files here" : "Click or drag to upload"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PDF, Images
            </p>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {(files.length > 0 || existingUrls.length > 0) && (
        <div className="grid gap-2">
          {existingUrls.map((url, i) => (
            <div
              key={`existing-${i}-${url}`}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="flex min-w-0 items-center space-x-3 overflow-hidden">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    LINK
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                    {url.split("/").pop() || url}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Existing Upload
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => removeExisting(i, e)}
                className="p-2 text-gray-400 transition-colors hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          {files.map((fileObj, i) => (
            <div
              key={`new-${i}-${fileObj.file.name}`}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="flex min-w-0 items-center space-x-3 overflow-hidden">
                {fileObj.previewUrl ? (
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <img
                      src={fileObj.previewUrl}
                      alt={fileObj.file.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      FILE
                    </span>
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                    {fileObj.file.name}
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {fileObj.url && (
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        Uploaded
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => removeFile(i, e)}
                className="p-2 text-gray-400 transition-colors hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
