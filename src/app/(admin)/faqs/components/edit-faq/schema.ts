import { z } from "zod";

export const updateFaqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

export type UpdateFaqSchema = z.infer<typeof updateFaqSchema>;

export const initialFaqFormValues = {
  question: "",
  answer: "",
};
