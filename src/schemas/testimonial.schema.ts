import { z } from "zod";

export const testimonialSchema = z.object({
  content: z.string().min(1, "Title is required"),
  rating: z.string().min(1, "Description is required"),
});
export type TestimonialSchema = z.infer<typeof testimonialSchema>;

export const initialFormValues = {
  content: "",
  rating: "",
};
