"use client";

import { Button } from "@/components/ui/button/Button";
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
import { useUpdateBlogStatusMutation } from "@/store/api/splits/blogs";
import { Edit } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface BlogStatusDialogProps {
  id: string;
  currentStatus: "pending" | "approved" | "rejected";
  onStatusChange?: () => void; // parent callback
}

export function BlogStatusDialog({
  id,
  currentStatus,
  onStatusChange,
}: BlogStatusDialogProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [updateStatus, { isLoading }] = useUpdateBlogStatusMutation();

  const handleSave = async () => {
    try {
      await updateStatus({ blogId: id, status }).unwrap();
      toast.success("Status updated successfully");
      setOpen(false);
      onStatusChange?.(); // trigger parent refresh/list update
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Edit cursor="pointer" className="text-blue-500 hover:text-blue-700" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Blog Status</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <label className="font-medium">Status</label>
          <Select
            value={status}
            onValueChange={(val) =>
              setStatus(val as "pending" | "approved" | "rejected")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approve</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} isLoading={isLoading}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
