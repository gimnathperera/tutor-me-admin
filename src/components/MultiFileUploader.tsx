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
    // Store uploaded URLs for display, mixing defaults and new uploads if needed, 
    // but simpler to just trust the parent or maintain internal state of URLs.
    // The user's code only maintained `files` (newly added) and called `onUploaded` with mixed list?
    // User's code: `onUploaded([...files.filter((f) => f.url), fileObj].filter((f) => f.url).map((f) => f.url!))`
    // It seems user's code didn't explicitly handle default existing URLs in the UI list, only new uploads.
    // I should probably enhance it to show existing URLs passed via props.

    // Actually, let's stick to the user's provided code for now, but I might need to adapt it if I want to show existing files in Edit mode.
    // The user's referenced code:
    /* 
    const removeFile = (index: number, e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);
      onUploaded(updatedFiles.filter((f) => f.url).map((f) => f.url!));
    };
    */

    // Wait, if I'm editing a tutor with existing certificates, I want to see them.
    // The user's code `MultiFileUploadDropzone` doesn't seem to take `defaultFiles`.
    // `EditTutor` passes `tutorData.certificatesAndQualifications` to the form.
    // I should modify the component to verify it handles initial values if I want a true "Edit" experience.
    // However, `AddTutor` starts empty.
    // Let's implement the user's code exactly first, then maybe enhance it if needed, or simply let `EditTutor` handle the display of existing certs separately (which `EditTutor` was doing with a list of inputs).
    // Actually, existing `EditTutor` has a manual list of inputs for certs.
    // If I replace it with this uploader, this uploader SHOULD handle existing files.

    // I will add `defaultUrls` logic to make it robust for EditTutor.

    // Re-reading user's code:
    // It receives `onUploaded`.

    const [existingUrls, setExistingUrls] = useState<string[]>(defaultFiles);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const newFiles: FileItem[] = acceptedFiles.map((file) => ({ file }));
            setFiles((prev) => [...prev, ...newFiles]);

            for (const fileObj of newFiles) {
                const file = fileObj.file;
                setUploading(true);

                // Preview for images
                if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        fileObj.previewUrl = reader.result as string;
                        setFiles((prev) => [...prev]); // refresh state
                    };
                    reader.readAsDataURL(file);
                }

                try {
                    // Get signed upload URL
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

                    // Save uploaded URL
                    fileObj.url = uploadUrl.split("?")[0];
                    setFiles((prev) => [...prev]); // refresh state

                    // triggerOnUpload() handled by useEffect
                } catch (err) {
                    console.error(err);
                    alert(`Upload failed for ${file.name}`);
                } finally {
                    setUploading(false);
                }
            }
        },
        [existingUrls /* deps */] // need to be careful with closure
    );

    // Helper to sync parent
    const onUploadedRef = useRef(onUploaded);

    // Update ref when prop changes so effect uses latest version without re-running
    useEffect(() => {
        onUploadedRef.current = onUploaded;
    }, [onUploaded]);

    useEffect(() => {
        const newUrls = [
            ...existingUrls,
            ...files.filter((f) => f.url).map((f) => f.url!)
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
                        <p className="text-xs text-gray-500">
                            PDF, Images, etc.
                        </p>
                    </div>
                </div>
            </div>

            {(files.length > 0 || existingUrls.length > 0) && (
                <div className="grid gap-2">
                    {/* Existing URLs */}
                    {existingUrls.map((url, i) => (
                        <div
                            key={`existing-${i}-${url}`}
                            className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm group"
                        >
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <span className="text-xs font-medium text-gray-500">
                                        LINK
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {url.split('/').pop() || url}
                                    </p>
                                    <p className="text-xs text-gray-500">Existing Upload</p>
                                </div>
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

                    {/* New Files */}
                    {files.map((fileObj, i) => (
                        <div
                            key={`new-${i}-${fileObj.file.name}`}
                            className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm group"
                        >
                            <div className="flex items-center space-x-3 overflow-hidden">
                                {fileObj.previewUrl ? (
                                    <div className="h-10 w-10 shrink-0 relative rounded-lg overflow-hidden border">
                                        <img
                                            src={fileObj.previewUrl}
                                            alt={fileObj.file.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <span className="text-xs font-medium text-gray-500">
                                            FILE
                                        </span>
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {fileObj.file.name}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <p className="text-xs text-gray-500">
                                            {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                        {fileObj.url && (
                                            <span className="text-xs text-green-600 font-medium">
                                                Uploaded
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => removeFile(i, e)}
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

