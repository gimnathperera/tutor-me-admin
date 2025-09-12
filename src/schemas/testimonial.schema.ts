import { z } from "zod";

export const testimonialSchema = z.object({
  content: z.string().min(1, "Content is required"),
  rating: z.number().min(1, "Rating is required"), // number instead of string
  owner: z.object({
    name: z.string().min(1, "Owner name is required"),
    role: z.string().min(1, "Owner role is required"),
    avatar: z.string().url("Avatar must be a valid URL"),
  }),
});

export type TestimonialSchema = z.infer<typeof testimonialSchema>;

export const initialFormValues: TestimonialSchema = {
  content: "",
  rating: 0,
  owner: {
    name: "",
    role: "",
    avatar: "",
  },
};
