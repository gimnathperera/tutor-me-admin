/* eslint-disable @next/next/no-img-element */
"use client";

import { Loader2, Plus, X } from "lucide-react";
import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

export interface CertificateFileItem {
  type: string;
  url: string;
  id?: string;
}

interface NewFileItem {
  file: File;
  url?: string;
  previewUrl?: string;
  type: string;
}

const CERTIFICATE_TYPE_OPTIONS = [
  "NIC",
  "Passport",
  "Degree Certificate",
  "A/L Certificate",
  "O/L Certificate",
  "Professional Certificate",
  "Teaching Certificate",
  "Others",
];

interface MultiFileUploadDropzoneProps {
  onUploaded: (items: CertificateFileItem[]) => void;
  defaultFiles?: CertificateFileItem[];
}

export default function MultiFileUploadDropzone({
  onUploaded,
  defaultFiles = [],
}: MultiFileUploadDropzoneProps) {
  const [uploading, setUploading] = useState(false);
  const [newFiles, setNewFiles] = useState<NewFileItem[]>([]);
  const [existingFiles, setExistingFiles] = useState<CertificateFileItem[]>(defaultFiles);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: unknown[]) => {
      if (fileRejections && (fileRejections as unknown[]).length > 0) {
        setError("Only images and PDF files are accepted");
      } else {
        setError(null);
      }

      const incoming: NewFileItem[] = acceptedFiles.map((file) => ({
        file,
        type: "Others",
      }));
      setNewFiles((prev) => [...prev, ...incoming]);

      for (const fileObj of incoming) {
        const file = fileObj.file;
        setUploading(true);

        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = () => {
            fileObj.previewUrl = reader.result as string;
            setNewFiles((prev) => [...prev]);
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
          setNewFiles((prev) => [...prev]);
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
    const uploadedNew: CertificateFileItem[] = newFiles
      .filter((f) => f.url)
      .map((f) => ({ type: f.type, url: f.url! }));
    onUploadedRef.current([...existingFiles, ...uploadedNew]);
  }, [newFiles, existingFiles]);

  const removeExisting = (index: number, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setExistingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateExistingType = (index: number, type: string) => {
    setExistingFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, type } : f)),
    );
  };

  const removeNew = (index: number, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateNewType = (index: number, type: string) => {
    setNewFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, type } : f)),
    );
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
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-colors
          ${isDragActive
            ? "border-blue-500 bg-blue-50/50"
            : "border-gray-200 hover:border-blue-500/50 hover:bg-gray-50/50"
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <div className="p-3 rounded-full bg-gray-100">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            ) : (
              <Plus className="h-6 w-6 text-gray-500" />
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">
              {isDragActive ? "Drop files here" : "Click or drag to upload"}
            </p>
            <p className="text-xs text-gray-500">PDF, Images</p>
          </div>
        </div>
      </div>
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {(existingFiles.length > 0 || newFiles.length > 0) && (
        <div className="grid gap-2">
          {/* Existing uploaded files */}
          {existingFiles.map((cert, i) => (
            <div
              key={`existing-${i}-${cert.url}`}
              className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm"
            >
              <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-500">LINK</span>
              </div>
              <div className="flex-1 min-w-0 grid gap-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {cert.url.split("/").pop() || cert.url}
                </p>
                <select
                  value={cert.type}
                  onChange={(e) => updateExistingType(i, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs border rounded px-2 py-1 bg-white text-gray-700 w-full max-w-[220px]"
                >
                  {CERTIFICATE_TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={(e) => removeExisting(i, e)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          {/* Newly added files */}
          {newFiles.map((fileObj, i) => (
            <div
              key={`new-${i}-${fileObj.file.name}`}
              className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm"
            >
              <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                {fileObj.previewUrl ? (
                  <img
                    src={fileObj.previewUrl}
                    alt={fileObj.file.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-medium text-gray-500">FILE</span>
                )}
              </div>
              <div className="flex-1 min-w-0 grid gap-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {fileObj.file.name}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500">
                    {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {fileObj.url && (
                    <span className="text-xs text-green-600 font-medium">Uploaded</span>
                  )}
                </div>
                <select
                  value={fileObj.type}
                  onChange={(e) => updateNewType(i, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs border rounded px-2 py-1 bg-white text-gray-700 w-full max-w-[220px]"
                >
                  {CERTIFICATE_TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={(e) => removeNew(i, e)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
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
