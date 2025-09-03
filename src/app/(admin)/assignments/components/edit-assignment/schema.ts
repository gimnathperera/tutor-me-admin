import { z } from "zod";

export const updateAssignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  assignmentNumber: z.string().min(1, "Assignment Number is required"),
  address: z.string().min(1, "Address is required"),
  duration: z.string().min(1, "Duration is required"),
  assignmentPrice: z.string().min(0, "Price must be positive"),
});

export type UpdateAssignmentSchema = z.infer<typeof updateAssignmentSchema>;
