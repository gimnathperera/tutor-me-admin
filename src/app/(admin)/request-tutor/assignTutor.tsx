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
import { useUpdateAssignedTutorMutation } from "@/store/api/splits/request-tutor";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AssignedTutor {
  id: string;
  fullName: string;
}

interface AssignTutorsDialogProps {
  requestId: string;
  currentAssigned: AssignedTutor[];
  availableTutors: AssignedTutor[];
  onAssignedChange?: () => void;
}

export function AssignTutorsDialog({
  requestId,
  currentAssigned,
  availableTutors,
  onAssignedChange,
}: AssignTutorsDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTutorId, setSelectedTutorId] = useState<string>(
    currentAssigned[0]?.id || "",
  );
  const [updateAssigned] = useUpdateAssignedTutorMutation();

  useEffect(() => {
    setSelectedTutorId(currentAssigned[0]?.id || "");
  }, [currentAssigned]);

  const handleSave = async () => {
    if (!selectedTutorId) {
      toast.error("Please select a tutor");
      return;
    }

    try {
      await updateAssigned({
        requestId,
        assignedTutor: [selectedTutorId],
      }).unwrap();

      toast.success("Tutor assigned successfully");
      setOpen(false);
      onAssignedChange?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign tutor");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Assign Tutor</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Assign Tutor</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <Select
            value={selectedTutorId}
            onValueChange={(val) => setSelectedTutorId(val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select tutor" />
            </SelectTrigger>
            <SelectContent>
              {availableTutors.map((tutor) => (
                <SelectItem key={tutor.id} value={tutor.id}>
                  {tutor.fullName}
                </SelectItem>
              ))}
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
