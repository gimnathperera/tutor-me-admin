import { z } from "zod";

export const createInquirySchema = z.object({
  senderName: z.string().min(1, "Sender name is required"),
  senderEmail: z.string().min(1, "Sender email is required"),
  message: z.string().min(1, "Message is required"),
});

export type CreateInquirySchema = z.infer<typeof createInquirySchema>;

export const initialInquiryFormValues = {
  senderName: "",
  senderEmail: "",
  message: "",
};
