import { z } from "zod";
import {
  FAQ_CATEGORY_VALUES,
  DEFAULT_FAQ_CATEGORY,
} from "@/lib/faq-categories";

export const updateFaqSchema = z.object({
  category: z.enum(FAQ_CATEGORY_VALUES),
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

export type UpdateFaqSchema = z.infer<typeof updateFaqSchema>;

export const initialFaqFormValues = {
  category: DEFAULT_FAQ_CATEGORY,
  question: "",
  answer: "",
};
