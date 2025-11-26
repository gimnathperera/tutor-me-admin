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
import { useFetchTutorsQuery } from "@/store/api/splits/tutors";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface AssignedTutor {
  _id: string; // use only _id to match your API
  fullName: string;
}

export interface TutorRequestBlock {
  _id: string; // tutorBlockId
  subjects: { title: string }[];
  assignedTutor?: AssignedTutor[];
  preferredTutorType?: string;
  duration: string;
  frequency: string;
  createdAt: string;
}

export interface AssignTutorRow {
  id: string; // requestId
  tutors?: TutorRequestBlock[];
}

interface Props {
  row: AssignTutorRow;
  onUpdated?: () => void;
}

export function AssignTutorDialog({ row, onUpdated }: Props) {
  const [open, setOpen] = useState(false);
  const [updateAssignedTutor] = useUpdateAssignedTutorMutation();
  const [tutorBlocks, setTutorBlocks] = useState<TutorRequestBlock[]>([]);

  const {
    data: tutorsData,
    isLoading,
    isError,
    refetch,
  } = useFetchTutorsQuery({});

  const tutors =
    row.tutors?.map((t) => ({
      ...t,
      // make sure assignedTutor has _id
      assignedTutor: t.assignedTutor?.map((a) => ({
        _id: a._id,
        fullName: a.fullName,
      })),
    })) || [];

  const [selectedTutors, setSelectedTutors] = useState<string[]>(
    tutors.map((t) => t.assignedTutor?.[0]?._id || ""),
  );

  useEffect(() => {
    setTutorBlocks(
      row.tutors?.map((t) => ({
        ...t,
        assignedTutor: t.assignedTutor?.map((a) => ({
          _id: a._id,
          fullName: a.fullName,
        })),
      })) || [],
    );
  }, [row.tutors]);
  const handleUpdate = async (index: number, tutorId: string) => {
    if (!tutorId || tutorId === "placeholder") return;

    const tutorBlockId = tutorBlocks[index]._id;
    if (!tutorBlockId) {
      toast.error("Tutor block ID not found");
      return;
    }

    try {
      const newTutorBlocks = [...tutorBlocks];
      const selectedTutor = tutorsData?.results.find((t) => t.id === tutorId);
      if (selectedTutor) {
        newTutorBlocks[index].assignedTutor = [
          { _id: selectedTutor.id, fullName: selectedTutor.fullName },
        ];
        setTutorBlocks(newTutorBlocks);
      }

      await updateAssignedTutor({
        requestId: row.id,
        tutorBlockId,
        assignedTutor: [tutorId],
      }).unwrap();

      toast.success("Tutor updated successfully");
      onUpdated?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update tutor");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <Edit size={16} />
          Assign Tutors
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Tutors</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-4">
          {tutors.map((tutorBlock, index) => (
            <div
              key={tutorBlock._id || index}
              className="border border-gray-300 rounded-md p-4"
            >
              <p className="font-medium">Tutor Request #{index + 1}</p>
              <div className="mt-3 flex flex-col gap-3">
                <label className="text-sm">Assign Tutor</label>

                <Select
                  value={selectedTutors[index] || "placeholder"}
                  onValueChange={(val) => handleUpdate(index, val)}
                  disabled={isLoading || isError}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a tutor" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="placeholder" disabled>
                      {isLoading ? "Loading tutors..." : "Select a tutor"}
                    </SelectItem>

                    {tutorsData?.results.map((tutor) => (
                      <SelectItem key={tutor.id} value={tutor.id}>
                        {tutor.fullName}
                      </SelectItem>
                    ))}

                    {!isLoading && tutorsData?.results.length === 0 && (
                      <SelectItem value="none" disabled>
                        No tutors available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
