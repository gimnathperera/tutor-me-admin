import { z } from "zod";

export const updateTestimonialSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});
export type UpdateTestimonialSchema = z.infer<typeof updateTestimonialSchema>;

export const initialFormValues = {
  title: "",
  description: "",
};
