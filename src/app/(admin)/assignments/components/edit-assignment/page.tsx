"use client";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetchGradesQuery } from "@/store/api/splits/grades";
import {
  useFetchAssignmentByIdQuery,
  useUpdateAssignmentMutation,
} from "@/store/api/splits/tuition-assignments";
import { useFetchTutorsQuery } from "@/store/api/splits/tutors";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { updateAssignmentSchema, UpdateAssignmentSchema } from "./schema";

interface UpdateAssignmentProps {
  id: string;
}

export function UpdateAssignment({ id }: UpdateAssignmentProps) {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useFetchAssignmentByIdQuery(id);

  // fetch dropdown data
  const { data: gradesData, isLoading: gradesLoading } = useFetchGradesQuery(
    {},
  );
  const { data: tutorsData, isLoading: tutorsLoading } = useFetchTutorsQuery(
    {},
  );

  const form = useForm<UpdateAssignmentSchema>({
    resolver: zodResolver(updateAssignmentSchema),
    defaultValues: {
      title: "",
      assignmentNumber: "",
      address: "",
      duration: "",
      assignmentPrice: "",
      gradeId: "",
      tutorId: "",
    },
    mode: "onChange",
  });

  const { formState, reset, setValue, watch } = form;

  const [updateAssignment, { isLoading: isUpdating }] =
    useUpdateAssignmentMutation();

  useEffect(() => {
    if (data) {
      reset({
        title: data.title || "",
        assignmentNumber: data.assignmentNumber || "",
        address: data.address || "",
        duration: data.duration || "",
        assignmentPrice: data.assignmentPrice || "",
        gradeId: data.gradeId || "",
        tutorId: data.tutorId || "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (values: UpdateAssignmentSchema) => {
    try {
      await updateAssignment({
        id,
        ...values,
        assignmentPrice: String(values.assignmentPrice),
      }).unwrap();

      toast.success("Assignment updated successfully");
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update assignment");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <SquarePen className="cursor-pointer" />
        </DialogTrigger>

        <DialogContent className="sm:max-w-[500px] bg-white z-50 dark:bg-gray-800 dark:text-white/90">
          <DialogHeader>
            <DialogTitle>Edit Assignment</DialogTitle>
            <DialogDescription>Update the assignment details</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 max-h-[67vh] overflow-y-auto">
            {/* Title */}
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...form.register("title")} />
              {formState.errors.title && (
                <p className="text-sm text-red-500">
                  {formState.errors.title.message}
                </p>
              )}
            </div>

            {/* Assignment Number */}
            <div className="grid gap-3">
              <Label htmlFor="assignmentNumber">Assignment Number</Label>
              <Input
                id="assignmentNumber"
                {...form.register("assignmentNumber")}
              />
              {formState.errors.assignmentNumber && (
                <p className="text-sm text-red-500">
                  {formState.errors.assignmentNumber.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="grid gap-3">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...form.register("address")} />
              {formState.errors.address && (
                <p className="text-sm text-red-500">
                  {formState.errors.address.message}
                </p>
              )}
            </div>

            {/* Duration */}
            <div className="grid gap-3">
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" {...form.register("duration")} />
              {formState.errors.duration && (
                <p className="text-sm text-red-500">
                  {formState.errors.duration.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="grid gap-3">
              <Label htmlFor="assignmentPrice">Price</Label>
              <Input
                id="assignmentPrice"
                type="number"
                {...form.register("assignmentPrice")}
              />
              {formState.errors.assignmentPrice && (
                <p className="text-sm text-red-500">
                  {formState.errors.assignmentPrice.message}
                </p>
              )}
            </div>

            {/* Grade Select */}
            <div className="grid gap-3">
              <Label htmlFor="gradeId">Grade</Label>
              <Select
                onValueChange={(value) => setValue("gradeId", value)}
                value={watch("gradeId")}
                disabled={gradesLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Grades</SelectLabel>
                    {gradesData?.results?.map((grade) => (
                      <SelectItem key={grade.id} value={grade.id}>
                        {grade.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formState.errors.gradeId && (
                <p className="text-sm text-red-500">
                  {formState.errors.gradeId.message}
                </p>
              )}
            </div>

            {/* Tutor Select */}
            <div className="grid gap-3">
              <Label htmlFor="tutorId">Tutor</Label>
              <Select
                onValueChange={(value) => setValue("tutorId", value)}
                value={watch("tutorId")}
                disabled={tutorsLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a tutor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tutors</SelectLabel>
                    {tutorsData?.results?.map((tutor) => (
                      <SelectItem key={tutor.id} value={tutor.id}>
                        {/* change depending on API field */}
                        {tutor.fullName ||
                          `${tutor.firstName} ${tutor.lastName}`}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formState.errors.tutorId && (
                <p className="text-sm text-red-500">
                  {formState.errors.tutorId.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-700 text-white hover:bg-blue-500"
              isLoading={isUpdating}
              onClick={form.handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
