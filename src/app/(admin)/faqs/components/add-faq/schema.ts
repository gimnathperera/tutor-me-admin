import { z } from "zod";
import {
  FAQ_CATEGORY_VALUES,
  DEFAULT_FAQ_CATEGORY,
} from "@/lib/faq-categories";

export const createFaqSchema = z.object({
  category: z.enum(FAQ_CATEGORY_VALUES),
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

export type CreateFaqSchema = z.infer<typeof createFaqSchema>;

export const initialFaqFormValues: CreateFaqSchema = {
  category: DEFAULT_FAQ_CATEGORY,
  question: "",
  answer: "",
};
