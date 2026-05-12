"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateStatusMutation } from "@/store/api/splits/request-tutor";
import { Edit } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

interface ChangeStatusDialogProps {
  requestId: string;
  currentStatus: "Pending" | "Rejected";
  onStatusChange?: () => void;
}

export function ChangeStatusDialog({
  requestId,
  currentStatus,
  onStatusChange,
}: ChangeStatusDialogProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [rejectionReason, setRejectionReason] = useState("");
  const [validationError, setValidationError] = useState("");
  const [updateStatus, { isLoading }] = useUpdateStatusMutation();
  const rejectionReasonRef = useRef<HTMLTextAreaElement | null>(null);

  const isRejected = status === "Rejected";
  const isSaveDisabled = useMemo(() => {
    if (status === "Rejected") {
      return rejectionReason.trim().length === 0;
    }

    return false;
  }, [rejectionReason, status]);

  useEffect(() => {
    if (open) {
      setStatus(currentStatus);
      setRejectionReason("");
      setValidationError("");
    }
  }, [currentStatus, open]);

  const handleSave = async () => {
    const nextRejectionReason =
      rejectionReasonRef.current?.value.trim() || rejectionReason.trim();

    if (status === "Rejected" && !nextRejectionReason) {
      setValidationError(
        "Rejection reason is required when rejecting a tutor request.",
      );
      return;
    }

    try {
      await updateStatus({
        requestId,
        status,
        ...(status === "Rejected"
          ? { rejectionReason: nextRejectionReason }
          : {}),
      }).unwrap();
      toast.success("Status updated successfully");
      setOpen(false);
      setRejectionReason("");
      setValidationError("");
      onStatusChange?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Change request status"
          className="inline-flex h-8 w-8 items-center justify-center text-blue-500 hover:text-blue-700"
        >
          <Edit className="h-5 w-5" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden [&>div:last-child]:flex [&>div:last-child]:min-h-0 [&>div:last-child]:flex-col [&>div:last-child]:overflow-hidden [&>div:last-child]:p-0">
        <DialogHeader className="shrink-0 px-6 py-4 border-b">
          <DialogTitle>Change Request Status</DialogTitle>
          <DialogDescription>
            Leave the request pending or reject it with a reason that will be
            emailed to the requester.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-6 flex flex-col gap-4">
          <label>Status</label>
          <Select
            value={status}
            onValueChange={(val) => {
              const nextStatus = val as "Pending" | "Rejected";
              setStatus(nextStatus);

              if (nextStatus === "Pending") {
                setRejectionReason("");
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          {isRejected && (
            <div className="flex flex-col gap-2">
              <label htmlFor="rejectionReason">Rejection reason</label>
              <textarea
                id="rejectionReason"
                ref={rejectionReasonRef}
                value={rejectionReason}
                onChange={(event) => {
                  setRejectionReason(event.target.value);
                  if (validationError) {
                    setValidationError("");
                  }
                }}
                placeholder="Explain why this request was rejected"
                rows={4}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
              />
              <p className="text-xs text-gray-500">
                This reason will be emailed to the requester.
              </p>
            </div>
          )}

          {validationError && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {validationError}
            </p>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaveDisabled || isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
