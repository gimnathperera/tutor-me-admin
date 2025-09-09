import { z } from "zod";

export const createTestimonialSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});
export type CreateTestimonialSchema = z.infer<typeof createTestimonialSchema>;

export const initialFormValues = {
  title: "",
  description: "",
};
