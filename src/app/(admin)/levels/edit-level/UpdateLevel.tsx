/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client";
import MultiSelect from "@/components/form/MultiSelect";
import { Button } from "@/components/ui/button/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateLevelMutation } from "@/store/api/splits/levels";
import { useFetchSubjectsQuery } from "@/store/api/splits/subjects";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { UpdateLevelSchema, updateLevelSchema } from "./schema";

interface UpdateLevelProps {
  id: string;
  title: string;
  details: string[];
  challanges: string[];
  subjects: string[];
}

interface Subject {
  id: string;
  title: string;
}

export function UpdateLevel({
  id,
  title,
  details = [],
  challanges = [],
  subjects = [],
}: UpdateLevelProps) {
  const [open, setOpen] = useState(false);
  const updateLevelForm = useForm<UpdateLevelSchema>({
    resolver: zodResolver(updateLevelSchema),
    defaultValues: {
      title,
      details,
      challanges,
      subjects,
    },
    mode: "onChange",
  });

  useEffect(() => {
    updateLevelForm.reset({
      title,
      details,
      challanges,
      subjects,
    });
  }, [title, details, challanges, subjects, updateLevelForm]);

  const { control, register, handleSubmit, setValue } = updateLevelForm;

  // @ts-expect-error: useFieldArray generic typing workaround
  const detailsArray = useFieldArray({ control, name: "details" });
  // @ts-expect-error: useFieldArray generic typing workaround
  const challengesArray = useFieldArray({ control, name: "challanges" });

  const [updateLevel, { isLoading }] = useUpdateLevelMutation();

  const { data: subjectsData } = useFetchSubjectsQuery({ page: 1, limit: 100 });

  const subjectOptions =
    subjectsData?.results?.map((s: Subject) => ({
      text: s.title,
      value: s.id,
      selected: subjects.includes(s.id),
    })) || [];

  // Handle dialog close - reset form to original values
  const handleDialogClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      updateLevelForm.reset({
        title,
        details,
        challanges,
        subjects,
      });
    }
  };

  const onSubmit = async (data: UpdateLevelSchema) => {
    try {
      const payload = {
        id,
        title: data.title,

        // Filter out empty strings to match backend validation
        details: data.details.filter((d) => d.trim() !== ""),
        challanges: data.challanges.filter((c) => c.trim() !== ""), // Fixed: backend expects 'challanges' not 'challenges'
        subjects: data.subjects ?? [],
      };

      const result = await updateLevel(payload);
      const error = getErrorInApiResult(result);

      if (error) {
        return toast.error(error);
      }

      if ("data" in result) {
        setOpen(false);
        updateLevelForm.reset();
        toast.success("Level updated successfully");
      }
    } catch (error) {
      console.error("Unexpected error during level update:", error);
      toast.error("An unexpected error occurred while updating the level.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <form>
        <DialogTrigger asChild>
          <SquarePen className="cursor-pointer text-blue-500 hover:text-blue-700" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] bg-white z-[9999] dark:bg-gray-800 dark:text-white/90">
          <DialogHeader>
            <DialogTitle>Edit Level</DialogTitle>
            <DialogDescription>Edit the level details.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Title" {...register("title")} />
            </div>

            <div>
              <Label>Details</Label>
              <div className="space-y-2">
                {detailsArray.fields.map((f, idx) => (
                  <div key={f.id} className="flex gap-2 items-center mt-3">
                    <input
                      {...register(`details.${idx}` as const)}
                      className="border rounded p-2 flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => detailsArray.remove(idx)}
                    >
                      <Trash2 className="text-red-500" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => detailsArray.append("")}
                  className="text-blue-500 text-sm"
                >
                  + Add Detail
                </button>
              </div>
            </div>

            <div>
              <Label>Challenges</Label>
              <div className="space-y-2">
                {challengesArray.fields.map((f, idx) => (
                  <div key={f.id} className="flex gap-2 items-center mt-3">
                    <input
                      {...register(`challanges.${idx}` as const)}
                      className="border rounded p-2 flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => challengesArray.remove(idx)}
                    >
                      <Trash2 className="text-red-500" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => challengesArray.append("")}
                  className="text-blue-500 text-sm"
                >
                  + Add Challenge
                </button>
              </div>
            </div>

            <div>
              <Label className="mb-3">Subjects</Label>
              <MultiSelect
                key={open ? "open" : "closed"} // Force re-render when dialog opens
                label=""
                options={subjectOptions}
                defaultSelected={subjects}
                onChange={(values: string[]) => setValue("subjects", values)}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-700 text-white hover:bg-blue-500"
              isLoading={isLoading}
              onClick={() => handleSubmit(onSubmit)()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
