import { z } from "zod";

export const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});
export type TagSchema = z.infer<typeof tagSchema>;

export const initialFormValues = {
  name: "",
  description: "",
};
