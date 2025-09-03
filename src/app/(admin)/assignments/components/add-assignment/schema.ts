import { z } from "zod";

export const assignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  assignmentNumber: z.string().min(1, "Assignment Number is required"),
  address: z.string().min(1, "Address is required"),
  duration: z.string().min(1, "Duration is required"),
  assignmentPrice: z.string().min(1, "Price is required"),
  gradeId: z.string().min(1, "Grade is required"),
  tutorId: z.string().min(1, "Tutor is required"),
});

export type CreateAssignmentSchema = z.infer<typeof assignmentSchema>;

export const initialFormValues: CreateAssignmentSchema = {
  title: "",
  assignmentNumber: "",
  address: "",
  duration: "",
  assignmentPrice: "",
  gradeId: "",
  tutorId: "",
};
