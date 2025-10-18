"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSendTempPasswordMutation } from "@/store/api/splits/tutors";
import { Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ResetPasswordProps {
  userId: string;
}

export function ResetPassword({ userId }: ResetPasswordProps) {
  const [open, setOpen] = useState(false);
  const [resendPassword, { isLoading }] = useSendTempPasswordMutation();

  const handleResend = async () => {
    try {
      // unwrap() throws error if mutation fails
      await resendPassword(userId).unwrap();

      toast.success("Temporary password sent successfully!");
      setOpen(false); // close dialog on success
    } catch (error) {
      // handle backend or network errors
      //const message =getErrorInApiResult({ error }) || "Failed to send temporary password";
      const message = `Failed to send temporary password : ${error}`;
      toast.error(message);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Send className="cursor-pointer text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white" />
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white dark:bg-gray-800 dark:text-white/90 z-50">
        <AlertDialogHeader>
          <AlertDialogTitle>Send Temporary Password?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will send a temporary password to the user via email.
            This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleResend}
            disabled={isLoading}
            className="bg-red-500 text-white disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Resend Password"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
