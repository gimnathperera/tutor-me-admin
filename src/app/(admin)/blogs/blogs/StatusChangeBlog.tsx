"use client";

import { Button } from "@/components/ui/button/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface BlogStatusDialogProps {
  id: string;
  currentStatus: "pending" | "approved" | "rejected";
  onStatusChange?: () => void;
}

export function BlogStatusDialog({
  id,
  currentStatus,
  onStatusChange,
}: BlogStatusDialogProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [updateStatus, { isLoading }] = useUpdateBlogStatusMutation();

  useEffect(() => {
    if (open) {
      setStatus(currentStatus);
    }
  }, [open, currentStatus]);

  const handleSave = async () => {
    try {
      await updateStatus({ blogId: id, status }).unwrap();
      toast.success("Status updated successfully");
      setOpen(false);
      onStatusChange?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Edit className="cursor-pointer text-blue-500 hover:text-blue-700" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px] overflow-hidden bg-white p-0 dark:bg-gray-800 dark:text-white/90">
        <DialogHeader className="">
          <DialogTitle className=" font-semibold">Edit Blog Status</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-5">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Status</label>

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
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className=" dark:border-gray-700">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} isLoading={isLoading}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
