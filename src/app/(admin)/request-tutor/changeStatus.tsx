"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { useState } from "react";
import toast from "react-hot-toast";

interface ChangeStatusDialogProps {
  requestId: string;
  currentStatus: "Pending" | "Approved" | "Tutor Assigned";
  onStatusChange?: () => void;
}

export function ChangeStatusDialog({
  requestId,
  currentStatus,
  onStatusChange,
}: ChangeStatusDialogProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [updateStatus] = useUpdateStatusMutation();

  const handleSave = async () => {
    try {
      await updateStatus({ requestId, status }).unwrap();
      toast.success("Status updated successfully");
      setOpen(false);
      onStatusChange?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Edit className="text-blue-500 cursor-pointer hover:text-blue-700" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Change Request Status</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <label>Status</label>
          <Select
            value={status}
            onValueChange={(val) =>
              setStatus(val as "Pending" | "Approved" | "Tutor Assigned")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Tutor Assigned">Tutor Assigned</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
